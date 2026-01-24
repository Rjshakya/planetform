import { dodoPayments } from "./auth";
import { commonCatch } from "./error";

export const getIsProUser = async (customerId: string) => {
	try {
		const subscriptions = await dodoPayments.subscriptions.list({
			customer_id: customerId,
		});
		const activeSubscriptions = subscriptions?.items?.filter(
			(item) => item?.status === "active",
		);

		if (activeSubscriptions?.length) {
			return true;
		}
		return false;
	} catch (e) {
		commonCatch(e);
	}
};
