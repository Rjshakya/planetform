import useSWR, { mutate } from "swr";
import { client } from "@/lib/hc";


// ─── Types ───────────────────────────────────────────────────────────────────

export type HostnameStatus =
  | "active"
  | "pending"
  | "active_redeploying"
  | "moved"
  | "pending_deletion"
  | "deleted"
  | "pending_blocked"
  | "pending_migration"
  | "pending_provisioned"
  | "test_pending"
  | "test_active"
  | "test_active_apex"
  | "test_blocked"
  | "test_failed"
  | "provisioned"
  | "blocked";

export type SSLStatus =
  | "initializing"
  | "pending_validation"
  | "deleted"
  | "pending_issuance"
  | "pending_deployment"
  | "pending_deletion"
  | "pending_expiration"
  | "expired"
  | "active"
  | "initializing_timed_out"
  | "validation_timed_out"
  | "issuance_timed_out"
  | "deployment_timed_out"
  | "deletion_timed_out"
  | "pending_cleanup"
  | "staging_deployment"
  | "staging_active"
  | "deactivating"
  | "inactive"
  | "backup_issued"
  | "holding_deployment";

export interface CustomDomain {
  id: string;
  userId: string;
  formId: string;
  cfId: string | null;
  hostName: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DomainStatus {
  id: string;
  hostName: string;
  status?: HostnameStatus;
  sslStatus?: SSLStatus;
}

export interface CreateCustomDomainPayload {
  formId: string;
  hostName: string;
}

export interface UpdateCustomDomainPayload {
  formId: string;
  status: string;
  hostName: string;
}

// ─── SWR Keys ─────────────────────────────────────────────────────────────────

export const keyOfUseCustomDomains = (userId: string) =>
  `useCustomDomains:${userId}`;

export const keyOfUseCustomDomainByForm = (formId: string) =>
  `useCustomDomainByForm:${formId}`;

export const keyOfUseCustomDomain = (id: string) => `useCustomDomain:${id}`;

export const keyOfUseDomainStatus = (id: string) => `useDomainStatus:${id}`;

export const keyOfUseDomainCname = () => "useDomainCname";

// ─── Fetcher Functions ────────────────────────────────────────────────────────

export const getCustomDomains = async () => {
  const res = await client.api.customDomain.$get();

  if (!res.ok) throw new Error("Failed to fetch custom domains");

  const json = (await res.json()) as { data: CustomDomain[]; message: string };
  return json.data;
};

export const getCustomDomainByForm = async (formId: string) => {
  const res = await client.api.customDomain.form[":formId"].$get({
    param: { formId },
  });

  if (!res.ok) throw new Error("Failed to fetch custom domains for form");

  const json = (await res.json()) as { data: CustomDomain[]; message: string };
  return json.data;
};

export const getCustomDomain = async (id: string) => {
  const res = await client.api.customDomain[":id"].$get({
    param: { id },
  });

  if (!res.ok) throw new Error("Failed to fetch custom domain");

  const json = (await res.json()) as { data: CustomDomain; message: string };
  return json.data;
};

export const getDomainStatus = async (id: string) => {
  const res = await client.api.customDomain[":id"].status.$get({
    param: { id },
  });

  if (!res.ok) throw new Error("Failed to fetch domain status");

  const json = (await res.json()) as { data: DomainStatus; message: string };
  return json.data;
};

export const getDomainCname = async () => {
  const res = await client.api.customDomain.cname.$get();

  if (!res.ok) throw new Error("Failed to fetch CNAME");

  const json = (await res.json()) as {
    data: { cname: string };
    message: string;
  };
  return json.data.cname;
};

export const getCustomDomainByHostname = async (hostname: string) => {
  const res = await client.api.customDomain.hostname[":hostname"].$get({
    param: { hostname },
  });

  if (!res.ok) throw new Error("Failed to fetch custom domain by hostname");

  const json = (await res.json()) as { data: CustomDomain; message: string };
  return json.data;
};

// ─── SWR Hooks ────────────────────────────────────────────────────────────────

export const useCustomDomains = (userId: string | null) => {
  const fetcher = (key: string) => getCustomDomains();
  const { data, error, isLoading, mutate } = useSWR(
    userId ? keyOfUseCustomDomains(userId) : null,
    fetcher,
  );

  return {
    domains: data,
    customDomainsError: error,
    customDomainsLoading: isLoading,
    mutate,
  };
};

export const useCustomDomainByForm = (formId: string | null) => {
  const fetcher = (key: string) => getCustomDomainByForm(key.split(":")[1]);
  const { data, error, isLoading, mutate } = useSWR(
    formId ? keyOfUseCustomDomainByForm(formId) : null,
    fetcher,
  );

  return {
    domains: data,
    customDomainByFormError: error,
    customDomainByFormLoading: isLoading,
    mutate,
  };
};

export const useCustomDomain = (id: string | null) => {
  const fetcher = (key: string) => getCustomDomain(key.split(":")[1]);
  const { data, error, isLoading, mutate } = useSWR(
    id ? keyOfUseCustomDomain(id) : null,
    fetcher,
  );

  return {
    domain: data,
    customDomainError: error,
    customDomainLoading: isLoading,
    mutate,
  };
};

export const useDomainStatus = (id: string | null) => {
  const fetcher = (key: string) => getDomainStatus(key.split(":")[1]);
  const { data, error, isLoading, mutate } = useSWR(
    id ? keyOfUseDomainStatus(id) : null,
    fetcher,
    {
      refreshInterval: (data) => {

        if (!data || !data.status) return 0
        const status = data.status

        if (status === "deleted"
          || status === "active"
          || status === "blocked"
          || status === "moved") {

          return 0
        }



        return 10000
      }
    }
  );

  return {
    status: data,
    domainStatusError: error,
    domainStatusLoading: isLoading,
    mutate,
  };
};

export const useDomainCname = () => {
  const fetcher = () => getDomainCname();
  const { data, error, isLoading, mutate } = useSWR(
    keyOfUseDomainCname(),
    fetcher,
  );

  return {
    cname: data,
    domainCnameError: error,
    domainCnameLoading: isLoading,
    mutate,
  };
};




// ─── Mutation Functions ───────────────────────────────────────────────────────

export const createCustomDomain = async (
  payload: CreateCustomDomainPayload,
  userId: string,
) => {
  const res = await client.api.customDomain.$post({
    json: payload,
  });

  if (!res.ok) throw new Error("Failed to create custom domain");

  const json = (await res.json()) as { data: CustomDomain; message: string };

  // Revalidate caches
  mutate(keyOfUseCustomDomains(userId));
  mutate(keyOfUseCustomDomainByForm(payload.formId));

  return json.data;
};

export const deleteCustomDomain = async (
  id: string,
  userId: string,
  formId: string,
) => {
  const res = await client.api.customDomain[":id"].$delete({
    param: { id },
  });

  if (!res.ok) throw new Error("Failed to delete custom domain");

  const json = (await res.json()) as { data: CustomDomain; message: string };

  // Revalidate caches
  mutate(keyOfUseCustomDomains(userId));
  mutate(keyOfUseCustomDomainByForm(formId));
  mutate(keyOfUseCustomDomain(id), null, false); // Remove single domain from cache

  return json.data;
};

export const updateCustomDomain = async (
  id: string,
  payload: UpdateCustomDomainPayload,
  userId: string,
) => {
  const res = await client.api.customDomain[":id"].$post({
    param: { id },
    json: payload,
  });

  if (!res.ok) throw new Error("Failed to update custom domain");

  const json = (await res.json()) as { data: CustomDomain; message: string };

  // Revalidate caches
  mutate(keyOfUseCustomDomains(userId));
  mutate(keyOfUseCustomDomain(id));

  return json.data;
};
