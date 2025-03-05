import redisClient from "../config/redis.js";
import { Blog } from "../models/blog.model.js";
import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import { generateCacheKey } from "../utils/redis.utils.js";

// Get Blogs
const getBlogs = asyncHandler(async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 9;

        // Generate a Unique cache key based on page & limit
        const key = generateCacheKey(req);

        // Check if data exists in Redis cache
        const cacheData = await redisClient.get(key);
        if (cacheData) {
            return res.status(200).json(new ApiResponse(200, JSON.parse(cacheData), "Blogs Fetch Successfully"));
        }

        // Calculate the number of documents to skip
        const skip = (page - 1) * limit;

        // Get the total number of blog
        const totalBlogs = await Blog.countDocuments();

        // Calculate Total Pages
        const totalPages = Math.ceil(totalBlogs / limit);

        // Adjust Page If It Exceeds Total Pages
        if (page > totalPages && totalPages > 0) {
            page = totalPages;
        }

        // Fetch Pagination
        const blogs = await Blog.find().skip(skip).limit(limit).sort({ createdAt: -1 }).select("blogTitle blogSlug blogFeatureImage blogShortDescription createdAt");

        // If no blogs are found, handle the empty state
        if (!blogs.length) {
            return res.status(200).json(new ApiResponse(200, { blogs: [], page, totalPages }, "No Blogs Found"));
        }

        // Setting the data in cache
        await redisClient.setEx(key, 600, JSON.stringify({ blogs, page, totalPages }));
        
        return res.status(200).json(new ApiResponse(200, { blogs, page, totalPages }, "Blogs Fetch Successfully"));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Fetching Blogs"));
    }
});

// View Blog By Slug
const viewBlog = asyncHandler(async (req, res) => {
    const { blogSlug } = req.params;

    if (!blogSlug) {
        return res.status(422).json(new ApiError(422, "Blog Slug Is Required"));
    }

    try {
        const blogs = await Blog.findOne({ blogSlug }).select("-blogShortDescription -blogFeatureImage");

        return res.status(200).json(new ApiResponse(200, blogs, "Blog Fetch Successfully"));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Fetching Blog Details"));
    }
});

// Related Blogs
const relatedBlogs = asyncHandler(async (req, res) => {
    const { blogId } = req.params;

    if (!blogId) {
        return res.status(422).json(new ApiError(422, "Blog ID Is Required"));
    }

    try {
        const relatedBlogs = await Blog.aggregate([
            { $match: { _id: { $ne: blogId } } },
            { $sample: { size: 3 } },
            {
                $project: {
                    blogTitle: 1,
                    blogSlug: 1,
                    blogFeatureImage: 1,
                    blogShortDescription: 1,
                    createdAt: 1,
                },
            },
        ]);

        return res.status(200).json(new ApiResponse(200, relatedBlogs, "Related Blog Fetch Successfully"));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Fetching Related Blog"));
    }
});

export { getBlogs, viewBlog, relatedBlogs };
