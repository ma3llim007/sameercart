import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
    {
        categoryName: {
            type: String,
            required: [true,"Category Name Is Required"],
            lowercase: true,
            trim: true,
        },
        categorySlug: {
            type: String,
            unique: true,
            required: [true,"Category Slug Is Required"],
            lowercase: true,
            trim: true,
        },
        categoryImage: {
            type: String,
            required: [true,"Category Image Is Required"],
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

export const Category = mongoose.model("Category", categorySchema);
