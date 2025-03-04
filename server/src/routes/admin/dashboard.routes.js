import { Router } from "express";
import { verifyAdmin } from "../../middlewares/auth.middleware.js";
import { dashboardStats, orderStats, productByCategoryStats } from "../../controllers/admin/dashboard.controller.js";

const routes = Router();
routes.use(verifyAdmin);

routes.route("/dashboard").get(dashboardStats);
routes.route("/orders-chart").get(orderStats);
routes.route("/products-by-category-chart").get(productByCategoryStats);

export default routes;
