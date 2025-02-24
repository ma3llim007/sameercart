import { Router } from "express";
import { getProductByCategoryWithSubCategory, getProductBySlug, newArrivals, searchProducts } from "../controllers/product.controller.js";

const router = Router();

// Route
router.route("/all-products").get(getProductByCategoryWithSubCategory);
router.route("/new-arrivals").get(newArrivals);
router.route("/product-details/:productSlug").get(getProductBySlug);
router.route("/search").get(searchProducts);

export default router;
