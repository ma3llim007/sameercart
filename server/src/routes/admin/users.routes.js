import { Router } from "express";
import { verifyAdmin } from "../../middlewares/auth.middleware.js";
import { getUsers, viewUser } from "../../controllers/admin/user.controller.js";

const router = Router();
router.use(verifyAdmin);

// Router
router.route("/get-users").get(getUsers);
router.route("/view-user/:userId").get(viewUser);

export default router;
