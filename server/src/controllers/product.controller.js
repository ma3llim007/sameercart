import mongoose, { isValidObjectId } from "mongoose";
import { Category } from "../models/category.model.js";
import { Product } from "../models/product.model.js";
import { SubCategory } from "../models/subCategory.model.js";
import { Order } from "../models/order.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { Review } from "../models/review.mode.js";

// Get Product With Category And Sub Category
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

// Get Product by Product Slug
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

// Searching of products
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

// new arrivals
const newArrivals = asyncHandler(async (req, res) => {
    try {
        const newArrivalsProducts = await Product.find().sort({ createdAt: -1 }).limit(9).select("productName productSlug productFeatureImage productShortDescription ratings");

        return res.status(200).json(new ApiResponse(200, newArrivalsProducts, "New Arrivals Product Fetched Successfully"));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Fetching Of New Arrivals Products"));
    }
});

// Get Products By Category
const getProductByCategory = asyncHandler(async (req, res) => {
    const { category } = req.query;

    if (!category?.trim()) {
        return res.status(422).json(new ApiError(422, "Category Id Is Required"));
    }
    if (!isValidObjectId(category)) {
        return res.status(404).json(new ApiError(404, "Invalid Category Id"));
    }
    try {
        const categoryProducts = await Product.find({
            productCategoryId: category,
        })
            .sort({ createdAt: -1 })
            .limit(9)
            .select("productName productSlug productFeatureImage productShortDescription ratings");

        return res.status(200).json(new ApiResponse(200, categoryProducts, "Product Fetched Successfully"));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Fetching Of Products With Category"));
    }
});

// Get Product By Product Id
const getProductById = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    if (!productId) {
        return res.status(422).json(new ApiError(422, "Product ID Is Required"));
    }
    if (!isValidObjectId(productId)) {
        return res.status(422).json(new ApiError(422, "Invalid Product ID"));
    }

    try {
        const product = await Product.findOne({ _id: productId }).select("productName productSlug productFeatureImage productShortDescription");

        if (!product) {
            return res.status(404).json(new ApiResponse(404, null, "Product Not Found"));
        }

        return res.status(200).json(new ApiResponse(200, product, "Product Fetch Successfully"));
    } catch (error) {
        return res.status(500).json(new ApiError(500, error.message));
    }
});

// Add Product Review
const addProductReview = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { productId, rating, title, comment } = req.body;

    if (!userId) {
        return res.status(422).json(new ApiError(422, "User Id Is Required"));
    }

    if (!productId || rating === null || !title || !comment) {
        return res.status(422).json(new ApiError(422, "All Fields Are Required"));
    }

    if (isNaN(rating)) {
        return res.status(422).json(new ApiError(422, "Rating Should Be In Number Format Only"));
    }

    if (rating <= 0 || rating > 5) {
        return res.status(403).json(new ApiError(403, "Rating Should Be Between 1 To 5 Only"));
    }
    if (!isValidObjectId(userId)) {
        return res.status(404).json(new ApiError(404, "Invalid User Id"));
    }

    if (!isValidObjectId(productId)) {
        return res.status(404).json(new ApiError(404, "Invalid Product Id"));
    }

    // Check if the user has purchased this product
    const orderDetails = await Order.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        { $lookup: { from: "orderitems", localField: "orderItems", foreignField: "_id", as: "orderItems" } },
        { $unwind: { path: "$orderItems", preserveNullAndEmptyArrays: true } },
        { $match: { "orderItems.productId": new mongoose.Types.ObjectId(productId) } },
        { $project: { orderStatus: 1 } },
    ]);

    if (!orderDetails.length) {
        return res.status(403).json(new ApiError(403, "You Must Purchase The Product Before Adding A Review"));
    }

    const order = orderDetails[0];
    if (order?.orderStatus !== "Delivery") {
        return res.status(404).json(new ApiError(404, "You Can Only Review Products After Delivery"));
    }

    // Check If User Already Review This Product
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
        return res.status(400).json(new ApiError(400, "You Have Already Reviewed This Product"));
    }

    // Add New Review
    const _review = await Review.create({ userId, productId, rating, title, comment });

    // Update Product Rating Statistics
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json(new ApiError(404, "Product Not Found"));
    }

    const totalReviews = product.ratings.numberOfReviews + 1;
    const totalRating = product.ratings.averageRating * product.ratings.numberOfReviews + rating;
    const newAverageRating = totalRating / totalReviews;

    product.ratings.numberOfReviews = totalReviews;
    product.ratings.averageRating = newAverageRating.toFixed(1);
    await product.save();

    return res.status(201).json(new ApiResponse(201, {}, "Review Added Successfully. Thank You"));
});

// Edit Product Review
const editProductReview = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { reviewId } = req.params;
    const { productId, rating, title, comment } = req.body;

    if (!userId) {
        return res.status(422).json(new ApiError(422, "User Id Is Required"));
    }

    if (!productId || rating === null || !title || !comment) {
        return res.status(422).json(new ApiError(422, "All Fields Are Required"));
    }

    if (isNaN(rating)) {
        return res.status(422).json(new ApiError(422, "Rating Should Be In Number Format Only"));
    }

    if (rating <= 0 || rating > 5) {
        return res.status(403).json(new ApiError(403, "Rating Should Be Between 1 To 5 Only"));
    }

    if (!reviewId) {
        return res.status(422).json(new ApiError(422, "Review Id Is Required"));
    }

    if (!isValidObjectId(userId)) {
        return res.status(404).json(new ApiError(404, "Invalid User Id"));
    }

    if (!isValidObjectId(productId)) {
        return res.status(404).json(new ApiError(404, "Invalid Product Id"));
    }

    if (!isValidObjectId(reviewId)) {
        return res.status(404).json(new ApiError(404, "Invalid Review Id"));
    }

    // Check if at least one field is provided for update
    if (!title && !comment && !rating) {
        return res.status(400).json(new ApiError(400, "At Least One Field (Rating, Title, Or Comment) Is Required For Update"));
    }

    const review = await Review.findOne({ _id: reviewId, userId, productId });
    if (!review) {
        return res.status(404).json(new ApiError(404, "Review Not Found"));
    }

    const oldRating = review?.rating;

    // Update Review Fields
    if (rating) {
        review.rating = rating;
    }
    if (title) {
        review.title = title;
    }
    if (comment) {
        review.comment = comment;
    }

    await review.save();

    // Update Product Rating Statistics
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json(new ApiError(404, "Product Not Found"));
    }

    const totalReviews = product.ratings.numberOfReviews;
    const totalRating = product.ratings.averageRating * product.ratings.numberOfReviews - oldRating + rating;
    product.ratings.averageRating = (totalRating / totalReviews).toFixed(1);
    await product.save();

    return res.status(200).json(new ApiResponse(200, {}, "Review Updated Successfully"));
});

// Fetching Product Review Based on The Product ID
const productReview = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    try {
        // const productReviews = await Review.find({ productId }).select("rating title comment");
        const productReviews = await Review.aggregate([
            {
                $match: { productId: new mongoose.Types.ObjectId(productId) },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    user: {
                        firstName: 1,
                        lastName: 1,
                    },
                    title: 1,
                    rating: 1,
                    comment: 1,
                },
            },
        ]);

        return res.status(200).json(new ApiResponse(200, productReviews, "Product Review Fetch Successfully"));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Fetching Product Review"));
    }
});
export { getProductByCategoryWithSubCategory, getProductBySlug, searchProducts, newArrivals, getProductByCategory, addProductReview, editProductReview, getProductById, productReview };
