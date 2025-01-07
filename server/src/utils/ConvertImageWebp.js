import { cwebp } from "webp-converter";
import fs from "fs";
import path from "path";

export const ConvertImageWebp = async (filePath, quality = 70) => {
    if (!filePath) {
        throw new Error("Image Parameter Are Required");
    }

    // Ensure the file exists
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    // Get the WebP file path (changing extension to .webp)
    const webpPath = path.join(path.dirname(filePath), `${path.basename(filePath, path.extname(filePath))}.webp`);

    try {
        // converting the image
        await cwebp(filePath, webpPath, `-q ${quality}`);

        // After conversion, remove the original file
        fs.unlinkSync(filePath);

        return webpPath;
    } catch (error) {
        throw new Error(`Image conversion failed: ${error.message}`);
    }
};
