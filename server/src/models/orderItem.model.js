import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema(
    {
        productName: {
            type: String,
            required: [true, "Product Name Is Required"],
        },
        price: {
            type: Number,
            required: [true, "Price Is Required"],
        },
        quantity: {
            type: Number,
            required: [true, "Quantity Is Required"],
        },
        totalPrice: {
            type: Number,
            required: [true, "Total Price Is Required"],
        },
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: [true, "Product Is Required"],
        },
    },
    { timeseries: true }
);

export const OrderItem = mongoose.model("OrderItem", orderItemSchema);
