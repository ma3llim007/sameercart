import { Admin } from "../models/admin.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyAdmin = asyncHandler(async (req, res, next) => {
    try {
        // Retrieve token from cookies or Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            res.status(401).json(new ApiError(401, "Unauthorized Request: No Access Token Provided"));
        }

        // Verify and decode token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken?._id) {
            res.status(401).json(new ApiError(401, "Invalid Access Token: Token Decoding Failed"));
        }

        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken");
        if (!admin || !admin.isActive) {
            res.status(401).json(new ApiError(403, "Access Denied. Your Account is Inactive."));
        }

        if (!admin.asOwnerShip) {
            res.status(401).json(new ApiError(403, "Access Denied. Admin Panel Access Restricted."));
        }
        if (!admin) {
            res.status(401).json(new ApiError(401, "Admin Not Found"));
        }
        req.admin = admin;
        next();
    } catch (error) {
        const errorMessage =
            error.name === "TokenExpiredError" ? "Access Token Expired" : error?.message || "Invalid Access Token";
        res.status(401).json(new ApiError(401, errorMessage));
    }
});
