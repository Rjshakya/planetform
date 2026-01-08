import { Hono } from "hono";
import { authMiddleware } from "../middlewares/authMiddleware";
import { zValidator } from "@hono/zod-validator";
import { updateWorkspaceObject, workspaceObject } from "../utils/validation";

import {
  createWorkspaceService,
  deleteWorkspaceService,
  getUserWorkspaceService,
  getWorkspacesWithFormsService,
  updateWorkspaceFormService,
} from "../services/workspace";
import z from "zod";

const workspace = new Hono<{
  Variables: {
    userId: string | null;
  };
}>()

  .use(authMiddleware)
  .post("/", zValidator("json", workspaceObject), async (c) => {
    const params = c.req.valid("json");
    const workspace = await createWorkspaceService(params);
    if (!workspace) {
      return c.json(
        {
          message:
            "Failed to create workspace , only pro user can create workspaces more than one",
        },
        400
      );
    }

    return c.json({ workspace }, 200);
  })
  .get(
    "/:userId",
    zValidator("param", z.object({ userId: z.string().nonempty() })),
    async (c) => {
      const { userId } = c.req.valid("param");
      const workspace = await getUserWorkspaceService(userId);
      return c.json({ workspace });
    }
  )

  .get(
    "/forms/:userId",
    zValidator("param", z.object({ userId: z.string().nonempty() })),
    async (c) => {
      const { userId } = c.req.valid("param");
      const workspace = await getWorkspacesWithFormsService(userId);
      return c.json({ workspace });
    }
  )

  .patch("/", zValidator("json", updateWorkspaceObject), async (c) => {
    const params = c.req.valid("json");
    const workspace = await updateWorkspaceFormService(params);
    return c.json({ workspace }, 200);
  })

  .delete(
    ":workspaceId",
    zValidator("param", z.object({ workspaceId: z.string().nonempty() })),
    async (c) => {
      const { workspaceId } = c.req.valid("param");
      await deleteWorkspaceService(workspaceId);
      return c.json({ message: "Workspace deleted successfully" });
    }
  );

export default workspace;
