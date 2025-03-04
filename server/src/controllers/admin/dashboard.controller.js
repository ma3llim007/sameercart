import { Order } from "../../models/order.model.js";
import { User } from "../../models/user.model.js";
import { Product } from "../../models/product.model.js";
import { Category } from "../../models/category.model.js";
import { SubCategory } from "../../models/subCategory.model.js";
import { Blog } from "../../models/blog.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../../utils/index.js";

const dashboardStats = asyncHandler(async (req, res) => {
    try {
        // Aggregation pipeline to fetch counts in a single query
        const [orderStats, totalUser, totalCategory, totalSubCategory, totalProducts, totalBlogs] = await Promise.all([
            Order.aggregate([
                {
                    $group: {
                        _id: "$orderStatus",
                        count: { $sum: 1 },
                    },
                },
            ]),
            User.countDocuments(),
            Category.countDocuments(),
            SubCategory.countDocuments(),
            Product.countDocuments(),
            Blog.find().countDocuments(),
        ]);

        // Convert order aggregation result to a lookup object
        const orderCountMap = orderStats.reduce((acc, { _id, count }) => {
            acc[_id] = count;
            return acc;
        }, {});

        // Extract order counts safely (default to 0 if not found)
        const totalNewOrders = orderCountMap["Order"] || 0;
        const totalShipping = orderCountMap["Shipping"] || 0;
        const totalCancelledOrders = (orderCountMap["CanceledByUser"] || 0) + (orderCountMap["CanceledByAdmin"] || 0);
        const totalDeliveryOrders = orderCountMap["Delivery"] || 0;
        const totalAllOrders = orderStats.reduce((sum, { count }) => sum + count, 0);

        // Monthly User Chart Data (Aggregation)
        const userChartData = await User.aggregate([
            {
                $group: {
                    _id: { $month: "$createdAt" }, // Group by month
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } }, // Sort by month
        ]);

        // Formatting userChartData for frontend
        const formattedUserChart = Array.from({ length: 12 }, (_, i) => ({
            month: i + 1,
            count: userChartData.find((data) => data._id === i + 1)?.count || 0,
        }));

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    totalUser,
                    totalCategory,
                    totalSubCategory,
                    totalProducts,
                    totalBlogs,
                    totalNewOrders,
                    totalShipping,
                    totalCancelledOrders,
                    totalDeliveryOrders,
                    totalAllOrders,
                    userChartData: formattedUserChart,
                },
                "Dashboard Statistics Fetched Successfully"
            )
        );
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Fetching The Dashboard Statistics"));
    }
});

const orderStats = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.aggregate([
            {
                $group: {
                    _id: "$orderStatus",
                    count: { $sum: 1 },
                },
            },
        ]);

        return res.status(201).json(new ApiResponse(201, orders, "Order Chart Detials Fetching Successfully"));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Fetching The Users Statistics"));
    }
});

// Get Products by Category Chart
const productByCategoryStats = asyncHandler(async (req, res) => {
    try {
        const categoryChartData = await Product.aggregate([
            {
                $group: {
                    _id: "$productCategoryId",
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "categories",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails",
                },
            },
            {
                $unwind: { path: "$categoryDetails", preserveNullAndEmptyArrays: true },
            },
            {
                $project: {
                    _id: 0,
                    category: { $ifNull: ["$categoryDetails.categoryName", "Unknown"] }, // Use categoryName or "Unknown"
                    count: 1,
                },
            },
        ]);

        return res.status(201).json(new ApiResponse(201, categoryChartData, "Products By Category Chart Detials Fetching Successfully"));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Fetching The Products Statistics"));
    }
});

export { dashboardStats, orderStats, productByCategoryStats };
