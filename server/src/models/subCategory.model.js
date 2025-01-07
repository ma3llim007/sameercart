import mongoose, { Schema } from "mongoose";

const subCategorySchema = new Schema(
    {
        subCategoryName: {
            type: String,
            required: [true, "SubCategory Name Is Required"],
            lowercase: true,
            trim: true,
        },
        subCategorySlug: {
            type: String,
            unique: true,
            required: [true, "SubCategory Slug Is Required"],
            lowercase: true,
            trim: true,
        },
        subCategoryImage: {
            type: String,
            required: [true, "SubCategory Image Is Required"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        parentCategory: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Parent Category Is Required"],
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: [true, "AddedBy Is Required"],
        },
    },
    { timestamps: true }
);

export const SubCategory = mongoose.model("SubCategory", subCategorySchema);
