import { Router } from "express";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import {
    addBrand,
    deleteBrand,
    getBrands,
    getBrandsById,
    toggleBrand,
    updateBrand,
} from "../controllers/brand.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyAdmin);

router.route("/add-brand").post(upload.single("brandLogo"), addBrand);
router.route("/brands").get(getBrands);
router.route("/get-brand/:brandId").get(getBrandsById);
router.route("/update-brand").patch(upload.single("brandLogo"), updateBrand);
router.route("/toggle-brand/:brandId").patch(toggleBrand);
router.route("/delete-brand/:brandId").delete(deleteBrand);

export default router;
