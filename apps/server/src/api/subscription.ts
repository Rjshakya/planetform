import { Hono } from "hono";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getSubscriptionPlansService } from "../services/subscription";

const subscription = new Hono<{
  Variables: {
    userId: string;
  };
}>()
  .use(authMiddleware)
  .get("/", async (c) => {
    const subscriptions = await getSubscriptionPlansService();
    return c.json({ subscriptions }, 200);
  })

export default subscription;
