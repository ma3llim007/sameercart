import mongoose, { Schema } from "mongoose";

const emailVerificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: [true, "User ID Is Required"] },
    otpCode: {
        type: String,
        required: [true, "OTP Code Is Required"],
    },
    createdAt: { type: Date, default: Date.now, expires: "15m" },
});

const EmailVerification = mongoose.model("EmailVerification", emailVerificationSchema);

export default EmailVerification;
