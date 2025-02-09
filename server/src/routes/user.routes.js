import { Router } from "express";
import { changePassword, login, loginWithOAuth, logoutUser, OAuthRedirect, passwordReset, refreshToken, register, sendUserPasswordResetEmail, verifyEmail } from "../controllers/user.controller.js";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.middleware.js";
import userVerify from "../middlewares/userVerify.middleware.js";
import passport from "passport";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verify-email").post(verifyEmail);
router.route("/refresh-token").post(refreshToken);
router.route("/forgot-password").post(sendUserPasswordResetEmail);
router.route("/reset-password/:userId/:token").post(passwordReset);
// Google OAuth
router.route("/auth/google").get(passport.authenticate("google", { session: false, scope: ["profile", "email"] }));
router.route("/auth/google/callback").get(passport.authenticate("google", { session: false, failureRedirect: `${process.env.FRONTEND_HOST}/login` }), OAuthRedirect);
router.route("/oauth-sign-in/:userId").get(loginWithOAuth);

// Github OAuth
router.route("/auth/github").get(passport.authenticate("github", { session: false, scope: ["user:email"] }));
router.route("/auth/github/callback").get(passport.authenticate("github", { session: false, failureRedirect: `${process.env.FRONTEND_HOST}/login` }), OAuthRedirect);

// Protected Router
router.route("/log-out").post(accessTokenAutoRefresh, userVerify, logoutUser);
router.route("/change-password").post(accessTokenAutoRefresh, userVerify, changePassword);

export default router;
