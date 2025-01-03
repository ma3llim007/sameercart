import mongoose, { Schema } from "mongoose";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

const productSchema = new Schema(
    {
        productName: {
            type: String,
            required: [true, "Product Name Is Required"],
            lowercase: true,
            trim: true,
        },
        productSlug: {
            type: String,
            unique: true,
            required: [true, "Product Slug Is Required"],
            lowercase: true,
            trim: true,
        },
        productFeatureImage: {
            type: String,
            required: [true, "Product Feature Image Is Required"],
        },
        productPrice: {
            type: Number,
            required: [true, "Product Price Is Required"],
        },
        productCategoryId: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category Id Is Required"],
        },
        productSubCategoryId: {
            type: Schema.Types.ObjectId,
            ref: "SubCategory",
            required: [true, "SubCategory Id Is Required"],
        },
        productDescription: {
            type: String,
            required: [true, "Product Description Is Required"],
        },
        hasVariants: {
            type: Boolean,
            default: false,
        },
        productVariants: {
            type: [Schema.Types.ObjectId],
            ref: "Variant",
            default: [],
        },
        productSpecification: {
            type: String,
            required: [true, "Product Specfication Is Required"],
        },
        productStock: {
            type: Number,
        },
        addedBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: [true, "addedBy Is Required"],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Pre-save hook to sanitize HTML content before saving to the database
productSchema.pre("save", function (next) {
    if (this.productDescription) {
        this.productDescription = purify.sanitize(this.productDescription);
    }

    if (this.productSpecification) {
        this.productSpecification = purify.sanitize(this.productSpecification);
    }
    next();
});

export const Product = mongoose.model("Product", productSchema);
