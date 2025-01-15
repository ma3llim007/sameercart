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
        },
        basePrice: {
            type: Number,
            required: [true, "Base Price Is Required"],
            default: 0,
            min: [0, "Base Price Cannot Be Less Than 0"],
        },
        discountPrice: {
            type: Number,
            min: [0, "Discount Price Cannot Be Negative"],
            validate: {
                validator: function (value) {
                    return value < this.basePrice;
                },
                message: "Discount Price Must Be Less Than Discount Price",
            },
        },
        stockQuantity: {
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
    },
    { timestamps: true }
);

// Pre-save hook to ensure variant price validation
variantSchema.pre("save", function (next) {
    if (this.discountPrice && this.discountPrice >= this.basePrice) {
        return next(new Error("Discount Price Must Be Less Than Base Price"));
    }
    next();
});
export const Variant = mongoose.model("Variant", variantSchema);
