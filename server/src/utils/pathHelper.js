import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";

export const getCurrentDir = () => {
    const __fileName = fileURLToPath(import.meta.url);
    return dirname(__fileName);
};

export const resolvePath = () => {
    const currentDir = getCurrentDir();
    const basePath = process.env.IMAGE_TEMP_PATH;
    return join(currentDir, "../../", basePath);
};

export const imageUnLink = (filePath) => {
    if (!filePath) {
        console.warn("No file path provided for deletion.");
        return false;
    }
    try {
        // Ensure the file exists before attempting to delete
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        } else {
            console.warn(`File not found at path: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`Failed to delete file at ${filePath}. Error: ${error.message}`);
        return false;
    }
};
