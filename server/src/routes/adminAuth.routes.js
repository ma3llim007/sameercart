import { Router } from "express";
import {
    adminList,
    checkSession,
    loginAdmin,
    logOutAdmin,
    refreshAccessTokenAdmin,
    registerAdmin,
} from "../controllers/adminAuth.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/logout").post(verifyAdmin, logOutAdmin);
router.route("/refresh-token").post(refreshAccessTokenAdmin);
router.route("/admin-list").get(verifyAdmin, adminList);
router.route("/check-session").get(verifyAdmin, checkSession);

export default router;
