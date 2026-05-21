import { env } from "cloudflare:workers";
import {
  drizzle,
  NodePgQueryResultHKT,
  type NodePgDatabase,
} from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as auth from "./schema/auth";
import * as customDomain from "./schema/custom-domain";
import * as form from "./schema/form";
import * as formField from "./schema/form.fields";
import * as formSetting from "./schema/form.settings";
import * as integration from "./schema/integration";
import * as respondent from "./schema/respondent";
import * as response from "./schema/response";
import * as workspace from "./schema/workspace";
import {
  eq,
  type InferSelectModel,
  type InferInsertModel,
  type Table,
  ExtractTablesWithRelations,
} from "drizzle-orm";
import { Result, TaggedError } from "better-result";
import { PgTransaction } from "drizzle-orm/pg-core";

export class DBError extends TaggedError("DBError")<{ message: string }>() { }

export const getDb = async () => {
  const client = new Client({
    connectionString: env.HYPERDRIVE.connectionString,
  });

  await client.connect();

  return drizzle({
    client,
    schema: {
      ...auth,
      ...workspace,
      ...form,
      ...formField,
      ...formSetting,
      ...respondent,
      ...response,
      ...integration,
      ...customDomain,
    },
  });
};

export const makeRepo =
  <T extends Table<any>>(db: NodePgDatabase<any>) =>
    (table: T) => {
      const insert = (data: InferInsertModel<T>) => (tx?: TransactionDb) => {
        return Result.tryPromise({
          try: async () => {
            const result = await (tx ?? db)
              .insert(table)
              .values(data)
              .returning();
            return result;
          },
          catch: (e) => new DBError({ message: String(e) }),
        });
      };

      const update =
        (key: keyof InferSelectModel<T>) =>
          (id: string, data: InferInsertModel<T>) =>
            (tx?: TransactionDb) => {
              return Result.tryPromise({
                try: async () => {
                  const result = await (tx ?? db)
                    .update(table)
                    // @ts-ignore
                    .set(data)
                    //  @ts-ignore
                    .where(eq(table[key as keyof typeof table], id))
                    .returning();
                  return result;
                },
                catch: (e) => new DBError({ message: String(e) }),
              });
            };

      const deleteById =
        (key: keyof InferSelectModel<T>) =>
          (id: InferSelectModel<T>[typeof key]) =>
            (tx?: TransactionDb) => {
              return Result.tryPromise({
                try: async () => {
                  const result = await (tx ?? db)
                    .delete(table)
                    // @ts-ignore
                    .where(eq(table[key as keyof typeof table], id))
                    .returning()

                  return result;
                },
                catch: (e) => new DBError({ message: String(e) }),
              });
            };

      const select =
        (tx?: TransactionDb) =>
          (limit = 100) => {
            return Result.tryPromise({
              try: async () => {
                const result = await (tx ?? db)
                  .select()
                  // @ts-ignore
                  .from(table)
                  .limit(limit)
                return result as InferSelectModel<T>[];
              },
              catch: (e) => new DBError({ message: String(e) }),
            });
          };

      const selectById =
        (tx?: TransactionDb) =>
          (key: keyof InferSelectModel<T>) =>
            (id: string, limit = 100) =>
              Result.tryPromise({
                try: () =>
                  (tx ?? db)
                    .select()
                    // @ts-ignore
                    .from(table)
                    // @ts-ignore
                    .where(eq(table[key as keyof typeof table], id))
                    .limit(limit) as Promise<InferSelectModel<T>[]>,
                catch: (e) => new DBError({ message: String(e) }),
              });

      const withTransaction = <T, E>(
        fn: (tx: TransactionDb) => Promise<Result<T, E>>,
      ) =>
        Result.tryPromise({
          try: async () => {
            const result = await db.transaction(fn)
            if (!result.isOk()) {
              throw {
                message: "failed to complete db transaction",
                error: result.error
              }
            }

            return result.value

          },
          catch: (e) => new DBError({ message: String(e) }),
        });

      const wrap = <T>(f: (db: NodePgDatabase<any>) => Promise<T>) => {

        return Result.tryPromise({
          try: async () => await f(db),
          catch: (e) => new DBError({ message: String(e) })
        })
      }

      return {
        insert,
        update,
        deleteById,
        select,
        selectById,
        withTransaction,
        wrap
      };
    };

export type TransactionDb = PgTransaction<
  NodePgQueryResultHKT,
  Record<string, never>,
  ExtractTablesWithRelations<Record<string, never>>
>;

export const getDrizzleConfig = () => { };
