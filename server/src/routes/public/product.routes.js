import { Router } from "express";
import { getProductByCategoryWithSubCategory, getProductBySlug } from "../../controllers/public/product.controller.js";

const router = Router();

// Route
router.route("/all-products").get(getProductByCategoryWithSubCategory);
router.route("/product-details/:productSlug").get(getProductBySlug);

export default router;
