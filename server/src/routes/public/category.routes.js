import { Router } from "express";
import { categoryWithSubCategory, popularCategories } from "../../controllers/public/category.controller.js";

const router = Router();

// Route
router.route("/category-with-sub-category").get(categoryWithSubCategory);
router.route("/popular-categories").get(popularCategories);

export default router;
