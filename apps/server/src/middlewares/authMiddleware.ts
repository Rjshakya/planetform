import { createMiddleware } from "hono/factory";
import { getAuth } from "../utils/auth";

export const authMiddleware = createMiddleware(async (c, next) => {
	const auth = await getAuth();
	const session = await auth.api.getSession({ headers: c.req.raw.headers });

	if (!session) {
		c.set("userId", null);
		return c.json({ message: "Unauthorized" }, 401);
	}

	c.set("userId", session.user.id);
	return await next();
});
