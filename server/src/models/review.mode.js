import mongoose, { Schema } from "mongoose";

const reviewScheme = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Is Required"],
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product Is Required"],
    },
    rating: {
        type: Number,
        required: [true, "Rating Is Required"],
    },
    title: {
        type: String,
        required: [true, "Title Is Required"],
    },
    comment: {
        type: String,
        required: [true, "Comment Is Required"],
    },
});

export const Review = mongoose.model("Review", reviewScheme);
