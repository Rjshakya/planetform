import { client } from "@/lib/hc";
import useSWR from "swr";

export interface IworkspaceWithForms {
  name: string | null;
  id: string;
  forms: {
    name: string;
    shortId: string | null;
  }[];
}
export type WorkspaceWithForms = IworkspaceWithForms[] | undefined;
export type WorkspaceForm = {
  id: string | null;
  name: string;
  createdAt: string;
};
export type Workspace = {
  name: string | null;
  id: string;
  forms: WorkspaceForm[];
};

export const useUserWorkspace = (userId: string) => {
  const fetcher = () => getUserWorkspaces(userId);

  const { data, error, isLoading, mutate } = useSWR(
    userId ? `useUserWorkspace:${userId}` : null,
    fetcher,
  );

  return {
    workspaces: data?.workspace,
    workspaceError: error,
    workspaceLoading: isLoading,
    mutate,
  };
};

export const useWorkspaceWithForms = (userId: string) => {
  const fetcher = () => getWorkspaceWithForms(userId);
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `useWorkspaceWithForms:${userId}` : null,
    fetcher,
  );

  return {
    workspaces: data as WorkspaceWithForms,
    workspaceWithFormError: error,
    workspaceWithFormLoading: isLoading,
    mutate,
  };
};

export const useWorkspace = (workspaceId: string) => {
  const fetcher = () => getWorkspace(workspaceId);
  const { data, error, isLoading, mutate } = useSWR(
    workspaceId ? `useWorkspace:${workspaceId}` : null,
    fetcher,
  );

  return {
    workspace: data?.workspace as Workspace,
    workspaceError: error,
    workspaceLoading: isLoading,
    mutate,
  };
};

export const keyOfuseWorkspace = (workspaceId: string) =>
  `useWorkspace:${workspaceId}`;

export const getUserWorkspaces = async (userId: string) => {
  const res = await client.api.workspace[":userId"].$get({
    param: { userId },
  });
  const workspace = await res.json();
  return workspace;
};

export const getWorkspace = async (workspaceId: string) => {
  const res = await client.api.workspace.form[":workspaceId"].$get({
    param: { workspaceId },
  });
  return await res.json();
};

export const getWorkspaceWithForms = async (userId: string) => {
  const res = await client.api.workspace.forms[":userId"].$get({
    param: { userId },
  });
  const workspace = await res.json();
  return workspace.workspace;
};

export const createWorkspace = async (name: string, owner: string) => {
  const res = await client.api.workspace.$post({ json: { owner, name } });
  if (!res.ok) throw new Error("failed to createWorkspace");
  const json = await res.json();
  return json.workspace?.id;
};

export const updateWorkspace = async (
  workspaceId: string,
  data: { name: string },
) => {
  const res = await client.api.workspace.$patch({
    json: { workspaceId, data },
  });
  if (!res.ok) throw new Error("failed to update workspace");

  const json = await res.json();
  return json.workspace?.id;
};

export const deleteWorkspace = async (workspaceId: string) => {
  const res = await client.api.workspace[":workspaceId"].$delete({
    param: { workspaceId },
  });

  if (!res.ok) throw new Error("failed to delete workspace");
  const json = await res.json();
  return json.message;
};
