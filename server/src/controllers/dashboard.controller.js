import { User } from "../models/user.model.js";
import { ApiResponse, asyncHandler } from "../utils/index.js";

const getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    return res.status(200).json(new ApiResponse(200, user, "User Data Fetch Successfully"));
});

export { getUser };
