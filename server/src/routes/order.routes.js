import { Router } from "express";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.middleware.js";
import userVerify from "../middlewares/userVerify.middleware.js";
import { createOrder } from "../controllers/order.controller.js";

const router = Router();
router.use(accessTokenAutoRefresh);
router.use(userVerify);

router.route("/order").post(createOrder);

export default router;
