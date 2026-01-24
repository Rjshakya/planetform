import { Hono } from "hono";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
	getSubscriptionsPlansService,
	getUserSubscriptionsService,
} from "../services/subscription";

const subscription = new Hono<{
	Variables: {
		userId: string;
	};
}>()

	.use(authMiddleware)
	.get("/", async (c) => {
		const userId = c.get("userId");
		const subscriptions = await getUserSubscriptionsService(userId);
		return c.json({ subscriptions }, 200);
	})

	.get("/plans", async (c) => {
		const plans = await getSubscriptionsPlansService();
		return c.json({ plans }, 200);
	});
export default subscription;
