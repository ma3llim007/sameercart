import { isValidExtensions, isValidFileType } from "@/utils";
import * as Yup from "yup";

export const addProductScheme = Yup.object().shape({
    productName: Yup.string()
        .required("Product Name Is Required")
        .min(2, "Product Name Atleast Have More Than 2 Characters")
        .matches(/^[A-Za-z\s]+$/, "Product Name Must Only Contain Letters"),
    productSlug: Yup.string().required("Product Slug Is Required"),
    productPrice: Yup.string()
        .required("Product Price Is Required")
        .test(
            "is-positive",
            ({ value }) => `Product Price Must Be A Positive Number.`,
            value => value > 0
        ),
    productBrand: Yup.string()
        .required("Product Brand Is Required")
        .notOneOf(["", "default"], "You Must Select A Valid Brand"),
    productCategoryId: Yup.string()
        .required("Category is required")
        .notOneOf(["", "default"], "You Must Select A Valid Category"),
    productSubCategoryId: Yup.string()
        .required("Sub-Category is required")
        .notOneOf(["", "default"], "You Must Select A Valid Sub-Category"),
    productFeatureImage: Yup.mixed()
        .required("Product Image Is Required")
        .test("fileType", "Unsupported file format", value =>
            isValidFileType(value)
        ),
    hasVariants: Yup.string()
        .required("Variant Is Required")
        .notOneOf(["", "default"], "You Must Select A Valid Variant"),
    productDescription: Yup.string()
        .required("Product Description Is Required")
        .min(5, "Product Description Atleast Have More Than 5 Characters"),
    productSpecification: Yup.string()
        .required("Product Specification Is Required")
        .min(5, "Product Specification Atleast Have More Than 5 Characters"),
});

export const editProductScheme = Yup.object().shape({
    productName: Yup.string()
        .required("Product Name Is Required")
        .min(2, "Product Name Atleast Have More Than 2 Characters")
        .matches(/^[A-Za-z\s]+$/, "Product Name Must Only Contain Letters"),
    productSlug: Yup.string().required("Product Slug Is Required"),
    productPrice: Yup.number()
        .required("Product Price Is Required")
        .test(
            "is-positive",
            ({ value }) => `Product Price Must Be A Positive Number.`,
            value => value > 0
        ),
    productBrand: Yup.string()
        .required("Product Brand Is Required")
        .notOneOf(["", "default"], "You Must Select A Valid Brand"),
    productCategoryId: Yup.string()
        .required("Category is required")
        .notOneOf(["", "default"], "You Must Select A Valid Category"),
    productSubCategoryId: Yup.string()
        .required("Sub-Category is required")
        .notOneOf(["", "default"], "You Must Select A Valid Sub-Category"),
    productFeatureImage: Yup.mixed().test(
        "fileType",
        "Unsupported file format",
        value => {
            return !value || isValidExtensions(value);
        }
    ),
    hasVariants: Yup.string()
        .required("Variant Is Required")
        .notOneOf(["", "default"], "You Must Select A Valid Variant"),
    productDescription: Yup.string()
        .required("Product Description Is Required")
        .min(5, "Product Description Atleast Have More Than 5 Characters"),
    productSpecification: Yup.string()
        .required("Product Specification Is Required")
        .min(5, "Product Specification Atleast Have More Than 5 Characters"),
});

export const addVariantScheme = Yup.object().shape({
    sku: Yup.string()
        .required("SKU Is Required")
        .trim()
        .max(50, "SKU cannot exceed 50 characters"),
    priceAdjustment: Yup.string()
        .required("Product Adjustment Is Required")
        .test(
            "is-positive",
            ({ value }) => `Product Adjustment Must Be A Positive Number.`,
            value => value > 0
        ),
    stockQty: Yup.string()
        .required("Stock Quantity Is Required")
        .test(
            "is-positive",
            ({ value }) => `Stock Quantity Must Be A Positive Number.`,
            value => value > 0
        ),
    images: Yup.array()
        .of(
            Yup.mixed()
                .required("Image File Is Required")
                .test("fileType", "Unsupported file format", value =>
                    isValidFileType(value)
                )
        )
        .max(5, "You Can Upload A Maximum Of 5 Files")
        .required("At Least One File Is Required")
        .min(1, "At Least One File Must Be Provided"),
    attributes: Yup.array().of(
        Yup.object().shape({
            key: Yup.string().required("Key Is Required"),
            value: Yup.string().required("Value Is Required"),
        })
    ),
});

export const editVariantScheme = Yup.object().shape({
    sku: Yup.string()
        .required("SKU Is Required")
        .trim()
        .max(50, "SKU cannot exceed 50 characters"),
    priceAdjustment: Yup.string()
        .required("Product Adjustment Is Required")
        .test(
            "is-positive",
            ({ value }) => `Product Adjustment Must Be A Positive Number.`,
            value => value > 0
        ),
    stockQty: Yup.string()
        .required("Stock Quantity Is Required")
        .test(
            "is-positive",
            ({ value }) => `Stock Quantity Must Be A Positive Number.`,
            value => value > 0
        ),
    attributes: Yup.array().of(
        Yup.object().shape({
            key: Yup.string().required("Key Is Required"),
            value: Yup.string().required("Value Is Required"),
        })
    ),
});

export const editVariantImage = Yup.object().shape({
    image: Yup.mixed()
        .required("Variant Image Is Required")
        .test("fileType", "Unsupported file format", value =>
            isValidFileType(value)
        ),
});
