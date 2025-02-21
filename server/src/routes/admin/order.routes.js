import { Router } from "express";
import { verifyAdmin } from "../../middlewares/auth.middleware.js";
import { getOrder, newOrderAction, viewOrder } from "../../controllers/admin/order.controller.js";

const router = Router();
router.use(verifyAdmin);

// Router
router.route("/get-order").get(getOrder);
router.route("/view-order/:orderId").get(viewOrder);
router.route("/update-view-order/:orderId").patch(newOrderAction);

export default router;
