import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Product } from "../../models/product.model.js";
import { ConvertImageWebp } from "../../utils/ConvertImageWebp.js";
import { extractPublicId, removeImage, removeImageById, uploadCloudinary } from "../../utils/cloudinary.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { Variant } from "../../models/variant.model.js";

// Add Product
const addProduct = asyncHandler(async (req, res) => {
    const {
        productName,
        productSlug,
        productCategoryId,
        productSubCategoryId,
        productDescription,
        productSpecification,
        hasVariants,
        productPrice,
        productStock,
    } = req.body;
    const productFeatureImage = req.file?.path;

    if (
        !productName?.trim() ||
        !productSlug?.trim() ||
        !productCategoryId?.trim() ||
        !productSubCategoryId?.trim() ||
        !productDescription?.trim() ||
        !productSpecification?.trim() ||
        !hasVariants?.trim() ||
        !productPrice?.trim()
    ) {
        return res.status(422).json(new ApiError(422, "All Field Are Required"));
    }

    if (!isValidObjectId(productCategoryId)) {
        return res.status(400).json(new ApiError(400, "Invalid Category ID"));
    }

    if (!isValidObjectId(productSubCategoryId)) {
        return res.status(400).json(new ApiError(400, "Invalid Sub-Category ID"));
    }

    if (!productFeatureImage) {
        return res.status(422).json(new ApiError(422, "Product Image Is Required"));
    }

    const productExisted = await Product.findOne({ productSlug });
    if (productExisted) {
        return res.status(409).json(new ApiError(409, "Product Is Already Exists"));
    }

    // Convert Image To WebP
    let convertedImagePath = productFeatureImage;
    if (req.file?.minetype !== "image/webp") {
        try {
            convertedImagePath = await ConvertImageWebp(productFeatureImage);
        } catch (_error) {
            return res.status(500).json(new ApiError(500, "Failed to Convert Image to WebP"));
        }
    }

    // Upload To Cloudinary
    let productFeatureImageUpload = null;
    try {
        productFeatureImageUpload = await uploadCloudinary(convertedImagePath, "sameerCart/products");
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Failed To Upload Product Feature Image."));
    }

    const product = await Product.create({
        productName,
        productSlug,
        productFeatureImage: productFeatureImageUpload?.secure_url,
        productCategoryId,
        productPrice: Number(productPrice),
        productSubCategoryId,
        productDescription,
        hasVariants,
        productSpecification,
        productStock,
        addedBy: req.admin._id,
    });

    return res.status(201).json(new ApiResponse(201, product, "Product Created Successfully"));
});

// Product Listing
const productListing = asyncHandler(async (req, res) => {
    // Aggregate pipeline to get a category along with its subcategories
    try {
        const products = await Product.aggregate([
            {
                $lookup: {
                    from: "categories",
                    localField: "productCategoryId",
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
                $lookup: {
                    from: "subcategories",
                    localField: "productSubCategoryId",
                    foreignField: "_id",
                    as: "subcategories",
                },
            },
            {
                $unwind: {
                    path: "$subcategories",
                    preserveNullAndEmptyArrays: false,
                },
            },
            {
                $project: {
                    _id: 1,
                    productName: 1,
                    productSlug: 1,
                    productPrice: 1,
                    productFeatureImage: 1,
                    productCategory: {
                        categoryId: "$category._id",
                        categoryName: "$category.categoryName",
                    },
                    productSubCategory: {
                        subCategoryId: "$subcategories._id",
                        subCategoryName: "$subcategories.subCategoryName",
                    },
                    productDescription: 1,

                    hasVariants: 1,
                    productSpecification: 1,
                    productStock: 1,
                    isActive: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    addedBy: 1,
                },
            },
        ]);
        return res.status(200).json(new ApiResponse(200, products, "Products Fetch Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

// Get Product By Id
const ProductGetById = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!productId || !productId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Product ID Is Required"));
    }

    if (!isValidObjectId(productId)) {
        return res.status(400).json(new ApiError(400, "Invalid Product ID"));
    }

    try {
        const product = await Product.aggregate([
            [
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(productId),
                    },
                },
                {
                    $lookup: {
                        from: "categories",
                        localField: "productCategoryId",
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
                    $lookup: {
                        from: "subcategories",
                        localField: "productSubCategoryId",
                        foreignField: "_id",
                        as: "subcategories",
                    },
                },
                {
                    $unwind: {
                        path: "$subcategories",
                        preserveNullAndEmptyArrays: false,
                    },
                },
                {
                    $project: {
                        _id: 1,
                        productName: 1,
                        productSlug: 1,
                        productPrice: 1,
                        productFeatureImage: 1,
                        productCategory: {
                            categoryId: "$category._id",
                            categoryName: "$category.categoryName",
                        },
                        productSubCategory: {
                            subCategoryId: "$subcategories._id",
                            subCategoryName: "$subcategories.subCategoryName",
                        },
                        productDescription: 1,
                        hasVariants: 1,
                        productSpecification: 1,
                        isActive: 1,
                        productStock: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        addedBy: 1,
                    },
                },
            ],
        ]);

        if (!product[0]) {
            return res.status(404).json(new ApiResponse(404, null, "Product Not Found"));
        }

        return res.status(200).json(new ApiResponse(200, product[0], "Product Fetch Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

// Delete Product
const deleteProduct = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    if (!productId || productId.trim() === "") {
        return res.status(422).json(new ApiError(422, "Product ID Is Required"));
    }

    if (!isValidObjectId(productId)) {
        return res.status(400).json(new ApiError(400, "Invalid Product Id"));
    }

    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json(new ApiError(404, "Product Not Found"));
    }

    const productImage = product?.productFeatureImage;

    // Find and delete all variants associated with the product
    const varinatRelatedProduct = await Variant.find({ productId: productId });
    for (const varinat of varinatRelatedProduct) {
        const variantId = varinat._id.toString();
        const varinatImages = varinat.images;
        const deleteVariant = await Variant.deleteOne({ _id: variantId });

        if (deleteVariant && varinatImages && varinatImages.length > 0) {
            try {
                await Promise.all(
                    varinatImages.map(async (image) => {
                        await removeImageById(image?.publicId);
                    })
                );
            } catch (_error) {
                return res.status(500).json(new ApiError(500, "Failed To Remove Previous Variant Images"));
            }
        }
    }

    const deleteProduct = await Product.deleteOne({ _id: productId });

    if (deleteProduct && productImage) {
        const publicId = extractPublicId(productImage);
        try {
            await removeImage("sameerCart/products/", publicId);
        } catch (_error) {
            return res.status(500).json(new ApiError(500, "Failed To Remove Previous Product Image"));
        }
    }

    return res.status(200).json(new ApiResponse(200, {}, "Product Delete Successfully"));
});

// Update Product
const updateProduct = asyncHandler(async (req, res) => {
    const {
        productId,
        productName,
        productSlug,
        productCategoryId,
        productSubCategoryId,
        productDescription,
        productSpecification,
        productPrice,
    } = req.body;
    const productFeatureImage = req.file?.path;

    if (productCategoryId && !isValidObjectId(productCategoryId)) {
        return res.status(400).json(new ApiError(400, "Invalid Category ID"));
    }

    if (productSubCategoryId && !isValidObjectId(productSubCategoryId)) {
        return res.status(400).json(new ApiError(400, "Invalid Sub-Category ID"));
    }

    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
        return res.status(404).json(new ApiError(404, "Product Not Found"));
    }

    // check if there's a conflict with either name or slug
    const duplicateProduct = await Product.findOne({
        _id: { $ne: productId },
        $or: [
            { productName: productName ? productName : currentProduct.productName },
            { productSlug: productSlug ? productSlug : currentProduct.productSlug },
        ],
    });

    // check if there's a conflict with either name or slug
    if (duplicateProduct) {
        if (duplicateProduct.productName === productName) {
            return res.status(409).json(new ApiError(409, "Product Name Already Exists"));
        }
        if (duplicateProduct.productSlug === productSlug) {
            return res.status(409).json(new ApiError(409, "Product Slug Already Exists"));
        }
    }

    // update fields if there are no conflicts
    if (productName) {
        currentProduct.productName = productName;
    }
    if (productSlug) {
        currentProduct.productSlug = productSlug;
    }
    if (productPrice) {
        currentProduct.productPrice = productPrice;
    }
    if (productDescription) {
        currentProduct.productDescription = productDescription;
    }
    if (productCategoryId) {
        currentProduct.productCategoryId = productCategoryId;
    }
    if (productSubCategoryId) {
        currentProduct.productSubCategoryId = productSubCategoryId;
    }
    if (productSpecification) {
        currentProduct.productSpecification = productSpecification;
    }

    // handle product image uplaod and remove the previous image
    if (productFeatureImage) {
        const previousProductImage = currentProduct.productFeatureImage;
        if (productFeatureImage && previousProductImage) {
            const publicId = extractPublicId(previousProductImage);
            try {
                await removeImage("sameerCart/products/", publicId);
            } catch (_error) {
                return res.status(500).json(new ApiError(500, "Failed To Remove Previous Product Image"));
            }
        }

        // Convert Image To WebP
        let convertedImagePath = productFeatureImage;
        if (req.file?.minetype !== "image/webp") {
            try {
                convertedImagePath = await ConvertImageWebp(productFeatureImage);
            } catch (_error) {
                return res.status(500).json(new ApiError(500, "Failed to Convert Image to WebP"));
            }
        }

        // Upload The new Image
        try {
            const productFeatureImageUpload = await uploadCloudinary(convertedImagePath, "sameerCart/products");
            currentProduct.productFeatureImage = productFeatureImageUpload?.secure_url;
        } catch (_error) {
            return res.status(500).json(new ApiError(500, "Failed To Upload Product Image."));
        }
    }

    await currentProduct.save();

    return res.status(200).json(new ApiResponse(200, currentProduct, "Product Update Successfully"));
});

export { addProduct, productListing, ProductGetById, deleteProduct, updateProduct };
