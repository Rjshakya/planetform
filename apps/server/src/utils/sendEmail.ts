
import { Resend } from "resend";
import { env } from "cloudflare:workers";

export interface IsendEmail {
  from: string;
  to: string;
  subject: string;
  body: string;
  html?: string;
}

export interface IsendNewCustomerEmail {
  email: string;
  name: string;
}
const emailClientApiKey = env.RESEND_API_KEY;
const emailClient = new Resend(emailClientApiKey);

export const sendNewCustomerEmail = async (params: IsendNewCustomerEmail) => {
  try {
    const htmlStr = `<div style="font-family: Arial, sans-serif; color:#1a1a1a; padding: 24px;">
  <h2 style="margin-bottom: 12px;">Welcome to Planetform , ${params.name}</h2>

  <p style="font-size: 15px; line-height: 1.6;">
    Hey,  
    <br/>I’m genuinely happy you’re here. Getting started with a new tool can
    sometimes feel like a bit of a leap, so thank you for placing your trust
    in us. Planetform was built for people like you — creators who want their
    ideas to take shape smoothly and confidently.
  </p>

  <p style="font-size: 15px; line-height: 1.6;">
    As you explore the app, just know this: you’re not doing it alone.  
    If anything feels confusing,  we’re right here to help.
    Every question you ask helps us make Planetform better for everyone.
  </p>

  <p style="margin-top: 20px; font-size: 15px;">
    Warmly,<br/>
    <strong>Raj from Planetform</strong>
  </p>

  <hr style="margin-top: 30px; border: none; height:1px; background:#eaeaea;" />

  <p style="font-size: 14px; color:#555;">
    PS: I’d love to know — what brought you to Planetform ${params.name}?  
    Just hit reply, I read every message personally.
  </p>
</div>`;

    // const res = await inbound.emails.send({
    //   from: "raj@planetform.xyz",
    //   to: params.email,
    //   subject: "Welcome to Planetform",
    //   text: "Thanks for signing up!",
    //   html: htmlStr,
    // });

    const res = await sendEmail({
      from: "Raj <notifications@raj.planetform.xyz>",
      to: params.email,
      subject: "Welcome to Planetform",
      body: "Thanks for signing up!",
      html: htmlStr,
    });

    if (res?.data) {
      console.log("Email sent successfully on sign Up", params.email);
    }
  } catch (e) {
    console.error("failed to send email to new user", params.email);
  }
};

export const sendEmail = async (params: IsendEmail) => {
  try {
    const { body, from, subject, to, html } = params;
    const send = await emailClient.emails.send({
      from,
      subject,
      to,
      text: body,
      html,
    });

    return send;
  } catch (e) {
    console.error("failed to send email to", params.to);
  }
};
