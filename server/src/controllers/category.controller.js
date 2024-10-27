import { isValidObjectId } from "mongoose";
import { Category } from "../models/category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { removeImage, uploadCloudinary } from "../utils/cloudinary.js";

// Add Category
const addCategory = asyncHandler(async (req, res) => {
    const { categoryName, categorySlug } = req.body;
    const categoryImage = req.file?.path;

    if (!categoryName?.trim() || !categorySlug?.trim()) {
        throw new ApiError(400, "All Field Are Required");
    }

    if (!categoryImage) {
        throw new ApiError(400, "Category Image Is Required");
    }

    const categoryExisted = await Category.findOne({ categorySlug });
    if (categoryExisted) {
        throw new ApiError(401, "Category Is Already Exists");
    }

    let categoryUpload;
    try {
        categoryUpload = await uploadCloudinary(
            categoryImage,
            "sameerCart/category"
        );
    } catch (error) {
        throw new ApiError(500, "Failed To Upload Category Image.");
    }

    const category = await Category.create({
        categoryName,
        categorySlug,
        categoryImage: categoryUpload.url,
        addedBy: req.admin._id,
    });

    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category Added Successfully"));
});

// Category List
const categories = asyncHandler(async (req, res) => {
    const categorys = await Category.find();
    return res
        .status(200)
        .json(new ApiResponse(200, categorys, "Categorys Fetch Successfully"));
});

// Update Category
const updateCategory = asyncHandler(async (req, res) => {
    const { categoryName, categorySlug, categoryId } = req.body;
    const categoryImage = req.file?.path;

    if (!categoryId) {
        throw new ApiError(401, "Category ID is Required");
    }

    if (!isValidObjectId(categoryId)) {
        throw new ApiError(401, "Invalid Category Id");
    }

    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(401, "Category Not Found");
    }

    // Handle category image upload and removal
    if (categoryName) category.categoryName = categoryName;
    if (categorySlug) category.categorySlug = categorySlug;
    if (categoryImage) {
        const previousCatImage = category.categoryImage;

        if (categoryImage && previousCatImage) {
            const parts = previousCatImage.split("/");
            const lastPart = parts.pop();
            const [publicId] = lastPart.split(".");
            try {
                removeImage("sameerCart/category/", publicId);
            } catch (error) {
                throw new ApiError(
                    500,
                    "Failed To Remove Previous Category Image"
                );
            }
        }
        // Upload the new image
        try {
            const categoryUpload = await uploadCloudinary(
                categoryImage,
                "sameerCart/category"
            );
            category.categoryImage = categoryUpload.url;
        } catch (error) {
            throw new ApiError(500, "Failed To Upload Category Image.");
        }
    }
    await category.save();

    return res
        .status(200)
        .json(new ApiResponse(200, category, "Category Update Successfully"));
});

// Delete Category
const deleteCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;

    if (!categoryId || !isValidObjectId(categoryId)) {
        throw new ApiError(401, "Invalid Category ID");
    }

    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(401, "Category Not Found");
    }
    const categoryImage = category?.categoryImage;
    const deleteCate = await Category.deleteOne({ _id: categoryId });
    if (deleteCate.deletedCount === 0) {
        throw new ApiError(
            401,
            "Something Went Wrong While Deleting The Category"
        );
    }
    if (deleteCate && categoryImage) {
        const parts = categoryImage.split("/");
        const lastPart = parts.pop();
        const [publicId] = lastPart.split(".");
        try {
            removeImage("sameerCart/category/", publicId);
        } catch (error) {
            throw new ApiError(500, "Failed To Remove Previous Category Image");
        }
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Category Delete Successfully"));
});

export { addCategory, categories, deleteCategory, updateCategory };
