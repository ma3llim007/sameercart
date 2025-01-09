import { SubCategory } from "../../models/subCategory.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const subcategories = asyncHandler(async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Get the total number of categories
        const totalSubCategorires = await SubCategory.countDocuments();

        // Calculate total pages
        const totalPages = Math.ceil(totalSubCategorires / limit);

        // Adjust page if it exceeds total pages
        if (page > totalPages && totalPages > 0) {
            page = totalPages;
        }

        // Fetch paginated Sub-categories
        const subcategories = await SubCategory.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select("subCategoryName subCategorySlug subCategoryImage");

        // If no categories are found, handle the empty state
        if (!subcategories.length) {
            return res
                .status(200)
                .json(new ApiResponse(200, { subcategories: [], page, totalPages }, "No Sub Category Found"));
        }

        // Return the paginated categories with metadata
        return res
            .status(200)
            .json(new ApiResponse(200, { subcategories, page, totalPages }, "Sub Category Fetch Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

export { subcategories };
