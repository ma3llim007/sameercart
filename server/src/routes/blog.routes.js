import { Router } from "express";
import { getBlogs, relatedBlogs, viewBlog } from "../controllers/blog.controller.js";

const router = Router();

router.route("/get-blogs").get(getBlogs);
router.route("/view-blog/:blogSlug").get(viewBlog);
router.route("/view-blog/:blogId/related").get(relatedBlogs);

export default router;
