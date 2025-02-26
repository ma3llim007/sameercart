import { Router } from "express";
import { verifyAdmin } from "../../middlewares/auth.middleware.js";
import { contactList, deleteContact, getContact } from "../../controllers/admin/contact.controller.js";

const router = Router();
router.use(verifyAdmin);

router.route("/contact-list").get(contactList);
router.route("/contact/:contactId").get(getContact);
router.route("/delete-contact/:contactId").delete(deleteContact);


export default router;
