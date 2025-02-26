import { isValidObjectId } from "mongoose";
import { Contact } from "../../models/contact.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../../utils/index.js";

const contactList = asyncHandler(async (req, res) => {
    try {
        const contact = await Contact.find();
        if (!contact.length) {
            return res.status(200).json(new ApiResponse(200, {}, "No Contact Found"));
        }
        return res.status(200).json(new ApiResponse(200, contact, "Contacts Fetch Successfully"));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Fetching Contact"));
    }
});

const getContact = asyncHandler(async (req, res) => {
    const { contactId } = req.params;
    if (!contactId || contactId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Contact ID Is Required"));
    }

    if (!isValidObjectId(contactId)) {
        return res.status(400).json(new ApiError(400, "Invalid Contact ID"));
    }
    try {
        const contact = await Contact.findById(contactId);
        if (!contact) {
            return res.status(404).json(new ApiError(401, "Contact Not Found"));
        }

        return res.status(200).json(new ApiResponse(200, contact, "Contact Fetch Successfully"));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Fetching Contact Detail"));
    }
});

// Delete Category
const deleteContact = asyncHandler(async (req, res) => {
    try {
        const { contactId } = req.params;

        if (!contactId || contactId.trim() === "") {
            return res.status(422).json(new ApiError(422, "Contact ID Is Required"));
        }

        if (!isValidObjectId(contactId)) {
            return res.status(400).json(new ApiError(400, "Invalid Contact ID"));
        }

        const contact = await Contact.findById(contactId);
        if (!contact) {
            return res.status(404).json(new ApiError(401, "Contact Not Found"));
        }

        const deleteContact = await Contact.deleteOne({ _id: contactId });
        if (deleteContact.deletedCount === 0) {
            return res.status(500).json(new ApiError(500, "Something Went Wrong While Deleting The Order"));
        }

        return res.status(200).json(new ApiResponse(200, {}, "Contact Delete Successfully"));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Deleting Contact"));
    }
});

export { contactList, getContact, deleteContact };
