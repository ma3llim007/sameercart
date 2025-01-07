import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { SubCategory } from "../models/subCategory.model.js";
import { extractPublicId, removeImage, uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ConvertImageWebp } from "../utils/ConvertImageWebp.js";

// Add sub category
const addSubCategory = asyncHandler(async (req, res) => {
    const { subCategoryName, subCategorySlug, parentCategory } = req.body;
    const subCategoryImage = req.file?.path;

    if (!parentCategory || !parentCategory.trim() === "") {
        return res.status(422).json(new ApiError(422, "Category ID Is Required"));
    }

    if (!isValidObjectId(parentCategory)) {
        return res.status(400).json(new ApiError(400, "Invalid Category ID"));
    }

    if (!subCategoryName || !subCategorySlug || !parentCategory || !subCategoryImage) {
        return res.status(422).json(new ApiError(422, "All Field Are Required"));
    }

    // Check for duplicate subcategory name or slug
    const duplicateSubCategory = await SubCategory.findOne({
        $or: [{ subCategoryName }, { subCategorySlug }],
    });

    if (duplicateSubCategory) {
        return res.status(409).json(new ApiError(409, "Sub Category Name Or Slug Already Exists"));
    }

    // Convert Image To WebP
    let convertedImagePath = subCategoryImage;
    if (req.file.mimetype !== "image/webp") {
        convertedImagePath = await ConvertImageWebp(subCategoryImage);
    }
    let imageUrl = null;
    if (subCategoryImage) {
        const imageUpload = await uploadCloudinary(convertedImagePath, "sameerCart/subcategory");
        imageUrl = imageUpload.secure_url;
    }
    const subCategory = await SubCategory.create({
        subCategoryName,
        subCategorySlug,
        subCategoryImage: imageUrl,
        parentCategory,
        addedBy: req.admin._id,
    });

    return res.status(201).json(new ApiResponse(201, subCategory, "Sub Category Created Successfully"));
});

// Sub Category List
const getSubCategory = asyncHandler(async (req, res) => {
    // Aggregate pipeline to get a category along with its subcategories
    try {
        const subCategory = await SubCategory.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "parentCategory",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $project: {
                    categoryName: "$category.categoryName",
                    subCategoryName: 1,
                    subCategorySlug: 1,
                    subCategoryImage: 1,
                    updatedAt: 1,
                    isActive: 1,
                },
            },
        ]);
        return res.status(200).json(new ApiResponse(200, subCategory, "Sub-Categorys Fetch Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

// Delete SubCategory
const deleteSubCategory = asyncHandler(async (req, res) => {
    const { subCategoryId } = req.params;

    if (!subCategoryId || !subCategoryId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Sub-Category ID Is Required"));
    }

    if (!isValidObjectId(subCategoryId)) {
        return res.status(400).json(new ApiError(400, "Invalid Sub-Category ID"));
    }

    const subCategory = await SubCategory.findById(subCategoryId);

    if (!subCategory) {
        return res.status(404).json(new ApiError(404, "Sub Category Not Found"));
    }

    const subCategoryImage = subCategory?.subCategoryImage;
    const deleteSubCat = await SubCategory.deleteOne({ _id: subCategoryId });

    if (deleteSubCat && subCategoryImage) {
        const publicId = extractPublicId(subCategoryImage);
        try {
            await removeImage("sameerCart/subcategory/", publicId);
        } catch (_error) {
            return res.status(500).json(new ApiError(500, "Failed To Remove Previous Sub Category Image"));
        }
    }

    return res.status(200).json(new ApiResponse(200, {}, "Sub-Category Delete Successfully"));
});

// get sub category by ID
const getSubCategoryById = asyncHandler(async (req, res) => {
    const { subCategoryId } = req.params;
    if (!subCategoryId || !subCategoryId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Sub-Category ID Is Required"));
    }

    if (!isValidObjectId(subCategoryId)) {
        return res.status(400).json(new ApiError(400, "Invalid Sub-Category ID"));
    }

    try {
        const subCategory = await SubCategory.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(subCategoryId) } },
            {
                $lookup: {
                    from: "categories",
                    localField: "parentCategory",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $unwind: {
                    path: "$category",
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $project: {
                    categoryName: "$category.categoryName",
                    parentCategory: "$category._id",
                    subCategoryName: 1,
                    subCategorySlug: 1,
                    subCategoryImage: 1,
                    isActive: 1,
                },
            },
        ]);
        return res.status(200).json(new ApiResponse(200, subCategory, "Sub-Category Fetch Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

// update Sub Category
const updateSubCategory = asyncHandler(async (req, res) => {
    const { subCategoryName, subCategorySlug, parentCategory, subCategoryId } = req.body;
    const subCategoryImage = req.file?.path;

    if (!subCategoryId || !subCategoryId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Sub-Category ID Is Required"));
    }

    if (!isValidObjectId(subCategoryId)) {
        return res.status(400).json(new ApiError(400, "Invalid Sub-Category ID"));
    }

    const subCategoryCur = await SubCategory.findById(subCategoryId);
    if (!subCategoryCur) {
        return res.status(404).json(new ApiError(404, "Sub-Category Not Found"));
    }

    // check if there's a conflict with either name or slug
    const duplicateSubCategory = await SubCategory.findOne({
        _id: { $ne: subCategoryId },
        $or: [
            { subCategoryName: subCategoryName ? subCategoryName : subCategoryCur.subCategoryName },
            { subCategorySlug: subCategorySlug ? subCategorySlug : subCategoryCur.subCategorySlug },
        ],
    });

    // Check if there's a conflict with either name or slug
    if (duplicateSubCategory) {
        if (duplicateSubCategory.subCategoryName === subCategoryName) {
            return res.status(409).json(new ApiError(409, "Sub-Category Name Already Exists"));
        }
        if (duplicateSubCategory.subCategorySlug === subCategorySlug) {
            return res.status(409).json(new ApiError(409, "Sub-Category Slug Already Exists"));
        }
    }

    // Update fields if there are no conflicts
    if (subCategoryName) {
        subCategoryCur.subCategoryName = subCategoryName;
    }
    if (subCategorySlug) {
        subCategoryCur.subCategorySlug = subCategorySlug;
    }
    if (parentCategory) {
        subCategoryCur.parentCategory = parentCategory;
    }

    // Handle sub category image upload and Remove the previous image
    if (subCategoryImage) {
        const previousSubCategoryImage = subCategoryCur.subCategoryImage;
        if (subCategoryImage && previousSubCategoryImage) {
            const publicId = extractPublicId(previousSubCategoryImage);
            try {
                await removeImage("sameerCart/subcategory/", publicId);
            } catch (_error) {
                return res.status(500).json(new ApiError(500, "Failed To Remove Previous Sub-Category Image"));
            }
        }

        // Convert Image To WebP
        let convertedImagePath = subCategoryImage;
        if (req.file.mimetype !== "image/webp") {
            convertedImagePath = await ConvertImageWebp(subCategoryImage);
        }

        // Upload the new image
        try {
            const subCategoryUpload = await uploadCloudinary(convertedImagePath, "sameerCart/subcategory");
            subCategoryCur.subCategoryImage = subCategoryUpload?.secure_url;
        } catch (_error) {
            return res.status(500).json(new ApiError(500, "Failed To Upload Sub-Category Image."));
        }
    }
    await subCategoryCur.save();

    return res.status(200).json(new ApiResponse(200, subCategoryCur, "Sub Category Update Successfully"));
});

// Toggle sub-category
const toggleSubCategory = asyncHandler(async (req, res) => {
    const { subCategoryId } = req.params;
    const { isActive } = req.body;

    if (!subCategoryId || !subCategoryId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Sub-Category ID Is Required"));
    }

    if (!isValidObjectId(subCategoryId)) {
        return res.status(400).json(new ApiError(400, "Invalid Sub-Category ID"));
    }

    const subCategory = await SubCategory.findById({ _id: subCategoryId });

    if (!subCategory) {
        return res.status(404).json(new ApiError(404, "Sub-Category Not Found"));
    }
    subCategory.isActive = isActive;
    await subCategory.save();

    return res.status(200).json(new ApiResponse(200, {}, "Sub-Category Status Updated Successfully"));
});

// Get Sub Category By Id Options
const subCategoryByIdOptions = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    if (!categoryId || !categoryId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Category ID Is Required"));
    }

    if (!isValidObjectId(categoryId)) {
        return res.status(400).json(new ApiError(400, "Invalid Category ID"));
    }

    try {
        const subCategoryOptions = await SubCategory.aggregate([
            { $match: { parentCategory: new mongoose.Types.ObjectId(categoryId) } },
            {
                $project: {
                    subCategoryName: 1,
                    _id: 1,
                },
            },
        ]);

        return res
            .status(200)
            .json(new ApiResponse(200, subCategoryOptions, "Sub Category Options Fetch Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

export {
    addSubCategory,
    getSubCategory,
    deleteSubCategory,
    getSubCategoryById,
    updateSubCategory,
    toggleSubCategory,
    subCategoryByIdOptions,
};
