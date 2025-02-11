import { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";

const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    return res.status(200).json(new ApiResponse(200, user, "User Data Fetch Successfully"));
});

const editUserDetails = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!isValidObjectId(userId)) {
        return res.status(404).json(new ApiError(404, "Invalid User Id"));
    }

    const userData = await User.findById(userId);
    if (!userData) {
        return res.status(404).json(new ApiError(404, "User Not Found"));
    }

    try {
        const { firstName, lastName, email, username, phoneNumber } = req.body;

        // Check if at least one field is provided for update
        if (!firstName && !lastName && !email && !username && !phoneNumber) {
            return res.status(400).json(new ApiError(400, "At Least One Field (First Name, Last Name, Email, Username, Or Phone Number) Is Required For Update"));
        }

        // Check for duplicate username or email only if they are being updated
        let duplicateUser = null;
        if (username || email) {
            duplicateUser = await User.findOne({
                _id: { $ne: userId },
                $or: [username ? { username } : null, email ? { email } : null].filter(Boolean),
            });
        }

        // Check if there's a conflict with either username or email
        if (duplicateUser) {
            if (duplicateUser.username === username) {
                return res.status(409).json(new ApiError(409, "User Name Already Exists"));
            }
            if (duplicateUser.email === email) {
                return res.status(409).json(new ApiError(409, "E Mail Already Exists"));
            }
        }

        // Update fields if there are no conflicts
        if (firstName) {
            userData.firstName = firstName;
        }
        if (lastName) {
            userData.lastName = lastName;
        }
        if (email) {
            userData.email = email;
        }
        if (username) {
            userData.username = username;
        }
        if (phoneNumber) {
            userData.phoneNumber = phoneNumber;
        }

        await userData.save();
        return res.status(200).json(new ApiResponse(200, userData, "User Details Update Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Internal Server Error"));
    }
});

const editUserAddress = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    if (!isValidObjectId(userId)) {
        return res.status(404).json(new ApiError(404, "Invalid User Id"));
    }

    const userData = await User.findById(userId);
    if (!userData) {
        return res.status(404).json(new ApiError(404, "User Not Found"));
    }

    try {
        const { street, city, state, country, zipCode } = req.body;

        // Check if at least one field is provided for update
        if (!street && !city && !state && !country && !zipCode) {
            return res.status(400).json(new ApiError(400, "At Least One Field (Street, City, State, Countrt, Or Zip Code) Is Required For Update"));
        }

        // Update fields
        if (street) {
            userData.address.street = street;
        }
        if (city) {
            userData.address.city = city;
        }
        if (state) {
            userData.address.state = state;
        }
        if (country) {
            userData.address.country = country;
        }
        if (zipCode) {
            userData.address.zip_code = zipCode;
        }

        await userData.save();
        return res.status(200).json(new ApiResponse(200, userData, "User Address Update Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message || "Internal Server Error"));
    }
});

export { getUser, editUserDetails, editUserAddress };
