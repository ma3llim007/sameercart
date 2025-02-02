import { Router } from "express";
import { getUser } from "../controllers/dashboard.controller.js";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.middleware.js";
import userVerify from "../middlewares/userVerify.middleware.js";

const router = Router();
router.use(accessTokenAutoRefresh);
router.use(userVerify);

router.route("/").get(getUser);

export default router;
