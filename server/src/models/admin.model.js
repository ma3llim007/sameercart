import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username Is Required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email Is Required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: [true, "Full Name Is Required"],
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: [true, "Phone Number Is Required"],
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        asOwnerShip: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// hashing the password
adminSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {return next();}
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error);
    }
});

// checking password is correct
adminSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// generating access token
adminSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// generating refresh token
adminSchema.methods.generateRefreshToken = function () {
    const refreshToken = jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
    this.refreshToken = refreshToken;
    return refreshToken;
};

export const Admin = mongoose.model("Admin", adminSchema);
