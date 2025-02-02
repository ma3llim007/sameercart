import { Router } from "express";
import { categories, categoryWithSubCategory, popularCategories } from "../controllers/category.controller.js";

const router = Router();

// Route
router.route("/category-with-sub-category").get(categoryWithSubCategory);
router.route("/popular-categories").get(popularCategories);
router.route("/categories").get(categories);

export default router;
