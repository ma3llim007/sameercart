import { Router } from "express";
import accessTokenAutoRefresh from "../middlewares/accessTokenAutoRefresh.middleware.js";
import userVerify from "../middlewares/userVerify.middleware.js";
import { createOrder, createOrderRazorPay, getOrderByUser, verifyRazorPayPayment } from "../controllers/order.controller.js";

const router = Router();
router.use(accessTokenAutoRefresh);
router.use(userVerify);

router.route("/create-order-cash").post(createOrder);
router.route("/create-order-razorpay").post(createOrderRazorPay);
router.route("/verify-payment").post(verifyRazorPayPayment);
router.route("/get-orders").get(getOrderByUser);

export default router;
