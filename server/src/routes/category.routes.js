import { Router } from "express";
import {
    addCategory,
    categories,
    deleteCategory,
    toggleCategory,
    updateCategory,
} from "../controllers/category.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { convertIntoWebp } from "../middlewares/imageProcessing.middleware.js";

const router = Router();
router.use(verifyAdmin);

router.route("/add-category").post(upload.single("categoryImage"), convertIntoWebp, addCategory);
router.route("/categories").get(categories);
router.route("/update-category/").patch(upload.single("categoryImage"), convertIntoWebp, updateCategory);
router.route("/delete-category/:categoryId").delete(deleteCategory);
router.route("/toggle-category/:categoryId").patch(toggleCategory);

export default router;
