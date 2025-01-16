import { v4 } from "uuid";
const cleanString = (str) => {
    return (
        str
            ?.toString()
            .replace(/[^a-z0-9]/gi, "")
            .toLowerCase() || ""
    );
};

export const generateSKU = (productName, brandName, attributes) => {
    const productCode = cleanString(productName).slice(0, 6) || "PRD";
    const brandCode = cleanString(brandName).slice(0, 6) || "BRD";
    const attributesCode = attributes.map((attribute) => `${attribute.value.toLowerCase().replace(/\s+/g, "-")}`).join("-") || "attb";
    const uniqueHash = v4().replace(/-/g, "").slice(0, 8) || "uque";
    return `${productCode}-${uniqueHash}-${brandCode}-${attributesCode.toString()}`;
};
