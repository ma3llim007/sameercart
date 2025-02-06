import { Router } from "express";
import { changePassword, login, logoutUser, passwordReset, refreshToken, register, sendUserPasswordResetEmail, verifyEmail } from "../controllers/user.controller.js";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.middleware.js";
import userVerify from "../middlewares/userVerify.middleware.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verify-email").post(verifyEmail);
router.route("/refresh-token").post(refreshToken);
router.route("/forgot-password").post(sendUserPasswordResetEmail);
router.route("/reset-password/:userId/:token").post(passwordReset);

// Protected Router
router.route("/log-out").post(accessTokenAutoRefresh, userVerify, logoutUser);
router.route("/change-password").post(accessTokenAutoRefresh, userVerify, changePassword);
// router.route("/auth/google").get(passport.authenticate("google", { scope: ["profile", "email"] }));
// router.route("/auth/google/callback").get(passport.authenticate("google", { failureRedirect: "/api/v1/users/auth/failure" }), OAuthGoogleLogin);

export default router;
