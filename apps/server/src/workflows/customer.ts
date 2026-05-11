import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep,
} from "cloudflare:workers";
import { sendZeptoMail } from "../services/zepto-mail/mail";
import { PERSONAL_EMAIL } from "../utils/mail";

export interface ICustomerOnboardingWorkflowParams {
  userEmail: string;
  userId: string;
  userName: string;
}

export class CustomerOnboardingWorkflow extends WorkflowEntrypoint {
  async run(
    event: Readonly<WorkflowEvent<ICustomerOnboardingWorkflowParams>>,
    step: WorkflowStep,
  ) {
    const { userEmail, userId, userName } = event.payload;

    await step.do("sendWelcomeEmail", async () => {
      try {
        await sendZeptoMail({
          emailParams: {
            from: { address: PERSONAL_EMAIL, name: "raj" },
            to: [
              {
                email_address: {
                  address: userEmail,
                  name: userName,
                },
              },
            ],
            subject: "Welcome to Planetform!",
            textbody: `Hi ${userName},\n\n Welcome to Planetform! , I'm raj, founder of planetform. I'm very excited to have you on board and i am very glad you chose planetform. If you have any questions or need assistance, feel free to reach out.\n\nBest regards,\nThe Planetform Team`,
          },
          mailFromMe: true,
        });
      } catch (error) {
        console.error({
          message: "Failed to send welcome email",
          error,
          userEmail,
          userId,
        });

        throw new Error("Failed to send welcome email");
      }
    });
  }
}
