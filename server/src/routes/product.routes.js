import { Router } from "express";
import { getProductByCategory, getProductByCategoryWithSubCategory, getProductBySlug, newArrivals, searchProducts } from "../controllers/product.controller.js";

const router = Router();

// Route
router.route("/all-products").get(getProductByCategoryWithSubCategory);
router.route("/new-arrivals").get(newArrivals);
router.route("/get-products-by-category").get(getProductByCategory);
router.route("/product-details/:productSlug").get(getProductBySlug);
router.route("/search").get(searchProducts);

export default router;
