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
        productShortDescription: {
            type: String,
            required: [true, "Product Short Description Is Required"],
        },
        productDescription: {
            type: String,
            required: [true, "Product Description Is Required"],
        },
        productSpecification: {
            type: String,
            required: [true, "Product Specfication Is Required"],
        },
        productBrand: {
            type: String,
            required: [true, "Product Brand Is Required"],
        },
        basePrice: {
            type: Number,
            min: [0, "Product Price Cannot Be Negative"],
            default: 0,
        },
        productDiscountPrice: {
            type: Number,
            min: [0, "Product Discount Price Cannot Be Negative"],
        },
        productType: {
            type: String,
            enum: ["simple", "variable"],
            default: "simple",
        },
        attributes: [
            {
                name: {
                    type: String,
                    required: [true, "Attribute Is Required"],
                },
                options: [String],
            },
        ],
        productVariants: [{ type: Schema.Types.ObjectId, ref: "Variant" }],
        productStock: {
            type: Number,
            min: [0, "Product Stock Cannot Be Negative"],
            default: 0,
        },
        ratings: {
            averageRating: {
                type: Number,
                default: 0,
            },
            numberOfReviews: {
                type: Number,
                default: 0,
            },
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

// Middleware To Validate Product Price Against Discount Price
productSchema.pre("validate", function (next) {
    if (this.productDiscountPrice && this.productDiscountPrice >= this.basePrice) {
        return next(new Error("Discount Price Must Be Less than Base Price"));
    }
    next();
});

export const Product = mongoose.model("Product", productSchema);
