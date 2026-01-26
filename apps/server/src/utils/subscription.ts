import { Result } from "better-result";
import { polarClient } from "./auth";
import { SubscriptionServiceError } from "../errors";

export const getIsProUser = async (userId: string) => {
  const promise = async () => {
    const customer = await polarClient.customers.getStateExternal({
      externalId: userId,
    });

    if (customer.activeSubscriptions.length) {
      return true;
    }
    return false;
  };

  const execute = await Result.tryPromise({
    try: promise,
    catch: (e) =>
      new SubscriptionServiceError({ cause: e, operation: "getIsProUser" }),
  });

  if (Result.isOk(execute)) {
    return execute.value;
  } else {
    throw execute.error;
  }
};
