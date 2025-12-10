import { eq } from "drizzle-orm";
import { getDb } from "../db/config";
import { integration } from "../db/schema/integration";
import { getRedis } from "./redis";
import { user } from "../db/schema/auth";
import { sendEmail } from "./sendEmail";

interface IbreakIntegration {
  integrationId: string;
}

interface Icounter {
  count: number;
}

export const breakIntegration = async (params: IbreakIntegration) => {
  try {
    const { integrationId } = params;
    const db = await getDb();

    const key = `breakIntegration:${integrationId}`;
    const redis = getRedis();
    const counter = await redis.get<Icounter>(key);
    if (!counter) {
      await redis.set<Icounter>(key, { count: 1 });
      return;
    }

    const increment: Icounter = { count: counter.count + 1 };
    await redis.set<Icounter>(key, increment);
    if (counter.count > 4) {
      await db.delete(integration).where(eq(integration.id, integrationId));
      console.log("integration is breaked", counter.count);
      return;
    }

    console.log("breakIntegration:counter", counter.count);
  } catch (e) {}
};

export const sendbreakIntegrationMail = async (
  userId: string,
  integrationId: string
) => {
  try {
    const db = await getDb();
    const [userDetails] = await db
      .select({
        name: user.name,
        email: user.email,
        integrationType: integration.type,
      })
      .from(user)
      .leftJoin(integration, eq(integration.customerId, user.dodoCustomerId))
      .where(eq(user.id, userId));

    if (!userDetails.email) return;
    await sendEmail({
      from: "Raj <notifications@raj.planetform.xyz>",
      to: userDetails.email,
      subject: "Integration Break",
      body: `Hi ${userDetails.name} , you intergrations with ${integration.type} has recieved too much errors . That's why we are currently removing this error`,
    });
  } catch (e) {
    console.log("failed - sendMailToUser", userId, integrationId);
  }
};
