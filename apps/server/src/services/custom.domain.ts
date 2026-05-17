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

export const createCustomHostname =
  (config: { cfZoneId: string; cfApiToken: string }) =>
    (params: {
      formId: CustomDomainModel["formId"];
      hostName: CustomDomainModel["hostName"];
    }) =>
      Result.tryPromise({
        try: async () => {
          const { cfZoneId, cfApiToken } = config;
          const { formId, hostName } = params;

          console.log("config", config)

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
                },
                custom_metadata: {
                  formId,
                },
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
      return Result.gen(async function* () {
        const { db, cfZoneId, cfApiToken } = deps;
        const { formId, userId, hostName } = params;

        const { insert, withTransaction } = await repo(db);

        console.log("deps", { cfZoneId, cfApiToken })
        const transaction = withTransaction(async (tx) => {
          const createHostNameFn = createCustomHostname({ cfZoneId, cfApiToken });
          const hostNameObj = await createHostNameFn({ formId, hostName });

          const { id, hostname, status } = hostNameObj.match({
            ok: (a) => a,
            err: (e) => {
              console.error(e);
              throw e;
            },
          });

          const insertResult = await insert({
            formId,
            userId,
            hostName: hostname,
            status: status ?? "pending",
            cfId: id,
          })(tx);

          return insertResult;
        });

        const result = yield* Result.await(transaction);
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
            throw new CfError({
              message: String(data.errors?.[0]?.message),
              status: data?.errors?.[0]?.code,
            });
          }

          return data.result;
        },
        catch: (error) => {
          return new CfError({ message: String(error) });
        },
      });

export const deleteCustomDomain =
  (deps: { db: NodePgDatabase<any>; cfZoneId: string; cfApiToken: string }) =>
    (params: { id: CustomDomainModel["id"] }) => {
      return Result.gen(async function* () {
        const { db, cfZoneId, cfApiToken } = deps;
        const { id } = params;
        const { selectById, withTransaction, deleteById } = await repo(db);

        const transaction = withTransaction(async (tx) => {
          const domainRecords = await selectById(tx)("id")(id);
          const domain = domainRecords.match({
            ok: (d) => d[0],
            err: (e) => {
              throw e;
            },
          });

          if (!domain.cfId) {
            throw Result.err(
              new CustomDomainError({
                message: "Domain has no Cloudflare ID associated",
                status: 400,
              }),
            );
          }

          const deleteHostNameFn = deleteCustomHostname({ cfZoneId, cfApiToken });
          await deleteHostNameFn({ cfId: domain.cfId });

          const deletedRecords = await deleteById("id")(id)(tx);
          return deletedRecords;
        });
        const result = yield* Result.await(transaction);

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
      return Result.gen(async function* () {
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
