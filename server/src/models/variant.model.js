import mongoose, { Schema } from "mongoose";

const variantSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product Id Is Required"],
        },
        sku: {
            type: String,
            unique: true,
            required: [true, "SKU Is Required"],
            lowercase: true,
            trim: true,
            maxlength: [50, "SKU Cannot Exceed 50 Characters"],
        },
        variantPrice: {
            type: Number,
            required: [true, "Variant Price Is Required"],
            default: 0,
            min: [0, "Variant Price Cannot Be Less Than 0"],
        },
        stockQty: {
            type: Number,
            required: [true, "Stock Qty Is Required"],
            min: [0, "Stock Quantity Cannot Be Negative"],
        },
        images: [
            {
                imageUrl: {
                    type: String,
                    required: [true, "Image URL Is Required"],
                },
                publicId: {
                    type: String,
                    required: [true, "Image Public ID Is Required"],
                },
            },
        ],
        attributes: [
            {
                name: { type: String, required: [true, "Attribute Name Is Required"] },
                value: { type: String, required: [true, "Attributes Value Is Required"] },
            },
        ],
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: [true, "addedBy Is Required"],
        },
    },
    { timestamps: true }
);

export const Variant = mongoose.model("Variant", variantSchema);
