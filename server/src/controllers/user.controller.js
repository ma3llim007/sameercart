import EmailVerification from "../models/emailVerification.model.js";
import { User } from "../models/user.model.js";
import { ApiError, ApiResponse, asyncHandler, generateAccessAndRefeshTokens, sendEmailVerificationOTP } from "../utils/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import transporter from "../config/emails.js";

// HTTP OPTIONS
const HttpOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
};

// Register User
const register = asyncHandler(async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password?.trim()) {
            return res.status(422).json(new ApiError(422, "All Field Are Required"));
        }

        const userIsExisted = await User.findOne({ email });
        if (userIsExisted) {
            return res.status(409).json(new ApiError(409, "User Is Already Exists"));
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            authMethod: "email",
        });

        await sendEmailVerificationOTP(user);
        const registerUser = user.toObject();
        delete registerUser.authMethod;
        delete registerUser.password;

        return res.status(201).json(new ApiResponse(201, registerUser, "User Created Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Internal Server Error"));
    }
});

// User Email Verification
const verifyEmail = asyncHandler(async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email?.trim() || !otp?.trim()) {
            return res.status(422).json(new ApiError(422, "All Field Are Required"));
        }

        // Convert OTP to uppercase for case-insensitive match
        const otpCode = otp.toUpperCase();

        const userIsExisted = await User.findOne({ email });
        if (!userIsExisted) {
            return res.status(404).json(new ApiError(404, "User Doesn't Exists"));
        }

        if (userIsExisted.email_verify) {
            return res.status(400).json(new ApiError(400, "Email Is Already Verified"));
        }

        // Check if OTP is valid
        const emailVerification = await EmailVerification.findOne({ userId: userIsExisted?._id });
        if (!emailVerification) {
            await sendEmailVerificationOTP(userIsExisted);
            return res.status(400).json(new ApiError(400, "Invalid OTP, New OTP Send To Your Email"));
        }

        // Checking Email OTP
        if (otpCode !== emailVerification.otpCode) {
            return res.status(400).json(new ApiError(400, "Invalid OTP. Please Enter The Correct Code."));
        }

        // Check if OTP is expired (15-minute expiry)
        const currentTime = new Date();
        const expirationTime = new Date(emailVerification.createdAt.getTime() + 15 * 60 * 1000);
        if (currentTime > expirationTime) {
            await sendEmailVerificationOTP(userIsExisted);
            return res.status(409).json(new ApiError(409, "OTP Expired, New OTP Send To Your Email"));
        }

        userIsExisted.email_verify = true;
        await userIsExisted.save();

        // Delete Email Verification
        await EmailVerification.deleteMany({ userId: userIsExisted._id });
        return res.status(200).json(new ApiResponse(200, "Email Verified Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Unable To Verify Email, Please Try Again Later"));
    }
});

// Login
const login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email?.trim() || !password?.trim()) {
            return res.status(422).json(new ApiError(422, "All Field Are Required"));
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json(new ApiError(404, "User Not Found"));
        }

        if (!user.email_verify) {
            return res.status(401).json(new ApiError(401, "Your Account Is Not Verified"));
        }

        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            return res.status(401).json(new ApiError(401, "Incorrect Password. Please Try Again."));
        }

        const { accessToken, refreshToken } = await generateAccessAndRefeshTokens(user._id);

        // Convert user to object and remove sensitive fields
        const loggedInUser = user.toObject();
        delete loggedInUser.password;
        delete loggedInUser.refreshToken;

        return res
            .status(200)
            .cookie("accessToken", accessToken, HttpOptions)
            .cookie("refreshToken", refreshToken, HttpOptions)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: loggedInUser,
                        accessToken,
                    },
                    "User Logged In Successfully"
                )
            );
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Internal Server Error"));
    }
});

// Generate Access Token
const refreshToken = asyncHandler(async (req, res) => {
    const currentRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!currentRefreshToken) {
        return res.status(401).json(new ApiError(401, "Unauthorized Request"));
    }
    try {
        const decodedToken = jwt.verify(currentRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);

        if (!user) {
            return res.status(401).json(401, "Invalid Refresh Token");
        }

        if (currentRefreshToken !== user?.refreshToken) {
            return res.status(401).json(new ApiError(401, "Refresh Token Is Expired Or Used"));
        }
        const { accessToken, refreshToken } = await generateAccessAndRefeshTokens(user._id);
        return res
            .status(200)
            .cookie("accessToken", accessToken, HttpOptions)
            .cookie("refreshToken", refreshToken, HttpOptions)
            .json(new ApiResponse(200, { accessToken, refreshToken }, "Access Token Refresh"));
    } catch (error) {
        return res.status(401).json(new ApiError(401, error?.message || "Invalid refresh token"));
    }
});

// Logout User
const logoutUser = asyncHandler(async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(400).json(new ApiError(400, "User Not Authenticated"));
        }
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: {
                    refreshToken: 1,
                },
            },
            {
                new: true,
            }
        );
        return res
            .status(200)
            .clearCookie("accessToken", HttpOptions)
            .clearCookie("refreshToken", HttpOptions)
            .json(new ApiResponse(200, {}, "User Logged Out"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

// Change Password
const changePassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    if (!password?.trim()) {
        return res.status(422).json(new ApiError(422, "Password Is Required"));
    }
    try {
        const user = await User.findById(req.user._id);
        const currentPassword = user.password;
        const isSamePassword = await bcrypt.compare(password, currentPassword);

        if (isSamePassword) {
            return res.status(422).json(new ApiError(422, "New password Must Be Different From The Current Password"));
        }
        user.password = password;

        await user.save();
        return res
            .status(200)
            .clearCookie("accessToken", HttpOptions)
            .clearCookie("refreshToken", HttpOptions)
            .json(new ApiResponse(200, {}, "Password Updated Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

// Send Password Reset Link Via Email
const sendUserPasswordResetEmail = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;

        if (!email?.trim()) {
            return res.status(422).json(new ApiError(422, "Email Is Required"));
        }

        // Find User By Email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(422).json(new ApiError(422, "Email Doesn't Exists"));
        }

        // Generate Token For Password Reset
        const token = jwt.sign(
            {
                _id: user._id,
                email: user.email,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "15m",
            }
        );

        // Reset Link
        const resetLink = `${process.env.FRONTEND_HOST}/account/reset-password-confirm/${user._id}/${token}`;
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
                            color: #5e72e4;
                            text-align: center;
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
                            background-color: #5e72e4;
                            color: white !important;
                            text-align: center;
                            border-radius: 5px;
                            text-decoration: none;
                            font-weight: bold;
                            margin-top: 20px;
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
                        <h2>Password Reset Request</h2>
                        <p class="message">We received a request to reset your password. To reset your password, please click the link below:</p>
                        <a href="${resetLink}" target="_blank" class="button">Reset Your Password</a>
                        <p class="footer">If you did not request this, please ignore this email. The link will expire in 15 minutes.</p>
                    </div>
                </body>
            </html>
        `;

        // Send Password Reset Email
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: "Password Reset Link",
            html: emailHtml,
        });
        return res.status(200).json(new ApiResponse(200, {}, "Password Reset Email Sent. Please Check Your Email"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

// Password Reset
const passwordReset = asyncHandler(async (req, res) => {
    try {
        const { password } = req.body;
        const { userId, token } = req.params;

        if (!password?.trim()) {
            return res.status(422).json(new ApiError(422, "Password Is Required"));
        }

        if (!userId && !token) {
            return res.status(422).json(new ApiError(422, "UserID and Token Is Request"));
        }

        // Find User By Email
        const user = await User.findById(userId);
        if (!user) {
            return res.status(422).json(new ApiError(422, "User Not Found"));
        }

        const currentPassword = user.password;
        const isSamePassword = await bcrypt.compare(password, currentPassword);

        if (isSamePassword) {
            return res.status(422).json(new ApiError(422, "New password Must Be Different From The Current Password"));
        }
        user.password = password;
        await user.save();

        return res
            .status(200)
            .clearCookie("accessToken", HttpOptions)
            .clearCookie("refreshToken", HttpOptions)
            .json(new ApiResponse(200, {}, "Password Reset Successfully"));
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(400).json(new ApiError(400, "Token Expired. Please Request a New Password Reset Link"));
        }
        return res.status(500).json(new ApiError(500, error.message));
    }
});

// Logout
const OAuthGoogleLogin = asyncHandler(async (req, res) => {
    try {
        const user = await req.user;

        if (!user) {
            return res.status(404).json(new ApiResponse(400, "Google User Data Is Missing"));
        }

        // Check if the user already exists in the database using googleId
        const userIsExisted = await User.findOne({ googleId: user?.id });

        // If user already exists, generate new tokens and return user data
        if (userIsExisted) {
            const { accessToken, refreshToken } = await generateAccessAndRefeshTokens(userIsExisted?._id);

            return res
                .status(200)
                .cookie("accessToken", accessToken, HttpOptions)
                .cookie("refreshToken", refreshToken, HttpOptions)
                .json(new ApiResponse(200, { user: userIsExisted, accessToken, refreshToken }, "User Logged In Successfully"));
        }
        const newUser = await User.create({
            firstName: user?.name?.givenName,
            lastName: user?.name?.familyName,
            email: user?.emails[0]?.value,
            email_verify: true,
            googleId: user?.id,
            authMethod: "google",
            is_active: true,
        });

        // Generate Tokens
        const { accessToken, refreshToken } = await generateAccessAndRefeshTokens(newUser?._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, HttpOptions)
            .cookie("refreshToken", refreshToken, HttpOptions)
            .json(new ApiResponse(200, { user: newUser, accessToken, refreshToken }, "User Logged In Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Internal Server Error"));
    }
});

export { register, login, OAuthGoogleLogin, verifyEmail, refreshToken, logoutUser, changePassword, sendUserPasswordResetEmail, passwordReset };
