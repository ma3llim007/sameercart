import { Router } from "express";
import { addProductReview, editProductReview, getProductByCategory, getProductByCategoryWithSubCategory, getProductBySlug, newArrivals, searchProducts } from "../controllers/product.controller.js";
import userVerify from "../middlewares/userVerify.middleware.js";

const router = Router();

// Route
router.route("/all-products").get(getProductByCategoryWithSubCategory);
router.route("/new-arrivals").get(newArrivals);
router.route("/get-products-by-category").get(getProductByCategory);
router.route("/product-details/:productSlug").get(getProductBySlug);
router.route("/search").get(searchProducts);

// Protected Route
router.route("/add-review").post(userVerify, addProductReview);
router.route("/edit-review/:reviewId").patch(userVerify, editProductReview);

export default router;
