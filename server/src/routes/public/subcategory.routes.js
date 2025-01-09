import { Router } from "express";
import { subcategories, subCategoryByCategory } from "../../controllers/public/subcategory.controller.js";

const router = Router();

router.route("/subcategories").get(subcategories);
router.route("/subcategories-by-category/:categorySlug").get(subCategoryByCategory);

export default router;
