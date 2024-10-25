import mongoose, { Schema } from "mongoose";

const brandSchema = new Schema(
    {
        brandName: {
            type: String,
            unique: true,
            required: [true,"Brand Name Is Required"],
            lowercase: true,
            trim: true,
        },
        brandDescription: {
            type: String,
            required: [true,"Brand Description Is Required"],
        },
        brandLogo: {
            type: String,
            required: [true,"Brand Logo Is Required"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: [true,"AddedBy Is Required"],
        },
    },
    { timestamps: true }
);

export const Brand = mongoose.model("Brand", brandSchema);
