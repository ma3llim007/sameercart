import mongoose, { Schema } from "mongoose";

const ContactScheme = new Schema({
    firstName: {
        type: String,
        required: [true, "First Name Is Required"],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "Last Name Is Required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email Is Required"],
        lowercase: true,
        trim: true,
    },
    phoneNumber: {
        type: String,
    },
    subject: {
        type: String,
        required: [true, "Subject Is Required"],
        trim: true,
    },
    message: {
        type: String,
        required: [true, "Message Is Required"],
        trim: true,
    },
});

export const Contact = mongoose.model("Contact", ContactScheme);
