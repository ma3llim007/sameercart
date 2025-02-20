import { Router } from "express";
import { verifyAdmin } from "../../middlewares/auth.middleware.js";
import { deleteOrder, getOrder, viewOrder } from "../../controllers/admin/order.controller.js";

const router = Router();
router.use(verifyAdmin);

// Router
router.route("/get-order").get(getOrder);
router.route("/delete-order/:orderId").delete(deleteOrder);
router.route("/view-order/:orderId").get(viewOrder);

export default router;
