import { v4 } from "uuid";
const cleanString = (str) => {
    return (
        str
            ?.toString()
            .trim()
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/--+/g, "-")
            .replace(/^-+|-+$/g, "") || ""
    );
};

export const generateSKU = (productName, brandName, attributes) => {
    const productCode = cleanString(productName).slice(0, 6) || "PRD";
    const brandCode = cleanString(brandName).slice(0, 6) || "BRD";
    const attributesCode =
        attributes
            .map(
                (attribute) =>
                    `${attribute.value
                        .toLowerCase()
                        .replace(/[^a-z0-9\s]/gi, "")
                        .trim()
                        .replace(/\s+/g, "-")}`
            )
            .join("-") || "attb";
    const uniqueHash = v4().replace(/-/g, "").slice(0, 8) || "uque";
    return `${productCode}-${uniqueHash}-${brandCode}-${attributesCode.toString()}`;
};
