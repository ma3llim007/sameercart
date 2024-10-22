import { Router } from "express";
import getData from "../controllers/adminAuth.controller.js";

const router = Router();

router.route("/login").get(getData);

export default router;