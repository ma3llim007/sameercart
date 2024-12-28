export const generateSKU = (
    productName,
    categoryName,
    subCategoryName,
    brandName
) => {
    const productSlug = productName?.slice(0, 4).toUpperCase().trim() || "";
    const categorySlug = categoryName?.slice(0, 4).toUpperCase().trim() || "";
    const subCategorySlug = subCategoryName?.slice(0, 4).toUpperCase().trim() || "";
    const brandSlug = brandName?.slice(0, 4).toUpperCase().trim() || "";

    const uniqueIdentifier = Date.now();
    return `${brandSlug}-${categorySlug}-${subCategorySlug}-${productSlug}-${uniqueIdentifier}`;
};
