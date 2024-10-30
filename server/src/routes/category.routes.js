import { Router } from "express";
import {
    addCategory,
    categories,
    deleteCategory,
    updateCategory,
} from "../controllers/category.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyAdmin);

router.route("/add-category").post(upload.single("categoryImage"), addCategory);
router.route("/categories").get(categories);
router
    .route("/update-category/")
    .patch(upload.single("categoryImage"), updateCategory);
router.route("/delete-category/:categoryId").delete(deleteCategory);

export default router;