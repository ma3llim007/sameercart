import { isValidObjectId } from "mongoose";
import { Brand } from "../models/brand.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { extractPublicId, removeImage, uploadCloudinary } from "../utils/cloudinary.js";
import { ConvertImageWebp } from "../utils/ConvertImageWebp.js";

// Add Brand
const addBrand = asyncHandler(async (req, res) => {
    const { brandName, brandDescription } = req.body;
    const brandLogo = req.file?.path;

    if (!brandName?.trim() || !brandDescription?.trim()) {
        return res.status(422).json(new ApiError(422, "All Field Are Required"));
    }
    if (!brandLogo) {
        return res.status(422).json(new ApiError(422, "Brand Logo Is Required"));
    }

    const brandExisted = await Brand.findOne({ brandName });

    if (brandExisted) {
        return res.status(409).json(new ApiError(409, "Brand Is Already Exists"));
    }

    // Convert Image To WebP
    let convertedImagePath = brandLogo;
    if (req.file?.minetype !== "image/webp") {
        try {
            convertedImagePath = await ConvertImageWebp(brandLogo);
        } catch (error) {
            return res.status(500).json(new ApiError(500, "Failed to Convert Image to WebP"));
        }
    }

    // Upload to cloudinary
    let brandUpload = null;
    try {
        brandUpload = await uploadCloudinary(convertedImagePath, "sameerCart/brands");
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Failed To Upload Brand Image."));
    }

    const brand = await Brand.create({
        brandName,
        brandDescription,
        brandLogo: brandUpload?.secure_url,
        addedBy: req.admin._id,
    });

    return res.status(201).json(new ApiResponse(201, brand, "Brand Created Successfully"));
});

// Brands List
const getBrands = asyncHandler(async (req, res) => {
    const brands = await Brand.find();
    return res.status(200).json(new ApiResponse(200, brands, "Brands Fetch Successfully"));
});

// Get Brand By Id
const getBrandsById = asyncHandler(async (req, res) => {
    const { brandId } = req.params;

    if (!brandId || brandId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Brand ID Is Required"));
    }

    if (!isValidObjectId(brandId)) {
        return res.status(400).json(new ApiError(400, "Invalid Brand ID"));
    }

    const brand = await Brand.findById(brandId);
    if (!brand) {
        return res.status(404).json(new ApiError(401, "Brand Not Found"));
    }

    return res.status(200).json(new ApiResponse(200, brand, "Brand Fetch Successfully"));
});

// Update Brand
const updateBrand = asyncHandler(async (req, res) => {
    const { brandName, brandDescription, brandId } = req.body;
    const brandLogo = req.file?.path;

    if (!brandId || brandId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Brand ID Is Required"));
    }

    if (!isValidObjectId(brandId)) {
        return res.status(400).json(new ApiError(400, "Invalid Brand ID"));
    }

    const brand = await Brand.findById(brandId);
    if (!brand) {
        return res.status(404).json(new ApiError(401, "Brand Not Found"));
    }

    // Check if at least one field is provided for update
    if (!brandName && !brandDescription && !brandLogo) {
        return res
            .status(400)
            .json(new ApiError(400, "At least one field (Name, Description, or Image) is required for update"));
    }

    const duplicateBrands = await Brand.findOne({
        _id: { $ne: brandId },
        $or: [{ brandName: brandName ? brandName : brand.brandName }],
    });

    // Check if there's a conflict with name
    if (duplicateBrands) {
        if (duplicateBrands.brandName === brandName) {
            return res.status(409).json(new ApiError(409, "Brand Name Already Exists"));
        }
    }
    // Update fields if there are no conflicts
    if (brandName) brand.brandName = brandName;

    if (brandDescription) brand.brandDescription = brandDescription;

    // Handle category image upload and Remove the previous image
    if (brandLogo) {
        const previousBrandImage = brand.brandLogo;
        if (brandLogo && previousBrandImage) {
            const publicId = extractPublicId(previousBrandImage);
            try {
                removeImage("sameerCart/brands/", publicId);
            } catch (error) {
                return res.status(500).json(new ApiError(500, "Failed To Remove Previous Brand Image"));
            }
        }

        // Convert Image To WebP
        let convertedImagePath = brandLogo;
        if (req.file?.minetype !== "image/webp") {
            try {
                convertedImagePath = await ConvertImageWebp(brandLogo);
            } catch (error) {
                return res.status(500).json(new ApiError(500, "Failed to Convert Image to WebP"));
            }
        }
        // Upload to Cloudinary
        try {
            const brandLogoUpload = await uploadCloudinary(convertedImagePath, "sameerCart/brands");
            brand.brandLogo = brandLogoUpload.secure_url;
        } catch (error) {
            return res.status(500).json(new ApiError(500, "Failed To Upload Brand Image."));
        }
    }
    await brand.save();

    return res.status(200).json(new ApiResponse(200, brand, "Brand Update Successfully"));
});

// Delete Brand
const deleteBrand = asyncHandler(async (req, res) => {
    const { brandId } = req.params;

    if (!brandId || brandId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Brand ID Is Required"));
    }

    if (!isValidObjectId(brandId)) {
        return res.status(400).json(new ApiError(400, "Invalid Brand ID"));
    }

    const brand = await Brand.findById(brandId);
    if (!brand) {
        return res.status(404).json(new ApiError(401, "Brand Not Found"));
    }

    const brandLogoImage = brand?.brandLogo;
    const deleteBrand = await Brand.deleteOne({ _id: brandId });

    if (deleteBrand && brandLogoImage) {
        const publicId = extractPublicId(brandLogoImage);
        try {
            await removeImage("sameerCart/brands/", publicId);
        } catch (error) {
            return res.status(500).json(new ApiError(500, "Failed To Remove Previous Brand Image"));
        }
    }

    if (deleteBrand.deletedCount === 0) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong While Deleting The Brand"));
    }

    return res.status(200).json(new ApiResponse(200, {}, "Brand Delete Successfully"));
});

// Toggle Brand
const toggleBrand = asyncHandler(async (req, res) => {
    const { brandId } = req.params;
    const { isActive } = req.body;

    if (!brandId || brandId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Brand ID Is Required"));
    }

    if (!isValidObjectId(brandId)) {
        return res.status(400).json(new ApiError(400, "Invalid Brand ID"));
    }

    const brand = await Brand.findById({ _id: brandId });
    if (!brand) {
        return res.status(404).json(new ApiError(404, "Brand Not Found"));
    }
    brand.isActive = isActive;
    await brand.save();
    return res.status(200).json(new ApiResponse(200, brand, "Brand Status Updated Successfully"));
});

// options Brand with only name and _id
const getBrandsOptions = asyncHandler(async (req, res) => {
    const brands = await Brand.aggregate([
        { $match: { isActive: true } },
        {
            $project: {
                brandLogo: 1,
                _id: 1,
            },
        },
    ]);
    return res.status(200).json(new ApiResponse(200, brands, "Brand Options Fetch Successfully"));
});

export { addBrand, getBrands, getBrandsById, deleteBrand, updateBrand, toggleBrand, getBrandsOptions };
