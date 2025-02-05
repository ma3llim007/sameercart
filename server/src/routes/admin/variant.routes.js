import { Router } from "express";
import { verifyAdmin } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { addVariant, deleteVariant, deleteVariantImageByIds, editVariantImageById, getVariantByProductId, getVariantByVariantId, updateVariant } from "../../controllers/admin/variant.controller.js";

const router = Router();
router.use(verifyAdmin);

// Router
router.route("/add-variant").post(upload.array("images", 6), addVariant);
router.route("/variants-by-product/:productId").get(getVariantByProductId);
router.route("/variant-by-id/:variantId").get(getVariantByVariantId);
router.route("/delete-variant/:variantId").delete(deleteVariant);
router.route("/update-variant").patch(upload.array("images", 6), updateVariant);
router.route("/delete-variant-image/:variantId/:publicId").delete(deleteVariantImageByIds);
router.route("/update-variant-image/:variantId/:publicId").patch(upload.single("image"), editVariantImageById);

export default router;
