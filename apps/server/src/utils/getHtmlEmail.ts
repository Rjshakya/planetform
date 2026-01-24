export const getPersonalHtmlEmailStr = ({
	name,
	values,
	formName,
	body,
	formId,
	workspace,
}: {
	name: string;
	values: Record<string, string>;
	formName: string;
	formId: string;
	workspace: string;
	body?: string;
}) => {
	const valuesContent =
		values &&
		Object.entries(values)
			?.map(([key, value]) => {
				return `<tr>
                  <td style="padding: 8px 0;">
                    <strong style="color: #fff; font-size: 15px;">${key}</strong><br>
                    <span style="color: #ccc; font-size: 14px;">${value}</span>
                  </td>
                </tr>`;
			})
			.join(" ");
	const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            line-height: 1.6;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        .header {
            
            padding: 40px 30px;
            text-align: center;
            color: #ffffff;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
        }
        .content {
            padding: 40px 30px;
            color: #333333;
        }
        .content h2 {
            color: #155dfc;
            font-size: 24px;
            margin-top: 0;
            margin-bottom: 20px;
        }
        .content p {
            margin: 0 0 16px 0;
            font-size: 16px;
            color: #555555;
        }
        .button {
            display: inline-block;
            padding: 14px 32px;
            margin: 20px 0;
            background-color: #155dfc;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #155dfc;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            border-top: 1px solid #e5e7eb;
        }
        .footer a {
            color: #155dfc;
            text-decoration: none;
        }
        .divider {
            height: 1px;
            background-color: #e5e7eb;
            margin: 30px 0;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <h1>Planetform</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <h2>New Submission - ${formName}</h2>
            <p>Hi ${name}</p>
            <p>Thank you for trusting us , for your forms. we are grateful for this.</p>
            <p>Here is new Submission on your form : ${formName}</p>
            ${body ? `<div>${body}</div>` : ""}
            <div>${valuesContent}</div>

            <div class="divider"></div>

            <p>If you have any questions, feel free to contact us!</p>
            <p>Best regards,<br>The Planetform Team</p>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>© 2025 Planetform. All rights reserved.</p>
            <p>
                <a href="https://x.com/RajShak96083714">X</a> | 
                <a href="https://planetform.xyz">website</a> | 
                <a href="https://planetform.xyz">Contact Us</a>
            </p>
            <p style="margin-top: 15px; font-size: 12px;">
                New Delhi , India
            </p>
        </div>
    </div>
</body>
</html>`;

	const html2 = `<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0; background: #0b0b0b; font-family: 'Inter', Arial, sans-serif;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Form Submission</title>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
</head>

<body style="margin: 0; padding: 0; background: #0b0b0b; font-family: 'Space Grotesk', Arial, sans-serif; color: #e5e5e5;">

  <!-- Outer Wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #0b0b0b; padding: 40px 0;">
    <tr>
      <td align="center">
        ${body ? `<div>${body}</div>` : ""}

        <!-- Card -->
        <table role="presentation" width="90%" cellpadding="0" cellspacing="0" style="max-width: 600px; background: #111; padding: 32px;">
          
          <!-- Header -->
          <tr>
            <td style="text-align: center; padding-bottom: 10px;">
              <img src="https://bucket.planetform.xyz/planetform-assets/logo-big.png" alt="Planetform" width="150" style="margin-bottom: 16px;" />
              <h1 style="margin: 0; color: #fff; font-size: 24px; font-weight: 600;">New Form Submission</h1>
              <p style="color: #aaa; font-size: 14px; margin-top: 6px;">
                You received a new response on your form.
              </p>
            </td>
          </tr>

          <!-- Submission Info -->
          <tr>
            <td style="padding: 20px 0;">

              <table width="100%" cellpadding="0" cellspacing="0" style="background: #0f0f0f;
               border-radius: 10px; padding: 20px;">
                
                <!-- Dynamic Form Fields -->
                <!-- Duplicate this block for each field -->
                ${valuesContent}

                <!-- End Dynamic Fields -->

              </table>

            </td>
          </tr>

          <!-- Form Footer -->
          <tr>
            <td style="text-align: center; padding-top: 20px;">
              <a href="https://planetform.xyz/dashboard/${workspace}/form/view/${formId}" 
                style="background: #3b82f6; padding: 12px 22px; color: #fff; text-decoration: none; border-radius: 8px; font-size: 14px;">
                View Submission
              </a>

              <p style="margin-top: 20px; color: #7d7d7d; font-size: 13px; line-height: 1.6;">
                You are receiving this email because you have notifications enabled on your Planetform form.
            </td>
          </tr>

        </table>
        <!-- End Card -->

      </td>
    </tr>
  </table>

</body>
</html>
`;

	return html2;
};
