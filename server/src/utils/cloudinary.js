import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Uploading Image on Cloudinary
const uploadCloudinary = async (filePath, folderPath = "ecommerce") => {
    if (!filePath) return null;
    try {
        const response = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
            folder: folderPath,
        });
        fs.unlinkSync(filePath);
        return response;
    } catch (error) {
        fs.unlinkSync(filePath);
        return null;
    }
};

// Removing Image From Cloudinary
const removeImage = async (folderPath, fileUrl) => {
    try {
        if (!folderPath || !fileUrl) return null;
        const publicId = `${folderPath}${fileUrl}`;
        const response = await cloudinary.uploader.destroy(publicId);
        return response;
    } catch (e) {
        console.error("Error While Removing Image From Cloudinary", e);
        return null;
    }
};

export { uploadCloudinary, removeImage };
