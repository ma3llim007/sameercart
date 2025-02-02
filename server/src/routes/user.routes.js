import { Router } from "express";
import { login, logoutUser, refreshToken, register, verifyEmail } from "../controllers/user.controller.js";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.middleware.js";
import userVerify from "../middlewares/userVerify.middleware.js";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/verify-email").post(verifyEmail);
router.route("/refresh-token").post(refreshToken);

router.use(accessTokenAutoRefresh);
router.use(userVerify);
router.route("/log-out").post(logoutUser);
// router.route("/auth/google").get(passport.authenticate("google", { scope: ["profile", "email"] }));
// router.route("/auth/google/callback").get(passport.authenticate("google", { failureRedirect: "/api/v1/users/auth/failure" }), OAuthGoogleLogin);

export default router;
