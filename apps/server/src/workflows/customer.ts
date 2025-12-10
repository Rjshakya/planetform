import {
  env,
  WorkflowEntrypoint,
  WorkflowEvent,
  WorkflowStep,
} from "cloudflare:workers";
import { NonRetryableError } from "cloudflare:workflows";
import { user } from "../db/schema/auth";
import { dodoPayments } from "../utils/auth";
import { getDb } from "../db/config";
import { eq } from "drizzle-orm";
import { sendNewCustomerEmail } from "../utils/sendEmail";

export interface IdodoCustomerCreateflow {
  userId: string;
  name: string;
  email: string;
}

export class DodoCustomerCreateFlow extends WorkflowEntrypoint {
  async run(
    event: Readonly<WorkflowEvent<IdodoCustomerCreateflow>>,
    step: WorkflowStep
  ) {
    const { email, name, userId } = event.payload;
    if (!email || !name || !userId) {
      throw new NonRetryableError("email , name or userId doesn't exist");
    }

    const customer = await step.do(
      "create-dodo-customer",
      {
        retries: { delay: "15 seconds", limit: 5, backoff: "exponential" },
        timeout: "20 minutes",
      },
      async () => {
        try {
          const db = await getDb();
          const customer = await dodoPayments.customers.list({
            email: email,
          });
          const customerId = customer?.items?.[0]?.customer_id;

          if (customerId) {
            await dodoPayments.customers.update(customerId, { name });
            const [cusInDb] = await db
              .update(user)
              .set({
                dodoCustomerId: customerId,
              })
              .where(eq(user.id, userId))
              .returning({ id: user.id, email: user.email, name: user.name });

            return cusInDb;
          } else {
            const newCustomer = await dodoPayments.customers.create({
              email,
              name,
            });
            if (!newCustomer?.customer_id) {
              throw new Error("dodoPayments customer creation error");
            }
            const [cusInDb] = await db
              .update(user)
              .set({
                dodoCustomerId: newCustomer?.customer_id,
              })
              .where(eq(user.id, userId))
              .returning({ id: user.id, email: user.email, name: user.name });

            console.log("new customer created", newCustomer);

            return cusInDb;
          }
        } catch (e) {
          console.log(e);
          throw new Error("failed to create-dodo-customer");
        }
      }
    );

    await step.sleep("sleep before sending email", "2 seconds");

    await step.do("send-email", async () => {
      try {
        if (!customer?.email || !customer?.name) {
          throw new NonRetryableError(
            "customer email not found , failed to send email"
          );
        }

        await sendNewCustomerEmail({
          email: customer?.email,
          name: customer?.name,
        });
      } catch (e) {
        console.log(e);

        throw new Error("failed to send welcome email");
      }
    });
  }
}
