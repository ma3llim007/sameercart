const slugTransform = value => {
    if (value && typeof value === "string") {
        return value
            .trim()
            .toLowerCase()
            .replace(/[^a-zA-Z\d\s]+/g, "")
            .replace(/\s/g, "-");
    }
    return "";
};

export default slugTransform;
