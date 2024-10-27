import { Router } from "express";
import {
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

export default router;
