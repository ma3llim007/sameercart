import { Contact } from "../models/contact.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";

const addContact = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, phoneNumber, subject, message } = req.body;

    if (!firstName && !lastName && !email && !phoneNumber && !subject && !message) {
        return res.status(422).json(new ApiError(422, "All Field Are Required"));
    }

    const _contactMessage = await Contact.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        subject,
        message,
    });

    return res.status(201).json(new ApiResponse(201, {}, "Contact Message Successfully Send To Admin."));
});

export { addContact };
