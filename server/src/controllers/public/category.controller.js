import { Category } from "../../models/category.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// Listing the category with subCategory for header
const categoryWithSubCategory = asyncHandler(async (req, res) => {
    try {
        const categoryWithSubCategoryData = await Category.aggregate([
            // Match active categories
            {
                $match: {
                    isActive: true,
                },
            },
            // Lookup to join subcategories
            {
                $lookup: {
                    from: "subcategories",
                    localField: "_id",
                    foreignField: "parentCategory",
                    as: "subcategories",
                },
            },
            // Filter only active subcategories
            {
                $addFields: {
                    subcategories: {
                        $filter: {
                            input: "$subcategories",
                            as: "sub",
                            cond: {
                                $eq: ["$$sub.isActive", true],
                            },
                        },
                    },
                },
            },
            {
                $addFields: {
                    subcategories: {
                        $sortArray: {
                            input: "$subcategories",
                            sortBy: { subCategoryName: 1 },
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 1,
                    categoryName: 1,
                    categorySlug: 1,
                    subcategories: {
                        $map: {
                            input: "$subcategories",
                            as: "sub",
                            in: {
                                _id: "$$sub._id",
                                subCategoryName: "$$sub.subCategoryName",
                                subCategorySlug: "$$sub.subCategorySlug",
                            },
                        },
                    },
                },
            },
            // Limit
            {
                $limit: 6,
            },
        ]);
        return res.status(200).json(new ApiResponse(200, categoryWithSubCategoryData, "Data Fetch Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

// Popular Categories
const popularCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.aggregate([
            {
                $match: {
                    isActive: true,
                },
            },
            // Lookup to join subcategories
            {
                $lookup: {
                    from: "subcategories",
                    localField: "_id",
                    foreignField: "parentCategory",
                    as: "subcategories",
                },
            },
            // Filter only active subcategories
            {
                $addFields: {
                    subcategories: {
                        $filter: {
                            input: "$subcategories",
                            as: "sub",
                            cond: {
                                $eq: ["$$sub.isActive", true],
                            },
                        },
                    },
                },
            },
            // Sort subcategories in ascending order
            {
                $addFields: {
                    subcategories: {
                        $sortArray: {
                            input: "$subcategories",
                            sortBy: { subCategoryName: 1 },
                        },
                    },
                },
            },
            // Sort categories in ascending order
            {
                $sort: {
                    categoryName: 1,
                },
            },
            {
                $project: {
                    _id: 1,
                    categoryName: 1,
                    categorySlug: 1,
                    categoryImage: 1,
                    subcategories: {
                        $slice: [
                            {
                                $map: {
                                    input: "$subcategories",
                                    as: "sub",
                                    in: {
                                        _id: "$$sub._id",
                                        subCategoryName: "$$sub.subCategoryName",
                                        subCategorySlug: "$$sub.subCategorySlug",
                                    },
                                },
                            },
                            3,
                        ],
                    },
                },
            },
        ]);
        return res.status(200).json(new ApiResponse(200, categories, "Category Fetch Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

export { categoryWithSubCategory, popularCategories };
