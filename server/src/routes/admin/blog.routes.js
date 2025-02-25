import { Router } from "express";
import { addBlog, blogs, deleteBlog, editBlog } from "../../controllers/admin/blog.controller.js";
import { upload } from "../../middlewares/multer.middleware.js ";
import { verifyAdmin } from "../../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyAdmin);

router.route("/add-blog").post(
    upload.fields([
        { name: "blogFeatureImage", maxCount: 1 },
        { name: "blogDetailImage", maxCount: 1 },
    ]),
    addBlog
);
router.route("/blogs").get(blogs);
router.route("/edit-blog").patch(
    upload.fields([
        { name: "blogFeatureImage", maxCount: 1 },
        { name: "blogDetailImage", maxCount: 1 },
    ]),
    editBlog
);
router.route("/delete-blog/:blogId").delete(deleteBlog);

export default router;
