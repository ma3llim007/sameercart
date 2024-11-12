import sharp from "sharp";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { resolvePath } from "../utils/pathHelper.js";
import fs from "fs/promises";
import path from "path";

export const convertIntoWebp = asyncHandler(async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json(new ApiError(400, "No File Uploaded"));
        }
        const tempDir = resolvePath();

        // Generate an output path with a new filename for the WebP file
        const outputFileName = `${path.parse(req.file.filename).name}.webp`;
        const outputFilePath = path.join(tempDir, outputFileName);

        // Convert to WebP format and save to the new path
        await sharp(req.file.path).webp({ lossless: true }).toFile(outputFilePath);

        // Delete the previous image
        try {
            await fs.access(req.file.path); 
            await fs.unlink(req.file.path);
        } catch (error) {
            console.error("Error during file deletion:", error);
        }

        // Update req.file to reference the new WebP file
        req.file.path = outputFilePath;
        req.file.filename = outputFileName;
        req.file.minetype = "image/webp";

        next();
    } catch (error) {
        return res.status(500).json(new ApiError(500, "Error Converting Image To WebP", error));
    }
});
