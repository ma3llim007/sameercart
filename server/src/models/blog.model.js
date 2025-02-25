import mongoose, { Schema } from "mongoose";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

const blogScheme = new Schema(
    {
        blogTitle: {
            type: String,
            required: [true, "Blog Title Is Required"],
            lowercase: true,
            trim: true,
        },
        blogSlug: {
            type: String,
            required: [true, "Blog Title Is Required"],
            lowercase: true,
            trim: true,
            unique: true,
        },
        blogFeatureImage: {
            type: String,
            required: [true, "Blog Feature Image Is Required"],
        },
        blogDetailImage: {
            type: String,
            required: [true, "Blog Detail Image Is Required"],
        },
        blogShortDescription: {
            type: String,
            required: [true, "Blog Short Description Is Required"],
        },
        blogDescription: {
            type: String,
            required: [true, "Blog Description Is Required"],
        },
    },
    {
        timestamps: true,
    }
);

// Pre-save hook to sanitize HTML content before saving to the database
blogScheme.pre("save", function (next) {
    if (this.blogDescription) {
        this.blogDescription = purify.sanitize(this.blogDescription);
    }
    next();
});

export const Blog = mongoose.model("Blog", blogScheme);
