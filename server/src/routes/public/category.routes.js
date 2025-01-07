import { Router } from "express";
import { categories } from "../../controllers/public/category.controller.js";

const router = Router();

// Route
router.route("/category", categories);

export default router;
