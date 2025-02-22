import { isValidObjectId } from "mongoose";
import { User } from "../../models/user.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../../utils/index.js";

const getUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find().select("username firstName lastName email phoneNumber email_verify authMethod");
        return res.status(200).json(new ApiResponse(200, users, "Users Fetch Successfully"));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Fetching Users Listing Data"));
    }
});

const viewUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        return res.status(422).json(new ApiError(422, "User ID Is Required"));
    }

    if (!isValidObjectId(userId)) {
        return res.status(404).json(new ApiError(404, "Invalid User Id"));
    }

    try {
        const user = await User.findById(userId).select("-password -refreshToken");
        
        return res.status(200).json(new ApiResponse(200, user, "User Details Fetch Successfully"));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Fetching Users Data"));
    }
});

export { getUsers, viewUser };
