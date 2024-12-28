import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
    addSubCategory,
    deleteSubCategory,
    getSubCategory,
    getSubCategoryById,
    subCategoryByIdOptions,
    toggleSubCategory,
    updateSubCategory,
} from "../controllers/subCategory.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyAdmin);

router.route("/add-subcategory").post(upload.single("subCategoryImage"), addSubCategory);
router.route("/subcategory").get(getSubCategory);
router.route("/delete-subcategory/:subCategoryId").delete(deleteSubCategory);
router.route("/get-subcategory/:subCategoryId").get(getSubCategoryById);
router.route("/update-subcategory").patch(upload.single("subCategoryImage"), updateSubCategory);
router.route("/toggle-subcategory/:subCategoryId").patch(toggleSubCategory);
router.route("/get-subcategory-option/:categoryId").get(subCategoryByIdOptions);

export default router;
