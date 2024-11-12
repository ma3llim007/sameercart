import { fileURLToPath } from "url";
import { dirname, join } from "path";

export const getCurrentDir = () => {
    const __fileName = fileURLToPath(import.meta.url);
    return dirname(__fileName);
};

export const resolvePath = () => {
    const currentDir = getCurrentDir();
    const basePath = process.env.IMAGE_TEMP_PATH;
    return join(currentDir, "../../", basePath);
};
