const slugTransform = value => {
    if (value && typeof value === "string") {
        return value
            .trim()
            .toLowerCase()
            .replace(/[^\w\s-]/g, "") // Removes special characters except dashes
            .replace(/\s+/g, "-") // Replaces spaces with dashes
            .replace(/--+/g, "-") // Replaces multiple dashes with a single dash
            .replace(/^-+|-+$/g, ""); // Trims any leading or trailing dashes
    }
    return "";
};

export default slugTransform;
