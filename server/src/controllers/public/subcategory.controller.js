import { Category } from "../../models/category.model.js";
import { SubCategory } from "../../models/subCategory.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// all Sub-categories
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

// sub Category as per the Category
const subCategoryByCategory = asyncHandler(async (req, res) => {
    const { categorySlug } = req.params;

    if (!categorySlug || !categorySlug?.trim()) {
        return res.status(422).json(new ApiError(422, "Category Slug Is Required"));
    }

    try {
        let page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // finding the category ID by slug
        const category = await Category.findOne({ categorySlug });

        // Get The Total Number Of Sub Category
        const totalSubCategorires = await SubCategory.countDocuments({ parentCategory: category._id });

        // Calculate Total Pages
        const totalPages = Math.ceil(totalSubCategorires / limit);

        // Adjust Page If It Exceeds Total Pages
        if (page > totalPages && totalPages > 0) {
            page = totalPages;
        }

        // Fetching Pagination Sub Category
        const subCategorys = await SubCategory.find({ parentCategory: category._id })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .select("subCategoryName subCategorySlug subCategoryImage");

        // If no subcategories aare found, handle the empty state
        if (!subCategorys.length) {
            return res
                .status(200)
                .json(new ApiResponse(200, { subCategory: [], page, totalPages }, "No Sub Category Found"));
        }

        // Return The Pagination Sub Category With Metadata
        return res
            .status(200)
            .json(new ApiResponse(200, { subCategorys, page, totalPages }, "Sub Category Fetch Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});
export { subcategories, subCategoryByCategory };
