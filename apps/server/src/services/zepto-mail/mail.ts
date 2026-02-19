import { Result } from "better-result";
import { env } from "cloudflare:workers";
import { SendMailClient, type Sendmail } from "zeptomail";

const url = "https://api.zeptomail.in/v1.1/email";
const token = env.ZEPTO_MAIL_API_KEY;
export const zeptoMail = new SendMailClient({ url, token });

type SendEmailParams =
  | {
      emailParams: Sendmail;
      isNotification: true;
      mailFromMe?: never;
    }
  | {
      emailParams: Sendmail;
      isNotification?: never;
      mailFromMe: true;
    };

/**
 *
 * @param SendEmailParams
 * @returns true if email is sent successfully, otherwise throws an error;
 *
 * notification mail: notifications@planetform.xyz
 *
 * mail from me: raj@planetform.xyz
 */
export const sendZeptoMail = async ({
  emailParams,
  isNotification,
  mailFromMe,
}: SendEmailParams) => {
  const { to } = emailParams;

  let from = emailParams.from;

  if (isNotification) {
    from = { address: "notifications@planetform.xyz", name: "planetform" };
  }

  if (mailFromMe) {
    from = { address: "raj@planetform.xyz", name: "raj" };
  }

  const execute = async () => {
    await zeptoMail.sendMail({ ...emailParams, from });
    return true;
  };

  const result = await Result.tryPromise(execute);

  if (Result.isOk(result)) {
    console.log(
      `Email sent successfully to ${to[0].email_address.address} , from : ${from.address}`,
    );
    return true;
  } else {
    console.error({
      e: result.error,
      message: `Failed to send email to ${to}:`,
    });
    throw new Error(`Failed to send email to ${to}`);
  }
};
