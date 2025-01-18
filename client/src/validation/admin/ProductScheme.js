/* eslint-disable no-unused-vars */
import { isValidExtensions, isValidFileType } from "@/utils";
import * as Yup from "yup";

export const addProductScheme = Yup.object().shape({
    productName: Yup.string()
        .required("Product Name Is Required")
        .min(2, "Product Name Atleast Have More Than 2 Characters"),
    productSlug: Yup.string().required("Product Slug Is Required"),
    basePrice: Yup.string()
        .test(
            "is-valid-price",
            "Product Price Is Required And Must Be A Positive Number",
            function (value) {
                const { productType } = this.parent;
                // Only validate productStock if productType is "simple"
                if (
                    productType === "simple" &&
                    (!value || Number(value) <= 0 || isNaN(Number(value)))
                ) {
                    return this.createError({
                        message: "Product Price Must Be A Positive Number.",
                    });
                }
                return true;
            }
        )
        .notRequired(),
    productDiscountPrice: Yup.string()
        .test(
            "is-valid-discount-price",
            "Product Discount Price Is Required And Must Be A Positive Number",
            function (value) {
                const { productType } = this.parent;
                // Only validate productStock if productType is "simple"
                if (productType === "simple") {
                    if (!value) {
                        return this.createError({
                            message: "Product Discount Price Is Required",
                        });
                    }

                    // Check if the value is a valid number and greater than 0
                    const numericValue = Number(value);
                    if (isNaN(numericValue) || numericValue <= 0) {
                        return this.createError({
                            message:
                                "Product Discount Price Must Be A Positive Number.",
                        });
                    }
                }
                return true;
            }
        )
        .notRequired(),
    productStock: Yup.string()
        .test(
            "is-valid-stock",
            "Product Stock Is Required And Must Be A Positive Number",
            function (value) {
                const { productType } = this.parent;
                // Only validate productStock if productType is "simple"
                if (productType === "simple") {
                    if (!value) {
                        return this.createError({
                            message: "Product Stock Is Required",
                        });
                    }

                    // Check if the value is a valid number and greater than 0
                    const numericValue = Number(value);
                    if (isNaN(numericValue) || numericValue <= 0) {
                        return this.createError({
                            message: "Product Stock Must Be A Positive Number.",
                        });
                    }
                }
                return true;
            }
        )
        .notRequired(),
    productCategoryId: Yup.string()
        .required("Product Category Is Required")
        .notOneOf(["", "default"], "You Must Select A Valid Category"),
    productSubCategoryId: Yup.string()
        .required("Product Sub Category Is Required")
        .notOneOf(["", "default"], "You Must Select A Valid Sub-Category"),
    productFeatureImage: Yup.mixed()
        .required("Product Feature Image Is Required")
        .test("fileType", "Unsupported File Format", value =>
            isValidFileType(value)
        ),
    productBrand: Yup.string()
        .required("Product Brand Is Required")
        .matches(/^[A-Za-z\s]+$/, "Product Brand Must Only Contain Letters"),
    productShortDescription: Yup.string()
        .required("Product Short Description Is Required")
        .max(120, "Maximum Length Is 120 Characters"),
    productType: Yup.string()
        .required("Product Type Is Required")
        .notOneOf(["", "default"], "You Must Select A Valid Product Type"),
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
        .min(2, "Product Name Atleast Have More Than 2 Characters"),
    productSlug: Yup.string().required("Product Slug Is Required"),
    basePrice: Yup.string()
        .test(
            "is-valid-price",
            "Product Price Is Required And Must Be A Positive Number",
            function (value) {
                const { productType } = this.parent;
                // Only validate productStock if productType is "simple"
                if (
                    productType === "simple" &&
                    (!value || Number(value) <= 0 || isNaN(Number(value)))
                ) {
                    return this.createError({
                        message: "Product Price Must Be A Positive Number.",
                    });
                }
                return true;
            }
        )
        .notRequired(),
    productDiscountPrice: Yup.string()
        .test(
            "is-valid-discount-price",
            "Product Discount Price Is Required And Must Be A Positive Number",
            function (value) {
                const { productType } = this.parent;
                // Only validate productStock if productType is "simple"
                if (productType === "simple") {
                    if (!value) {
                        return this.createError({
                            message: "Product Discount Price Is Required",
                        });
                    }

                    // Check if the value is a valid number and greater than 0
                    const numericValue = Number(value);
                    if (isNaN(numericValue) || numericValue <= 0) {
                        return this.createError({
                            message:
                                "Product Discount Price Must Be A Positive Number.",
                        });
                    }
                }
                return true;
            }
        )
        .notRequired(),
    productStock: Yup.string()
        .test(
            "is-valid-stock",
            "Product Stock Is Required And Must Be A Positive Number",
            function (value) {
                const { productType } = this.parent;
                // Only validate productStock if productType is "simple"
                if (productType === "simple") {
                    if (!value) {
                        return this.createError({
                            message: "Product Stock Is Required",
                        });
                    }

                    // Check if the value is a valid number and greater than 0
                    const numericValue = Number(value);
                    if (isNaN(numericValue) || numericValue <= 0) {
                        return this.createError({
                            message: "Product Stock Must Be A Positive Number.",
                        });
                    }
                }
                return true;
            }
        )
        .notRequired(),
    productCategoryId: Yup.string()
        .required("Product Category is required")
        .notOneOf(["", "default"], "You Must Select A Valid Category"),
    productSubCategoryId: Yup.string()
        .required("Product Sub-Category is required")
        .notOneOf(["", "default"], "You Must Select A Valid Sub-Category"),
    productFeatureImage: Yup.mixed().test(
        "fileType",
        "Unsupported file format",
        value => {
            return !value || isValidExtensions(value);
        }
    ),
    productBrand: Yup.string()
        .required("Product Brand Is Required")
        .matches(/^[A-Za-z\s]+$/, "Product Brand Must Only Contain Letters"),
    productShortDescription: Yup.string()
        .required("Product Short Description Is Required")
        .max(120, "Maximum Length Is 120 Characters"),
    productType: Yup.string()
        .required("Product Type Is Required")
        .notOneOf(["", "default"], "You Must Select A Valid Product Type"),
    productDescription: Yup.string()
        .required("Product Description Is Required")
        .min(5, "Product Description Atleast Have More Than 5 Characters"),
    productSpecification: Yup.string()
        .required("Product Specification Is Required")
        .min(5, "Product Specification Atleast Have More Than 5 Characters"),
});

export const addVariantScheme = Yup.object().shape({
    basePrice: Yup.string()
        .required("Base Price Is Required")
        .test(
            "is-positive",
            ({ value }) => `Base Price Must Be A Positive Number.`,
            value => value > 0
        ),
    discountPrice: Yup.string()
        .required("Discount Price Is Required")
        .test(
            "is-positive",
            ({ value }) => `Discount Price Must Be A Positive Number.`,
            value => value > 0
        ),
    stockQuantity: Yup.string()
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
            name: Yup.string().required("Key Name Is Required"),
            value: Yup.string().required("Value Is Required"),
        })
    ),
});

export const editVariantScheme = Yup.object().shape({
    basePrice: Yup.string()
        .required("Product Adjustment Is Required")
        .test(
            "is-positive",
            ({ value }) => `Product Adjustment Must Be A Positive Number.`,
            value => value > 0
        ),
    discountPrice: Yup.string()
        .required("Discount Price Is Required")
        .test(
            "is-positive",
            ({ value }) => `Discount Price Must Be A Positive Number.`,
            value => value > 0
        ),
    stockQuantity: Yup.string()
        .required("Stock Quantity Is Required")
        .test(
            "is-positive",
            ({ value }) => `Stock Quantity Must Be A Positive Number.`,
            value => value > 0
        ),
    attributes: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required("Key Name Is Required"),
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
