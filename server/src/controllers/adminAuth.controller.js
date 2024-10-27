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
    } catch (error) {
        throw new ApiError(
            500,
            "Something Went Wrong While Generating Refresh And Access Token"
        );
    }
};

// HTTP OPTIONS
const HttpOptions = {
    httpOnly: true,
    secure: true,
};

// Register Admin
const registerAdmin = asyncHandler(async (req, res) => {
    const { username, email, fullName, phoneNumber, password } = req.body;
    if (
        [username, email, fullName, phoneNumber, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All Field Are Required");
    }
    const existedAdmin = await Admin.findOne({
        email,
    });
    if (existedAdmin) {
        throw new ApiError(404, "Admin With This Email is Already Exists");
    }

    const admin = await Admin.create({
        username,
        email,
        fullName,
        phoneNumber,
        password,
    });

    const createdUser = await Admin.findById(admin._id).select(
        "-password -refreshToken"
    );

    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "Admin Register Successfully"));
});

// Login Admin
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Both Field Are Required");
    }

    const adminIsExisted = await Admin.findOne({ email });
    if (!adminIsExisted) {
        throw new ApiError(404, "Admin Not Found");
    }

    const isPasswordValid = await adminIsExisted.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Password Not Match");
    }

    if (!adminIsExisted.isActive) {
        throw new ApiError(
            401,
            "Access denied. Your account is not active. Please verify your email to activate your account."
        );
    }

    if (!adminIsExisted.asOwnerShip) {
        throw new ApiError(
            403,
            "Access denied. You do not have ownership permissions to access the panel."
        );
    }

    const { accessToken, refreshToken } = await generateAccessAndRefeshTokens(
        adminIsExisted._id
    );
    const loggedInAdmin = await Admin.findById(adminIsExisted._id).select(
        "-password -refreshToken"
    );
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
                    refreshToken,
                },
                "Admin Logged In Successfully"
            )
        );
});

// LogOut Admin
const logOutAdmin = asyncHandler(async (req, res) => {
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
    const currentRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;

    if (!currentRefreshToken) {
        throw new ApiError(401, "Unauthorized Request");
    }

    try {
        const decodedToken = jwt.verify(
            currentRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        const admin = await Admin.findById(decodedToken?._id);

        if (!admin) {
            throw new ApiError(401, "Invalid Refresh Token");
        }

        if (currentRefreshToken !== admin?.refreshToken) {
            throw new ApiError(401, "Refresh Token Is Expired Or Used");
        }
        const { accessToken, refreshToken } =
            await generateAccessAndRefeshTokens(admin._id);
        return res
            .status(200)
            .cookie("accessToken", accessToken, HttpOptions)
            .cookie("refreshToken", refreshToken, HttpOptions)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access Token Refresh"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

export { registerAdmin, loginAdmin, logOutAdmin, refreshAccessTokenAdmin };
