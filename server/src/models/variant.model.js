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
        priceAdjustment: {
            type: Number,
            required: [true, "Price Adjustment Is Required"],
            default: 0,
            min: [0, "Price Adjustment Cannot Be Less Than 0"],
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
        attributes: {
            type: Map,
            of: String,
            default: {},
            required: [true, "Attributes are required"],
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: [true, "addedBy Is Required"],
        },
        deletedAt: {
            type: Date, // Soft Delete Field
            default: null,
        },
    },
    { timestamps: true }
);

export const Variant = mongoose.model("Variant", variantSchema);
