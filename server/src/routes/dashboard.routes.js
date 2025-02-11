import { Router } from "express";
import { editUserAddress, editUserDetails, getUser } from "../controllers/dashboard.controller.js";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.middleware.js";
import userVerify from "../middlewares/userVerify.middleware.js";

const router = Router();
router.use(accessTokenAutoRefresh);
router.use(userVerify);

router.route("/").get(getUser);
router.route("/edit-user-detail").post(editUserDetails);
router.route("/edit-address").post(editUserAddress);

export default router;
