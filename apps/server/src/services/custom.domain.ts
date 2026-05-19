import { Result, TaggedError } from "better-result";
import { makeRepo } from "../db/config";
import { customDomainTable } from "../db/schema/custom-domain";
import {
  CreateCustomHostnameResponse,
  DeleteCustomHostnameResponse,
  GetCustomHostnameResponse,
  HostnameStatus,
} from "./cloudflare";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { InferInsertModel } from "drizzle-orm";
import { eq } from "drizzle-orm";

class CfError extends TaggedError("CfError")<{
  message: string;
  status?: number;
}>() { }

class CustomDomainError extends TaggedError("CustomDomainError")<{
  message: string;
  status?: number;
}>() { }

type CustomDomainModel = {
  id: string;
  formId: string;
  userId: string;
  hostName: string;
  cfId?: string;
  status?: HostnameStatus;
};

type CreateCustomDomainParams = {
  formId: CustomDomainModel["formId"];
  userId: CustomDomainModel["userId"];
  hostName: CustomDomainModel["hostName"];
};

type createCustomDomain = (
  params: CreateCustomDomainParams,
) => Promise<Result<CustomDomainModel, CfError>>;

export const DomainCNAME = "customers.planetform.xyz";

type deleteCustomDomain = (id: CustomDomainModel["id"]) => CustomDomainModel;

export const getDomainCname = () => DomainCNAME;

const repo = async (db: NodePgDatabase) => {
  return makeRepo<typeof customDomainTable>(db)(customDomainTable);
};

export let createCustomHostname =
  (config: { cfZoneId: string; cfApiToken: string }) =>
    (params: {
      hostName: CustomDomainModel["hostName"];
    }) =>
      Result.tryPromise({
        try: async () => {
          const { cfZoneId, cfApiToken } = config;
          const { hostName } = params;

          const response = await fetch(
            `https://api.cloudflare.com/client/v4/zones/${cfZoneId}/custom_hostnames`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${cfApiToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                hostname: hostName,
                ssl: {
                  method: "http", // CF validates by making an HTTP request to the domain
                  type: "dv", // domain validated cert (free, automatic)
                }
              }),
            },
          );
          const data = (await response.json()) as CreateCustomHostnameResponse;

          if (!data.success) {

            throw {
              message: data.errors?.[0]?.message,
              status: data?.errors?.[0]?.code,
            };
          }

          return data.result;
        },
        catch: (error) => {
          console.error(error)
          return new CfError({ message: String(error) });
        },
      });

export const createCustomDomain =
  (deps: { db: NodePgDatabase<any>; cfZoneId: string; cfApiToken: string }) =>
    (params: CreateCustomDomainParams) => {
      return Result.gen(async function*() {
        const { db, cfZoneId, cfApiToken } = deps;
        const { formId, userId, hostName } = params;

        const { insert, withTransaction } = await repo(db);

        // db transaction
        const transaction = yield* Result.await(withTransaction(async (tx) => {

          const createHostNameFn = createCustomHostname({ cfZoneId, cfApiToken });
          const hostNameResult = await createHostNameFn({ hostName });

          if (!hostNameResult.isOk()) {
            console.error(hostNameResult.error)
            throw hostNameResult.error
          };

          const { id, hostname, status } = hostNameResult.value;
          const insertResult = await insert({
            formId,
            userId,
            hostName: hostname,
            status: status ?? "pending",
            cfId: id,
          })(tx)

          if (insertResult.isErr()) {
            const deleteFn = deleteCustomHostname({ cfApiToken, cfZoneId })
            await deleteFn({ cfId: id })
          }

          return insertResult;

        }))

        const result = yield* transaction
        return Result.ok(result[0]);


      });
    };

export const deleteCustomHostname =
  (config: { cfZoneId: string; cfApiToken: string }) =>
    (params: { cfId: string }) =>
      Result.tryPromise({
        try: async () => {
          const { cfZoneId, cfApiToken } = config;
          const { cfId } = params;

          const response = await fetch(
            `https://api.cloudflare.com/client/v4/zones/${cfZoneId}/custom_hostnames/${cfId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${cfApiToken}`,
                "Content-Type": "application/json",
              },
            },
          );
          const data = (await response.json()) as DeleteCustomHostnameResponse;

          if (!data.success) {
            throw {
              message: String(data.errors?.[0]?.message),
              status: data?.errors?.[0]?.code,
            }
          }

          return data.result;
        },
        catch: (error) => {
          console.error(error)
          return new CfError({ message: String(error) });
        },
      });

export const deleteCustomDomain =
  (deps: { db: NodePgDatabase<any>; cfZoneId: string; cfApiToken: string }) =>
    (params: { id: CustomDomainModel["id"] }) => {
      return Result.gen(async function*() {
        const { db, cfZoneId, cfApiToken } = deps;
        const { id } = params;
        const { selectById, withTransaction, deleteById } = await repo(db);

        const transaction = yield* Result.await(withTransaction(async (tx) => {
          const domainRecords = await selectById(tx)("id")(id);

          if (!domainRecords.isOk()) {
            console.error(domainRecords.error)
            throw domainRecords.error
          }

          const { cfId } = domainRecords.value[0]

          if (!cfId) {
            throw new CustomDomainError({
              message: "Domain has no Cloudflare ID associated",
              status: 400,
            })
          }

          const deletedRecords = await deleteById("id")(id)(tx);
          const deleteHostNameFn = deleteCustomHostname({ cfZoneId, cfApiToken });
          await deleteHostNameFn({ cfId: cfId });
          return deletedRecords;

        }))
        const result = yield* transaction
        return Result.ok(result[0]);
      });
    };

export const getCustomHostname =
  (config: { cfZoneId: string; cfApiToken: string }) =>
    (params: { cfId: string }) =>
      Result.tryPromise({
        try: async () => {
          const { cfZoneId, cfApiToken } = config;
          const { cfId } = params;

          const response = await fetch(
            `https://api.cloudflare.com/client/v4/zones/${cfZoneId}/custom_hostnames/${cfId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${cfApiToken}`,
                "Content-Type": "application/json",
              },
            },
          );
          const data = (await response.json()) as GetCustomHostnameResponse;

          if (!data.success) {
            throw {
              message: `failed to get custom hostname from cf`,
              error: data.errors[0],
            };
          }

          return data.result;
        },
        catch: (error) => {
          return new CfError({ message: String(error) });
        },
      });

export type DomainStatus = {
  id: string;
  hostName: string;
  status?: HostnameStatus;
  sslStatus?: string;
  // verificationErrors?: string[];
  // ownershipVerification?: {
  //   name?: string;
  //   type?: "txt";
  //   value?: string;
  // };
  // sslValidationRecords?: Array<{
  //   cname?: string;
  //   cname_target?: string;
  //   emails?: string[];
  //   http_body?: string;
  //   http_url?: string;
  //   status?: string;
  //   txt_name?: string;
  //   txt_value?: string;
  // }>;
  // sslValidationErrors?: Array<{ message?: string }>;
};

export const getDomainStatus =
  (deps: { db: NodePgDatabase<any>; cfZoneId: string; cfApiToken: string }) =>
    (params: { id: CustomDomainModel["id"] }) => {
      return Result.gen(async function*() {
        const { db, cfZoneId, cfApiToken } = deps;
        const { id } = params;
        const { selectById } = await repo(db);

        const domainRecords = yield* await selectById()("id")(id);
        const domain = domainRecords[0];

        if (!domain.cfId) {
          return yield* Result.err(
            new CustomDomainError({
              message: "Domain has no Cloudflare ID associated",
              status: 400,
            }),
          );
        }

        const getHostNameFn = getCustomHostname({ cfZoneId, cfApiToken });
        const hostNameResult = yield* await getHostNameFn({ cfId: domain.cfId });

        return Result.ok({
          id: domain.id,
          hostName: domain.hostName,
          status: hostNameResult.status,
          sslStatus: hostNameResult.ssl?.status,
        } satisfies DomainStatus);
      });
    };

type UpdateCustomDomainParams = {
  id: CustomDomainModel["id"];
  formId: string;
  status: string;
  userId: string;
  hostName: string;
};

export const updateCustomDomain =
  (deps: { db: NodePgDatabase<any> }) =>
    async (params: UpdateCustomDomainParams) => {
      const { db } = deps;
      const { id, formId, status, userId, hostName } = params;
      const repo = makeRepo<typeof customDomainTable>(db)(customDomainTable)

      const updatedData = await repo.update("id")(id, { formId, status, userId, hostName })()
      return updatedData
    };
