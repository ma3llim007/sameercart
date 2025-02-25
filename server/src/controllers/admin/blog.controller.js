import { isValidObjectId } from "mongoose";
import { Blog } from "../../models/blog.model.js";
import { ApiError, ApiResponse, asyncHandler, ConvertImageWebp, extractPublicId, removeImage, uploadCloudinary } from "../../utils/index.js";

// Add Blog
const addBlog = asyncHandler(async (req, res) => {
    try {
        const { blogTitle, blogSlug, blogShortDescription, blogDescription } = req.body;
        const { blogFeatureImage, blogDetailImage } = req.files;

        if (!blogTitle.trim() || !blogSlug.trim() || !blogShortDescription.trim() || !blogDescription.trim()) {
            return res.status(422).json(new ApiError(422, "All Field Are Required"));
        }
        if (!blogFeatureImage) {
            return res.status(422).json(new ApiError(422, "Blog Feature Image Is Required"));
        }
        if (!blogDetailImage) {
            return res.status(422).json(new ApiError(422, "Blog Detail Image Is Required"));
        }

        const blogExisted = await Blog.findOne({ blogSlug });
        if (blogExisted) {
            return res.status(409).json(new ApiError(409, "Blog Is Already Exists"));
        }

        // Convert Image To WebP
        let convertedImagePathFeatured = blogFeatureImage[0];
        if (blogFeatureImage[0].mimetype !== "image/webp") {
            try {
                convertedImagePathFeatured = await ConvertImageWebp(blogFeatureImage[0].path);
            } catch (_error) {
                return res.status(500).json(new ApiError(500, "Failed To Convert Image To WebP Of Blog Feature Image"));
            }
        }
        let convertedImagePathDetail = blogDetailImage[0];
        if (blogDetailImage[0].mimetype !== "image/webp") {
            try {
                convertedImagePathDetail = await ConvertImageWebp(blogDetailImage[0].path);
            } catch (_error) {
                return res.status(500).json(new ApiError(500, "Failed To Convert Image To WebP Of Blog Detail Image"));
            }
        }

        // Upload On Cloudinary
        let blogFeatureImageUpload = null;
        try {
            blogFeatureImageUpload = await uploadCloudinary(convertedImagePathFeatured, "sameerCart/blogs/");
        } catch (_error) {
            return res.status(500).json(new ApiError(500, "Failed To Upload Blog Feature Image."));
        }

        let blogDetailImageUpload = null;
        try {
            blogDetailImageUpload = await uploadCloudinary(convertedImagePathDetail, "sameerCart/blogs/");
        } catch (_error) {
            return res.status(500).json(new ApiError(500, "Failed To Upload Blog Detail Image."));
        }

        const blog = await Blog.create({
            blogTitle,
            blogSlug,
            blogFeatureImage: blogFeatureImageUpload?.secure_url,
            blogDetailImage: blogDetailImageUpload?.secure_url,
            blogShortDescription,
            blogDescription,
        });
        return res.status(201).json(new ApiResponse(201, blog, "Blog Created Successfully"));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wront! While Adding Blog"));
    }
});

// Blog List
const blogs = asyncHandler(async (req, res) => {
    try {
        const blogs = await Blog.find();
        if (!blogs.length) {
            return res.status(200).json(new ApiResponse(200, {}, "No Blog Found"));
        }
        return res.status(200).json(new ApiResponse(200, blogs, "Blogs Fetch Successfully"));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Fetching Blog"));
    }
});

// Edit Blog
const editBlog = asyncHandler(async (req, res) => {
    const { blogId, blogTitle, blogSlug, blogShortDescription, blogDescription } = req.body;
    const { blogFeatureImage, blogDetailImage } = req.files;

    if (!blogId) {
        return res.status(422).json(new ApiError(422, "Blog ID is Required"));
    }

    if (!isValidObjectId(blogId)) {
        return res.status(404).json(new ApiError(404, "Invalid Blog Id"));
    }

    // Finding the Blog
    const blog = await Blog.findById(blogId);
    if (!blog) {
        return res.status(404).json(new ApiError(404, "Blog Not Found"));
    }

    // Check if at least one field is provided for update
    if (!blogTitle && !blogSlug && !blogShortDescription && !blogDescription && !blogFeatureImage && !blogDetailImage) {
        return res.status(400).json(new ApiError(400, "At Least One Field (Title, Slug, Short Description, Description ,Feature Image Or Detail Image) Is Required For Update"));
    }

    const duplicateBlog = await Blog.findOne({
        _id: { $ne: blogId },
        $or: [{ blogSlug: blogSlug ? blogSlug : blog.blogSlug }],
    });

    // Check if there's a conflict with either slug
    if (duplicateBlog) {
        if (duplicateBlog.blogSlug === blogSlug) {
            return res.status(409).json(new ApiError(409, "Blog Name Already Exists"));
        }
    }

    // Update fields if there are no conflicts
    if (blogTitle) {
        blog.blogTitle = blogTitle;
    }
    if (blogSlug) {
        blog.blogSlug = blogSlug;
    }
    if (blogShortDescription) {
        blog.blogShortDescription = blogShortDescription;
    }
    if (blogDescription) {
        blog.blogDescription = blogDescription;
    }
    if (blogFeatureImage) {
        const previousImages = blog.blogFeatureImage;
        if (blogFeatureImage && previousImages) {
            const publicId = extractPublicId(previousImages);
            try {
                await removeImage("sameerCart/blogs/", publicId);
            } catch (_error) {
                return res.status(500).json(new ApiError(500, "Failed To Remove Previous Blog Feature Image"));
            }
        }

        // Convert Image To WebP
        let convertedFeatureImage = blogFeatureImage;
        if (blogFeatureImage[0].mimetype !== "image/webp") {
            try {
                convertedFeatureImage = await ConvertImageWebp(blogFeatureImage[0].path);
            } catch (_error) {
                return res.status(500).json(new ApiError(500, "Failed to Convert Image to WebP"));
            }
        }

        // Upload to Cloudinary
        try {
            const featureImageUpload = await uploadCloudinary(convertedFeatureImage, "sameerCart/blogs/");
            blog.blogFeatureImage = featureImageUpload.secure_url;
        } catch (_error) {
            return res.status(500).json(new ApiError(500, "Failed To Upload Feature Image."));
        }
    }
    if (blogDetailImage) {
        const previousImages = blog.blogDetailImage;
        if (blogDetailImage && previousImages) {
            const publicId = extractPublicId(previousImages);
            try {
                await removeImage("sameerCart/blogs/", publicId);
            } catch (_error) {
                return res.status(500).json(new ApiError(500, "Failed To Remove Previous Detail Image"));
            }
        }

        // Convert Image To WebP
        let convertedDetailImage = blogDetailImage;
        if (blogDetailImage[0].mimetype !== "image/webp") {
            try {
                convertedDetailImage = await ConvertImageWebp(blogDetailImage[0].path);
            } catch (_error) {
                return res.status(500).json(new ApiError(500, "Failed to Convert Image to WebP"));
            }
        }

        // Upload to Cloudinary
        try {
            const detailImageUpload = await uploadCloudinary(convertedDetailImage, "sameerCart/blogs/");
            blog.blogDetailImage = detailImageUpload.secure_url;
        } catch (_error) {
            return res.status(500).json(new ApiError(500, "Failed To Upload Previous Detail Image."));
        }
    }
    await blog.save();

    return res.status(200).json(new ApiResponse(200, blog, "Blog Update Successfully"));
});

// Delete Blog
const deleteBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.params;

    if (!blogId) {
        return res.status(422).json(new ApiError(422, "Blog ID is Required"));
    }
    if (!isValidObjectId(blogId)) {
        return res.status(404).json(new ApiError(404, "Invalid Blog ID"));
    }

    // Finding the Blog
    const blog = await Blog.findById(blogId);
    if (!blog) {
        return res.status(404).json(new ApiError(404, "Blog Not Found"));
    }
    const featureImage = blog.blogFeatureImage;
    const detailImage = blog.blogDetailImage;

    const deleteBlog = await Blog.deleteOne({ _id: blogId });
    if (deleteBlog.deletedCount === 0) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong While Deleting The Blog"));
    }

    if (deleteBlog && featureImage && detailImage) {
        const publicFeatureId = extractPublicId(featureImage);
        try {
            await removeImage("sameerCart/blogs/", publicFeatureId);
        } catch (_error) {
            return res.status(500).json(new ApiError(500, "Failed To Remove Previous Blog Feature Image"));
        }
        const publicDetailId = extractPublicId(detailImage);
        try {
            await removeImage("sameerCart/blogs/", publicDetailId);
        } catch (_error) {
            return res.status(500).json(new ApiError(500, "Failed To Remove Previous Blog Detail Image"));
        }
    }

    return res.status(200).json(new ApiResponse(200, {}, "Blog Delete Successfully"));
});

// Get Blog By ID
const getBlog = asyncHandler(async (req, res) => {
    try {
        const { blogId } = req.params;

        if (!blogId) {
            return res.status(422).json(new ApiError(422, "Blog ID is Required"));
        }

        if (!isValidObjectId(blogId)) {
            return res.status(404).json(new ApiError(404, "Invalid Blog Id"));
        }

        // Finding the Blog
        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json(new ApiError(404, "Blog Not Found"));
        }

        return res.status(200).json(new ApiResponse(200, blog, "Blog Fetch Successfully"));
    } catch (_error) {
        return res.status(500).json(new ApiError(500, "Something Went Wrong! While Fetch Order Detail"));
    }
});

export { addBlog, blogs, deleteBlog, editBlog, getBlog };
