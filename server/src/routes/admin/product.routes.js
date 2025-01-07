import { Router } from "express";
import { verifyAdmin } from "../../middlewares/auth.middleware.js";
import {
    addProduct,
    deleteProduct,
    ProductGetById,
    productListing,
    updateProduct,
} from "../../controllers/admin/product.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyAdmin);

// Router
router.route("/add-product").post(upload.single("productFeatureImage"), addProduct);
router.route("/products").get(productListing);
router.route("/get-product/:productId").get(ProductGetById);
router.route("/edit-product").patch(upload.single("productFeatureImage"), updateProduct);
router.route("/delete-product/:productId").delete(deleteProduct);

export default router;
