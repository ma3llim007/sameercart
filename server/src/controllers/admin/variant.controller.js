import mongoose, { isValidObjectId, ObjectId } from "mongoose";
import { Variant } from "../../models/variant.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { removeImageById, uploadCloudinary } from "../../utils/cloudinary.js";
import { ConvertImageWebp } from "../../utils/ConvertImageWebp.js";
import { Product } from "../../models/product.model.js";

// Add Variant
const addVariant = asyncHandler(async (req, res) => {
    const { productId, sku, priceAdjustment, stockQty, attributes } = req.body;
    const varinatImages = req.files;

    if (!productId?.trim() || !sku?.trim() || !priceAdjustment?.trim() || !stockQty?.trim() || !attributes) {
        return res.status(422).json(new ApiError(422, "All Field Are Required"));
    }

    if (!req.files || req.files.length === 0) {
        return res.status(400).json(new ApiError(400, "Please Upload At Least One Image"));
    }

    if (varinatImages.length > 5) {
        return res.status(400).json(new ApiError(400, "You Can Upload A Maximum Of 5 Image"));
    }

    // Check if variant with the same SKU already exists
    const existedVaraint = await Variant.findOne({ sku });
    if (existedVaraint) {
        return res.status(409).json(new ApiError(409, "Product Varaint Is Already Exists With SKU"));
    }

    // Parse `attributes` from JSON string and convert to a Map
    let attributesMap;
    try {
        const attributesObject = JSON.parse(attributes);
        attributesMap = new Map(Object.entries(attributesObject));
    } catch (_error) {
        return res.status(400).json(new ApiError(400, "Invalid Attributes Format."));
    }
    const imageUpload = [];
    for (const image of req.files) {
        let convertedImagePath = image?.path;
        if (image.mimetype !== "image/webp") {
            try {
                convertedImagePath = await ConvertImageWebp(image?.path);
            } catch (_error) {
                return res.status(500).json(new ApiError(500, "Failed to Convert Image to WebP"));
            }
        }

        // Convert Image To WebP
        let varinatUpload = null;
        try {
            varinatUpload = await uploadCloudinary(convertedImagePath, "sameerCart/varaints");
        } catch (_error) {
            return res.status(500).json(new ApiError(500, "Failed To Upload Varaint Image."));
        }

        // Update The Image Upload Object
        imageUpload.push({
            imageUrl: varinatUpload?.secure_url,
            publicId: varinatUpload?.public_id,
        });
    }

    const varainat = await Variant.create({
        productId,
        sku,
        priceAdjustment,
        stockQty,
        images: imageUpload,
        attributes: attributesMap,
        addedBy: req.admin._id,
    });

    // Update the product with the new variant
    try {
        await Product.findByIdAndUpdate(
            productId,
            {
                $push: { productVariants: varainat._id },
            },
            { new: true }
        );
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Failed To Update Product With New Variant"));
    }
    return res.status(201).json(new ApiResponse(201, varainat, "Varaint Created Successfully"));
});

// get variant by product Id
const getVariantByProductId = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    if (!productId || !productId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Product ID Is Required"));
    }

    if (!isValidObjectId(productId)) {
        return res.status(400).json(new ApiError(400, "Invalid Product ID"));
    }

    // variants by product ID
    try {
        const variants = await Variant.find({ productId: productId });
        return res.status(200).json(new ApiResponse(200, variants, "Variants Fetch Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

// get variant by variantId
const getVariantByVariantId = asyncHandler(async (req, res) => {
    const { variantId } = req.params;

    if (!variantId || !variantId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Varaint ID Is Required"));
    }

    if (!isValidObjectId(variantId)) {
        return res.status(400).json(new ApiError(400, "Invalid Product ID"));
    }

    // variant by variant ID
    try {
        const variant = await Variant.findById(variantId);
        return res.status(200).json(new ApiResponse(200, variant, "Variant Fetch Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

// Delete Variant
const deleteVariant = asyncHandler(async (req, res) => {
    const { variantId } = req.params;

    if (!variantId || variantId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Variant ID Is Required"));
    }

    if (!isValidObjectId(variantId)) {
        return res.status(400).json(new ApiResponse(400, "Invalid Variant ID"));
    }

    const variant = await Variant.findById(variantId);

    if (!variant) {
        return res.status(404).json(new ApiError(401, "Variant Not Found"));
    }

    const variatnImage = variant?.images;

    const variantDelete = await Variant.deleteOne({ _id: variantId });

    if (variantDelete.deletedCount === 0) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong While Deleting The Variant"));
    }

    // Remove Images Associated with the Variant
    if (variantDelete && variatnImage && variatnImage.length > 0) {
        try {
            await Promise.all(
                variatnImage.map(async (image) => {
                    await removeImageById(image?.publicId);
                })
            );
        } catch (_error) {
            return res.status(500).json(new ApiError(500, "Failed To Remove Previous Variant Images"));
        }
    }

    // Updating the product Variant
    const varinatRelatedProduct = await Product.findOne({
        productVariants: new mongoose.Types.ObjectId(variantId),
    });

    if (varinatRelatedProduct) {
        varinatRelatedProduct.productVariants = varinatRelatedProduct.productVariants.filter(
            (variant) => variant._id.toString() !== variantId.toString()
        );
        await varinatRelatedProduct.save();
    }
    return res.status(200).json(new ApiResponse(200, {}, "Variant Delete Successfully"));
});

// Update Variant
const updateVariant = asyncHandler(async (req, res) => {
    const { variantId, priceAdjustment, stockQty, attributes } = req.body;

    if (!variantId || !variantId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Variant ID Is Required"));
    }

    if (!isValidObjectId(variantId)) {
        return res.status(400).json(new ApiError(400, "Invalid Variant ID"));
    }

    const currVariant = await Variant.findById(variantId);

    if (!currVariant) {
        return res.status(404).json(new ApiResponse(404, "Variant Not Found"));
    }

    // Check if at least one field is provided for update
    if (!priceAdjustment && !stockQty && !attributes) {
        return res
            .status(400)
            .json(
                new ApiError(
                    400,
                    "At Least One Field (Price Adjustment, Stock Qty, Or Attributes) Is Required For Update"
                )
            );
    }

    // Update fields if there are no conflicts
    if (priceAdjustment) {
        currVariant.priceAdjustment = priceAdjustment;
    }
    if (stockQty) {
        currVariant.stockQty = stockQty;
    }

    // Parse `attributes` from JSON string and convert to a Map
    let attributesMap;
    try {
        const attributesObject = JSON.parse(attributes);
        attributesMap = new Map(Object.entries(attributesObject));
        currVariant.attributes = attributesMap;
    } catch (_error) {
        return res.status(400).json(new ApiError(400, "Invalid Attributes Format."));
    }
    await currVariant.save();

    return res.status(200).json(new ApiResponse(200, currVariant, "Variant Updated Successfully"));
});

// Delete Image From Images Object By VaraintId, publicId
const deleteVariantImageByIds = asyncHandler(async (req, res) => {
    const { variantId, publicId } = req.params;

    if (!variantId || variantId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Varaint ID Is Required"));
    }
    if (!isValidObjectId(variantId)) {
        return res.status(400).json(new ApiError(400, "Invalid Varaint ID"));
    }

    if (!publicId || publicId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Public ID Is Required"));
    }

    const varainat = await Variant.findById(variantId);
    if (!varainat) {
        return res.status(404).json(new ApiError(404, "Varaint Not Found"));
    }

    const varainatImage = varainat?.images;
    const imageObj = varainat?.images.filter((image) => image.publicId !== publicId);
    // Remove Images Associated with the Variant
    if (varainat && varainatImage && varainatImage.length > 0) {
        try {
            await removeImageById(publicId);
        } catch (_error) {
            return res.status(500).json(new ApiError(500, "Failed To Remove Previous Variant Images"));
        }
    }
    varainat.images = imageObj;
    await varainat.save();

    return res.status(200).json(new ApiResponse(200, {}, "Variant Image Delete Successfully"));
});

// Updating Image From Image Object By VaraintId, publicId
const editVariantImageById = asyncHandler(async (req, res) => {
    const { variantId, publicId } = req.params;
    const variantImage = req.file;

    if (!variantId || variantId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Varaint ID Is Required"));
    }
    if (!isValidObjectId(variantId)) {
        return res.status(400).json(new ApiError(400, "Invalid Varaint ID"));
    }
    if (!publicId || publicId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Public ID Is Required"));
    }
    if (!variantImage) {
        return res.status(422).json(new ApiError(422, "Varaint Image is Required"));
    }
    // Find the variant
    const variant = await Variant.findById(variantId);
    if (!variant) {
        return res.status(404).json(new ApiError(404, "Varaint Not Found"));
    }

    let tempImage = null;
    let updatedImages = Array.isArray(variant.images) ? [...variant.images] : [];

    // Remove the previous image
    updatedImages = updatedImages.filter((image) => {
        if (image?.publicId === publicId) {
            tempImage = image;
            return false;
        }
        return true;
    });

    // Remove The Previous Varaint Image
    if (tempImage) {
        try {
            await removeImageById(tempImage?.publicId);
        } catch (_error) {
            return res.status(500).json(new ApiError(500, "Failed To Remove Previous Varaint Image"));
        }
    }

    // Convert the uploaded image to WebP format if it's not already WebP
    let convertedImagePath = variantImage?.path;
    if (variantImage.mimetype !== "image/webp") {
        try {
            convertedImagePath = await ConvertImageWebp(variantImage?.path);
        } catch (_error) {
            return res.status(500).json(new ApiError(500, "Failed to Convert Image to WebP"));
        }
    }

    // Upload the new image to Cloudinary
    let varinatUpload = null;
    try {
        varinatUpload = await uploadCloudinary(convertedImagePath, "sameerCart/varaints");
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Failed To Upload Varaint Image."));
    }

    // Create a new image object for the updated image
    const newImage = {
        imageUrl: varinatUpload?.secure_url,
        publicId: varinatUpload?.public_id,
        _id: tempImage ? tempImage._id : new ObjectId(),
    };
    updatedImages.push(newImage);

    variant.images = updatedImages;
    await variant.save();

    return res.status(200).json(new ApiResponse(200, {}, "Varaint Image Update Successfully"));
});

export {
    addVariant,
    getVariantByProductId,
    getVariantByVariantId,
    deleteVariant,
    updateVariant,
    deleteVariantImageByIds,
    editVariantImageById,
};
