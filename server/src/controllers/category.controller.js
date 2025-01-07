import { isValidObjectId } from "mongoose";
import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { extractPublicId, removeImage, uploadCloudinary } from "../utils/cloudinary.js";
import { ConvertImageWebp } from "../utils/ConvertImageWebp.js";
import { SubCategory } from "../models/subCategory.model.js";

// Add Category
const addCategory = asyncHandler(async (req, res) => {
    const { categoryName, categorySlug } = req.body;
    const categoryImage = req.file?.path;

    if (!categoryName?.trim() || !categorySlug?.trim()) {
        return res.status(422).json(new ApiError(422, "All Field Are Required"));
    }

    if (!categoryImage) {
        return res.status(422).json(new ApiError(422, "Category Image Is Required"));
    }

    if (!categoryName || !categorySlug || !categoryImage) {
        return res.status(422).json(new ApiError(422, "All Field Are Required"));
    }

    const categoryExisted = await Category.findOne({ categorySlug });

    if (categoryExisted) {
        return res.status(409).json(new ApiError(409, "Category Is Already Exists"));
    }

    // Convert Image To WebP
    let convertedImagePath = categoryImage;
    if (req.file?.mimetype !== "image/webp") {
        try {
            convertedImagePath = await ConvertImageWebp(categoryImage);
        } catch (error) {
            return res.status(500).json(new ApiError(500, "Failed to Convert Image to WebP"));
        }
    }

    // Upload to Cloudinary
    let categoryUpload = null;
    try {
        categoryUpload = await uploadCloudinary(convertedImagePath, "sameerCart/category");
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Failed To Upload Category Image."));
    }

    const category = await Category.create({
        categoryName,
        categorySlug,
        categoryImage: categoryUpload?.secure_url,
        addedBy: req.admin._id,
    });

    return res.status(201).json(new ApiResponse(201, category, "Category Created Successfully"));
});

// Category List
const categories = asyncHandler(async (req, res) => {
    const categorys = await Category.find();
    return res.status(200).json(new ApiResponse(200, categorys, "Categorys Fetch Successfully"));
});

// get category by id
const getCateogryById = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    if (!categoryId || categoryId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Category ID Is Required"));
    }

    if (!isValidObjectId(categoryId)) {
        return res.status(400).json(new ApiError(400, "Invalid Category ID"));
    }

    const category = await Category.findById(categoryId);
    if (!category) {
        return res.status(404).json(new ApiError(401, "Category Not Found"));
    }

    return res.status(200).json(new ApiResponse(200, category, "Category Fetch Successfully"));
});

// Update Category
const updateCategory = asyncHandler(async (req, res) => {
    const { categoryName, categorySlug, categoryId } = req.body;
    const categoryImage = req.file?.path;

    if (!categoryId) {
        return res.status(422).json(new ApiError(422, "Category ID is Required"));
    }

    if (!isValidObjectId(categoryId)) {
        return res.status(404).json(new ApiError(404, "Invalid Category Id"));
    }

    const category = await Category.findById(categoryId);
    if (!category) {
        return res.status(404).json(new ApiError(404, "Category Not Found"));
    }

    // Check if at least one field is provided for update
    if (!categoryName && !categorySlug && !categoryImage) {
        return res
            .status(400)
            .json(new ApiError(400, "At least one field (Name, Slug, or Image) is required for update"));
    }

    const duplicateCategory = await Category.findOne({
        _id: { $ne: categoryId },
        $or: [
            { categoryName: categoryName ? categoryName : category.categoryName },
            { categorySlug: categorySlug ? categorySlug : category.categorySlug },
        ],
    });

    // Check if there's a conflict with either name or slug
    if (duplicateCategory) {
        if (duplicateCategory.categoryName === categoryName) {
            return res.status(409).json(new ApiError(409, "Category Name Already Exists"));
        }
        if (duplicateCategory.categorySlug === categorySlug) {
            return res.status(409).json(new ApiError(409, "Category Slug Already Exists"));
        }
    }

    // Update fields if there are no conflicts
    if (categoryName) {
        category.categoryName = categoryName;
    }
    if (categorySlug) {
        category.categorySlug = categorySlug;
    }

    // Handle category image upload and Remove the previous image
    if (categoryImage) {
        const previousCatImage = category.categoryImage;

        if (categoryImage && previousCatImage) {
            const publicId = extractPublicId(previousCatImage);
            try {
                await removeImage("sameerCart/category/", publicId);
            } catch (error) {
                return res.status(500).json(new ApiError(500, "Failed To Remove Previous Category Image"));
            }
        }

        // Convert Image To WebP
        let convertedImagePath = categoryImage;
        if (req.file.mimetype !== "image/webp") {
            try {
                convertedImagePath = await ConvertImageWebp(categoryImage);
            } catch (error) {
                return res.status(500).json(new ApiError(500, "Failed to Convert Image to WebP"));
            }
        }

        // Upload to Cloudinary
        try {
            const categoryUpload = await uploadCloudinary(convertedImagePath, "sameerCart/category");
            category.categoryImage = categoryUpload.secure_url;
        } catch (error) {
            return res.status(500).json(new ApiError(500, "Failed To Upload Category Image."));
        }
    }
    await category.save();

    return res.status(200).json(new ApiResponse(200, category, "Category Update Successfully"));
});

// Delete Category
const deleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    if (!categoryId || categoryId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Category ID Is Required"));
    }

    if (!isValidObjectId(categoryId)) {
        return res.status(400).json(new ApiError(400, "Invalid Category ID"));
    }

    const category = await Category.findById(categoryId);
    if (!category) {
        return res.status(404).json(new ApiError(401, "Category Not Found"));
    }
    const categoryImage = category?.categoryImage;

    // Find and delete all subcategories associated with the category
    const subcategories = await SubCategory.find({ parentCategory: categoryId });

    for (const subCategory of subcategories) {
        const subCategoryId = subCategory?._id.toString();
        const subCategoryImage = subCategory?.subCategoryImage;
        const deleteSubCat = await SubCategory.deleteOne({ _id: subCategoryId });

        if (deleteSubCat && subCategoryImage) {
            const publicId = extractPublicId(subCategoryImage);
            try {
                await removeImage("sameerCart/subcategory/", publicId);
            } catch (error) {
                return res.status(500).json(new ApiError(500, "Failed To Remove Previous Sub Category Image"));
            }
        }
    }

    const deleteCate = await Category.deleteOne({ _id: categoryId });
    if (deleteCate.deletedCount === 0) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong While Deleting The Category"));
    }
    if (deleteCate && categoryImage) {
        const publicId = extractPublicId(categoryImage);
        try {
            await removeImage("sameerCart/category/", publicId);
        } catch (error) {
            return res.status(500).json(new ApiError(500, "Failed To Remove Previous Category Image"));
        }
    }

    return res.status(200).json(new ApiResponse(200, {}, "Category Delete Successfully"));
});

// Toggle category
const toggleCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const { isActive } = req.body;

    if (!categoryId || categoryId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Category ID is Required"));
    }

    if (!isValidObjectId(categoryId)) {
        return res.status(404).json(new ApiError(404, "Invalid Category Id"));
    }

    const category = await Category.findById({ _id: categoryId });

    if (!category) {
        return res.status(404).json(new ApiError(404, "Category Not Found"));
    }
    category.isActive = isActive;
    await category.save();
    return res.status(200).json(new ApiResponse(200, category, "Category Status Updated Successfully"));
});

// options category with only name and _id
const getOptionsCategory = asyncHandler(async (req, res) => {
    const category = await Category.aggregate([
        { $match: { isActive: true } },
        {
            $project: {
                categoryName: 1,
                _id: 1,
            },
        },
    ]);
    return res.status(200).json(new ApiResponse(200, category, "Categorys Options Fetch Successfully"));
});

export { addCategory, categories, deleteCategory, updateCategory, toggleCategory, getCateogryById, getOptionsCategory };
