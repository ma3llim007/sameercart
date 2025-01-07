import { Category } from "../../models/category.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// Category List
const categories = asyncHandler(async (req, res) => {
    const categorys = await Category.find();
    return res.status(200).json(new ApiResponse(200, categorys, "Categorys Fetch Successfully"));
});

export { categories };
