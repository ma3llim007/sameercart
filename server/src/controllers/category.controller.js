import redisClient from "../config/redis.js";
import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateCacheKey } from "../utils/redis.utils.js";

// Listing the category with subCategory for header
const categoryWithSubCategory = asyncHandler(async (req, res) => {
    const key = generateCacheKey(req);

    // Check if data exists in Redis cache
    const cacheData = await redisClient.get(key);
    if (cacheData) {
        return res.status(200).json(new ApiResponse(200, JSON.parse(cacheData), "Data Fetch Successfully"));
    }
    try {
        const categoryWithSubCategoryData = await Category.aggregate([
            // Match active categories
            { $match: { isActive: true } },
            // Lookup to join subcategories
            { $lookup: { from: "subcategories", localField: "_id", foreignField: "parentCategory", as: "subcategories" } },
            // Filter only active subcategories
            { $addFields: { subcategories: { $filter: { input: "$subcategories", as: "sub", cond: { $eq: ["$$sub.isActive", true] } } } } },
            { $addFields: { subcategories: { $sortArray: { input: "$subcategories", sortBy: { subCategoryName: 1 } } } } },
            {
                $project: {
                    _id: 1,
                    categoryName: 1,
                    categorySlug: 1,
                    subcategories: { $map: { input: "$subcategories", as: "sub", in: { _id: "$$sub._id", subCategoryName: "$$sub.subCategoryName", subCategorySlug: "$$sub.subCategorySlug" } } },
                },
            },
            // Limit
            { $limit: 4 },
        ]);

        // Setting the data in cache
        await redisClient.setEx(key, 600, JSON.stringify(categoryWithSubCategoryData));

        return res.status(200).json(new ApiResponse(200, categoryWithSubCategoryData, "Data Fetch Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

// Popular Categories
const popularCategories = asyncHandler(async (req, res) => {
    const key = generateCacheKey(req);

    // Check if data exists in Redis cache
    const cacheData = await redisClient.get(key);
    if (cacheData) {
        return res.status(200).json(new ApiResponse(200, JSON.parse(cacheData), "Category Fetch Successfully"));
    }

    try {
        const categories = await Category.aggregate([
            { $match: { isActive: true } },
            // Lookup to join subcategories
            { $lookup: { from: "subcategories", localField: "_id", foreignField: "parentCategory", as: "subcategories" } },
            // Filter only active subcategories
            { $addFields: { subcategories: { $filter: { input: "$subcategories", as: "sub", cond: { $eq: ["$$sub.isActive", true] } } } } },
            // Sort subcategories in ascending order
            { $addFields: { subcategories: { $sortArray: { input: "$subcategories", sortBy: { subCategoryName: 1 } } } } },
            // Sort categories in ascending order
            { $sort: { categoryName: 1 } },
            {
                $project: {
                    _id: 1,
                    categoryName: 1,
                    categorySlug: 1,
                    categoryImage: 1,
                    subcategories: {
                        $slice: [{ $map: { input: "$subcategories", as: "sub", in: { _id: "$$sub._id", subCategoryName: "$$sub.subCategoryName", subCategorySlug: "$$sub.subCategorySlug" } } }, 3],
                    },
                },
            },
        ]);

        // Setting the data in cache
        await redisClient.setEx(key, 600, JSON.stringify(categories));

        return res.status(200).json(new ApiResponse(200, categories, "Category Fetch Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

// Category With Pagination
const categories = asyncHandler(async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;

        // Generate a Unique cache key based on page & limit
        const key = generateCacheKey(req);

        // Check if data exists in Redis cache
        const cacheData = await redisClient.get(key);
        if (cacheData) {
            return res.status(200).json(new ApiResponse(200, JSON.parse(cacheData), "Categories Fetch Successfully"));
        }

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Get the total number of categories
        const totalCategories = await Category.countDocuments();

        // Calculate total pages
        const totalPages = Math.ceil(totalCategories / limit);

        // Adjust page if it exceeds total pages
        if (page > totalPages && totalPages > 0) {
            page = totalPages;
        }

        // Fetch paginated categories
        const categories = await Category.find().skip(skip).limit(limit).sort({ createdAt: -1 }).select("categoryName categorySlug categoryImage");

        // If no categories are found, handle the empty state
        if (!categories.length) {
            return res.status(200).json(new ApiResponse(200, { categories: [], page, totalPages }, "No categories Found"));
        }

        // Setting the data in cache
        await redisClient.setEx(key, 600, JSON.stringify({ categories, page, totalPages }));
        
        // Return the paginated categories with metadata
        return res.status(200).json(new ApiResponse(200, { categories, page, totalPages }, "Categories Fetch Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

export { categoryWithSubCategory, popularCategories, categories };
