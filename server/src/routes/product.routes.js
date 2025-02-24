import { Router } from "express";
import { getProductByCategoryWithSubCategory, getProductBySlug, searchProducts } from "../controllers/product.controller.js";

const router = Router();

// Route
router.route("/all-products").get(getProductByCategoryWithSubCategory);
router.route("/product-details/:productSlug").get(getProductBySlug);
router.route("/search").get(searchProducts);

export default router;
