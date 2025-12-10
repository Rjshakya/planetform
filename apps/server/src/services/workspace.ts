import { getDb } from "../db/config.js";
import { workspace as workspaceTable } from "../db/schema/workspace";
import { eq } from "drizzle-orm";
import { commonCatch } from "../utils/error";
import { getIsProUser } from "../utils/subscription.js";

interface IupdateWorkspace {
  data: {
    name: string;
  };
  workspaceId: string;
}

export const createWorkspaceService = async (
  workspaceValues: typeof workspaceTable.$inferInsert
) => {
  try {
    if (!workspaceValues.customerId) {
      return false;
    }
    const db = await getDb();
    const workspaces = await db
      .select({ id: workspaceTable.id })
      .from(workspaceTable)
      .where(eq(workspaceTable.owner, workspaceValues.owner));

    if (workspaces.length) {
      const isProUser = await getIsProUser(workspaceValues.customerId);
      if (!isProUser) {
        return false;
      }
    }

    const workspace = await db
      .insert(workspaceTable)
      .values(workspaceValues)
      .returning({
        id: workspaceTable.id,
        name: workspaceTable.name,
        owner: workspaceTable.owner,
      });

    return workspace[0];
  } catch (e) {
    commonCatch(e);
  }
};

export const getUserWorkspaceService = async (
  owner: typeof workspaceTable.$inferSelect.owner
) => {
  try {
    const db = await getDb();
    const workspace = await db
      .select()
      .from(workspaceTable)
      .where(eq(workspaceTable.owner, owner));

    return workspace;
  } catch (e) {
    commonCatch(e);
  }
};

export const getWorkspacesWithFormsService = async (userId: string) => {
  try {
    const db = await getDb();
    const res = await db.query.workspace.findMany({
      where: eq(workspaceTable.owner, userId),
      columns: {
        id: true,
        name: true,
      },
      with: {
        forms: {
          columns: {
            name: true,
            shortId: true,
          },
        },
      },
    });

    return res;
  } catch (e) {
    commonCatch(e);
  }
};

export const updateWorkspaceFormService = async (params: IupdateWorkspace) => {
  try {
    const db = await getDb();
    const [updated] = await db
      .update(workspaceTable)
      .set({ ...params.data })
      .where(eq(workspaceTable.id, params.workspaceId))
      .returning();
    return updated;
  } catch (e) {
    commonCatch(e);
  }
};

export const deleteWorkspaceService = async (
  workspaceId: typeof workspaceTable.$inferInsert.id
) => {
  try {
    const db = await getDb();
    const deleted = await db
      .delete(workspaceTable)
      .where(eq(workspaceTable.id, workspaceId!))
      .returning({ id: workspaceTable.id, user: workspaceTable.owner });

    return deleted[0];
  } catch (e) {
    commonCatch(e);
  }
};
