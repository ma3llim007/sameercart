import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { SubCategory } from "../models/subCategory.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";

const getProductByCategoryWithSubCategory = asyncHandler(async (req, res) => {
    const { categorySlug, subCategorySlug, page, limit } = req.query;
    if (!categorySlug?.trim() || !subCategorySlug?.trim()) {
        return res.status(422).json(new ApiError(422, "Category Slug And Sub-Category Slug Is Required"));
    }

    try {
        let pageNumber = parseInt(page);
        let limitNumber = parseInt(limit);

        if (isNaN(pageNumber) || pageNumber < 1) pageNumber = 1;
        if (isNaN(limitNumber) || limitNumber < 1) limitNumber = 9;

        // Calculate the number of documents to skip
        const skip = (pageNumber - 1) * limitNumber;

        // Finding the category and sub-category by slug
        const category = await Category.findOne({ categorySlug }).lean();
        const subCategory = await SubCategory.findOne({ subCategorySlug }).lean();

        if (!category) {
            return res.status(404).json(new ApiError(404, "Category not found"));
        }

        if (!subCategory) {
            return res.status(404).json(new ApiError(404, "Sub-category not found"));
        }

        // Get the total number of products in this category and sub-category
        const totalProducts = await Product.countDocuments({
            productCategoryId: category._id,
            productSubCategoryId: subCategory._id,
        });

        // Calculate Total Pages
        const totalPages = Math.ceil(totalProducts / limitNumber);

        // Adjust Page If It Exceeds Total Pages
        if (pageNumber > totalPages && totalPages > 0) {
            pageNumber = totalPages;
        }

        // Fetching the products for the given page, category and sub-category
        const products = await Product.find({ productCategoryId: category._id, productSubCategoryId: subCategory._id })
            .skip(skip)
            .limit(limitNumber)
            .sort({ createdAt: -1 })
            .select("productName productSlug productFeatureImage productShortDescription basePrice productDiscountPrice ratings productType");

        // If no product are found, handle the empty state
        if (!products.length) {
            return res.status(200).json(new ApiResponse(200, { products: [], pageNumber, totalPages }, "No Sub Category Found"));
        }

        // Return The Pagination Sub Category With Metadata
        return res.status(200).json(new ApiResponse(200, { products, pageNumber, totalPages }, "Sub Category Fetch Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

const getProductBySlug = asyncHandler(async (req, res) => {
    const { productSlug } = req.params;

    try {
        const product = await Product.aggregate([
            {
                $match: {
                    productSlug: productSlug,
                },
            },
            {
                $addFields: {
                    productVariants: {
                        $cond: {
                            if: {
                                $eq: ["$productType", "variable"],
                            },
                            then: "$productVariants",
                            else: [],
                        },
                    },
                },
            },
            {
                $lookup: {
                    from: "variants",
                    localField: "productVariants",
                    foreignField: "_id",
                    as: "variantDetails",
                },
            },
            {
                $project: {
                    productName: 1,
                    productSlug: 1,
                    productFeatureImage: 1,
                    productShortDescription: 1,
                    productDescription: 1,
                    productSpecification: 1,
                    productBrand: 1,
                    basePrice: 1,
                    productDiscountPrice: 1,
                    productType: 1,
                    productStock: 1,
                    ratings: 1,
                    variantDetails: {
                        $map: {
                            input: "$variantDetails",
                            as: "variants",
                            in: {
                                _id: "$$variants._id",
                                basePrice: "$$variants.basePrice",
                                discountPrice: "$$variants.discountPrice",
                                stockQuantity: "$$variants.stockQuantity",
                                images: "$$variants.images",
                                attributes: "$$variants.attributes",
                            },
                        },
                    },
                },
            },
        ]);

        if (!product.length) {
            return res.status(404).json(new ApiResponse(404, null, "Product Not Found"));
        }

        return res.status(200).json(new ApiResponse(200, product[0], "Product Fetch Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

const searchProducts = asyncHandler(async (req, res) => {
    try {
        const { term } = req.query;

        const products = await Product.find({
            productName: { $regex: term, $options: "i" },
        })
            .select("productName productSlug")
            .limit(6)
            .sort({ productName: 1 });

        if (!products.length) {
            return res.status(404).json(new ApiResponse(404, null, "No Matching Products Found"));
        }
        
        return res.status(200).json(new ApiResponse(200, products, "Products Fetched Successfully"));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Searching For  Products"));
    }
});

export { getProductByCategoryWithSubCategory, getProductBySlug, searchProducts };
