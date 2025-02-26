import { Router } from "express";
import { addContact } from "../controllers/contact.controller.js";

const router = Router();

router.route("/add-contact").post(addContact);

export default router;
