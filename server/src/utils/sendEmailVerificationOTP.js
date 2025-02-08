import transporter from "../config/emails.js";
import EmailVerification from "../models/emailVerification.model.js";
import crypto from "crypto";

const generateOtpCode = () => crypto.randomBytes(3).toString("hex").toUpperCase();

export const sendEmailVerificationOTP = async (user) => {
    try {
        const otpCode = generateOtpCode();
        // Create the email verification document
        await EmailVerification.create({ userId: user._id, otpCode });

        // OTP Verification Link
        const otpVerificationLink = `${process.env.FRONTEND_HOST}/verify-email`;
        const emailHtml = `
            <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f4f7fc;
                            color: #333;
                            margin: 0;
                            padding: 0;
                        }
    
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                        }
    
                        h2 {
                            color: #0562D6;
                            text-align: center;
                        }
    
                        .otp {
                            font-size: 24px;
                            font-weight: bold;
                            color: #0562D6;
                            text-align: center;
                            margin: 20px 0;
                        }
    
                        .message {
                            font-size: 16px;
                            line-height: 1.5;
                            text-align: center;
                            color: #555;
                        }
    
                        .button {
                            display: block;
                            width: 100%;
                            padding: 15px;
                            background-color: #0562D6;
                            color: white !important;
                            text-align: center;
                            border-radius: 5px;
                            text-decoration: none;
                            font-weight: bold;
                            margin-top: 20px;
                        }

                        .link-message {
                            font-size: 14px;
                            color: #555;
                            margin-top: 15px;
                        }

                        .link {
                            display: block;
                            margin-top: 5px;
                            font-size: 14px;
                            color: #0562D6;
                            text-decoration: underline;
                            word-break: break-all;
                        }

                        .footer {
                            text-align: center;
                            font-size: 12px;
                            color: #888;
                            margin-top: 20px;
                        }
                    </style>
                </head>
    
                <body>
                    <div class="container">
                        <h2>Welcome to SameerCart!</h2>
                        <p class="message">Thank you for registering. To verify your email address, please enter the OTP below:</p>
                        <div class="otp">${otpCode}</div>
                        <p class="message">Alternatively, you can click the button below to verify your email:</p>
                        <a target="_blank" href="${otpVerificationLink}" class="button">Verify Your Email</a>
                        <p class="link-message">If the button above doesn't work, please click on the link below:</p>
                        <a target="_blank" href="${otpVerificationLink}" class="link">${otpVerificationLink}</a>
                        <p class="footer">This OTP is valid for 15 minutes. If you did not request this email, please ignore it.</p>
                    </div>
                </body>
    
            </html>
            `;
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "Verify Your Account - OTP",
            html: emailHtml,
        });
    } catch (error) {
        console.error("Error sending OTP email:", error);
        throw new Error("Failed to send OTP email.");
    }
};
