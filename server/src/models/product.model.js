import mongoose, { Schema } from "mongoose";
const productSchema = new Schema(
    {
        productName: {
            type: String,
            required: [true,"ProductName Is Required"],
            lowercase: true,
            trim: true,
        },
        productSlug: {
            type: String,
            unique: true,
            required: [true,"ProductSlug Is Required"],
            lowercase: true,
            trim: true,
        },
        categoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [true,"CategoryId Is Required"],
        },
        subCategoryId: {
            type: Schema.Types.ObjectId,
            ref: "SubCategory",
            required: [true,"SubCategoryId Is Required"],
        },
        productDescription: {
            type: String,
            required: [true,"productDescription Is Required"],
        },
        productBrand: {
            type: Schema.Types.ObjectId,
            ref: "Brand",
            required: [true,"productBrand Is Required"],
        },
        productVariants: {
            type: Schema.Types.ObjectId,
            ref: "Variant",
            required: [true,"productVariants Is Required"],
        },
        productSpecfication: {
            type: String,
            required: [true,"productSpecfication Is Required"],
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: [true,"addedBy Is Required"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
