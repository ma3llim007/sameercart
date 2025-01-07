import { Router } from "express";
import {
    checkSession,
    loginAdmin,
    logOutAdmin,
    refreshAccessTokenAdmin,
    registerAdmin,
} from "../../controllers/admin/adminAuth.controller.js";
import { verifyAdmin } from "../../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/logout").post(verifyAdmin, logOutAdmin);
router.route("/refresh-token").post(refreshAccessTokenAdmin);
router.route("/check-session").get(verifyAdmin, checkSession);

export default router;
