const validFileExtensions = ["image/jpg", "image/gif", "image/png", "image/jpeg", "image/svg", "image/webp"];

export const isValidFileType = file => {
    // Check if fileType exists in validFileExtensions
    if (!file || !file.type) {
        console.warn("File or file type is missing.");
        return false;
    }

    const isValid = validFileExtensions.includes(file.type);
    if (!isValid) {
        console.warn("File type does not match valid types.");
        return false;
    }

    return isValid;
};

export const isValidExtensions = file => {
    const isValid = validFileExtensions.includes(file.type);

    if (!isValid) {
        console.warn("File type does not match valid types.");
        return false;
    }

    return isValid;
};
