import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Admin } from "../models/admin.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// Generating Access And Refresh Token
const generateAccessAndRefeshTokens = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId);
        const accessToken = admin.generateAccessToken();
        const refreshToken = admin.generateRefreshToken();

        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (_error) {
        throw new ApiError(500, "Something Went Wrong While Generating Refresh And Access Token");
    }
};

// Verify Token
// const verifyToken = (token, secret) => {
//     return new Promise((resolve, reject) => {
//         jwt.verify(token, secret, (err, decoded) => {
//             if (err) {
//                 return reject(err);
//             }
//             return resolve(decoded);
//         });
//     });
// };
const verifyToken = (token, secret) => {
    new Promise((resolve, reject) =>
        jwt.verify(token, secret, (err, decoded) => (err ? reject(err) : resolve(decoded)))
    );
};

// HTTP OPTIONS
const HttpOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
};

// Register Admin
const registerAdmin = asyncHandler(async (req, res) => {
    const { username, email, fullName, phoneNumber, password } = req.body;
    if ([username, email, fullName, phoneNumber, password].some((field) => field?.trim() === "")) {
        return res.status(422).json(new ApiError(422, "Both Field Are Required"));
    }
    const existedAdmin = await Admin.findOne({
        $or: [{ email }, { username }],
    });
    if (existedAdmin) {
        return res.status(409).json(new ApiError(409, "Admin With This Email Or Username is Already Exists"));
    }

    const admin = await Admin.create({
        username,
        email,
        fullName,
        phoneNumber,
        password,
    });

    const createdUser = await Admin.findById(admin._id).select("-password -refreshToken");

    return res.status(201).json(new ApiResponse(200, createdUser, "Admin Register Successfully"));
});

// Login Admin
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json(new ApiError(422, "Both Field Are Required"));
    }

    const adminIsExisted = await Admin.findOne({ email });
    if (!adminIsExisted) {
        return res.status(404).json(new ApiError(404, "Admin Not Found"));
    }

    const isPasswordValid = await adminIsExisted.isPasswordCorrect(password);
    if (!isPasswordValid) {
        return res.status(401).json(new ApiError(401, "Password Not Match"));
    }

    if (!adminIsExisted.isActive) {
        return res
            .status(403)
            .json(
                new ApiError(
                    403,
                    "Access Denied. Your Account Is Not Active. Please Verify Your Email To Activate Your Account."
                )
            );
    }

    if (!adminIsExisted.asOwnerShip) {
        return res
            .status(403)
            .json(new ApiError(403, "Access Denied. You Do Not Have Ownership Permissions To Access The Panel."));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefeshTokens(adminIsExisted._id);
    const loggedInAdmin = await Admin.findById(adminIsExisted._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, HttpOptions)
        .cookie("refreshToken", refreshToken, HttpOptions)
        .json(
            new ApiResponse(
                200,
                {
                    admin: loggedInAdmin,
                    accessToken,
                },
                "Admin Logged In Successfully"
            )
        );
});

// LogOut Admin
const logOutAdmin = asyncHandler(async (req, res) => {
    if (!req.admin || !req.admin._id) {
        return res.status(400).json(new ApiError(400, "Admin Not Authenticated"));
    }
    await Admin.findByIdAndUpdate(
        req.admin._id,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );
    return res
        .status(200)
        .clearCookie("accessToken", HttpOptions)
        .clearCookie("refreshToken", HttpOptions)
        .json(new ApiResponse(200, {}, "Admin Logged Out"));
});

// Refresh Token
const refreshAccessTokenAdmin = asyncHandler(async (req, res) => {
    const currentRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!currentRefreshToken) {
        return res.status(401).json(new ApiError(401, "Unauthorized Request"));
    }

    try {
        const decodedToken = jwt.verify(currentRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const admin = await Admin.findById(decodedToken?._id);

        if (!admin) {
            return res.status(401).json(401, "Invalid Refresh Token");
        }

        if (currentRefreshToken !== admin?.refreshToken) {
            return res.status(401).json(new ApiError(401, "Refresh Token Is Expired Or Used"));
        }
        const { accessToken, refreshToken } = await generateAccessAndRefeshTokens(admin._id);
        return res
            .status(200)
            .cookie("accessToken", accessToken, HttpOptions)
            .cookie("refreshToken", refreshToken, HttpOptions)
            .json(new ApiResponse(200, { accessToken, refreshToken }, "Access Token Refresh"));
    } catch (error) {
        return res.status(401).json(new ApiError(401, error?.message || "Invalid refresh token"));
    }
});

// Check session
const checkSession = asyncHandler(async (req, res) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        return res.status(401).json(new ApiError(401, "Access Token Is Required"));
    }
    try {
        const admin = await verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
        return res
            .status(200)
            .json(new ApiResponse(200, { isAuthenticated: true, admin }, "Admin AccessToken Verified Successfully"));
    } catch (_error) {
        return res.status(403).json(new ApiError(403, "Access Token Is Not Valid"));
    }
});

export { registerAdmin, loginAdmin, logOutAdmin, refreshAccessTokenAdmin, checkSession };
