import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import { mailTrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
}) => {
  const recipient = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email verification",
    });

    console.log("response :>> ", response);
  } catch (error) {
    console.log("Error while sending email :>> ", error.message);
  }
};

export const sendWelcomeEmail = async ({ name, email }) => {
  const recipient = [{ email }];

  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "5c469f95-8cb5-4b34-a8e8-6dec29668cd3",
      template_variables: {
        company_info_name: "Test_Company_info_name",
        name: name,
      },
    });

    console.log("response :>> ", response);
  } catch (error) {}
};

export const sendPasswordResetEmail = async ({ name, email, resetToken }) => {
  const recipient = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace(
        "{resetURL}",
        `http://localhost:5173/reset-password?token=${resetToken}`
      ),
      category: "Forgot password",
    });
    console.log("response :>> ", response);
  } catch (error) {
    console.log("Error while sending email :>> ", error.message);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];
  try {
    const response = await mailTrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password change Successfully",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password reset",
    });

    console.log("response :>> ", response);
  } catch (error) {
    console.log("Error", error.message);
  }
};
