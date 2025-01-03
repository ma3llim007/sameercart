export const generateSKU = (productName, categoryName, subCategoryName) => {
    const productSlug = productName?.slice(0, 4).trim() || "";
    const categorySlug = categoryName?.slice(0, 4).trim() || "";
    const subCategorySlug = subCategoryName?.slice(0, 4).trim() || "";

    const uniqueIdentifier = Date.now();
    return `${categorySlug}-${subCategorySlug}-${productSlug}-${uniqueIdentifier}`;
};
