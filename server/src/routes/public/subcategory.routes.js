import { Router } from "express";
import { subcategories } from "../../controllers/public/subcategory.controller.js";

const router = Router();

router.route("/subcategories").get(subcategories);

export default router;
