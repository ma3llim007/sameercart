import { isValidExtensions, isValidFileType } from "@/utils";
import * as Yup from "yup";

export const addCategoryScheme = Yup.object().shape({
    categoryName: Yup.string()
        .required("Category Name Is Required")
        .min(5, "Category Atleast Have More Than 5 Characters")
        .matches(/^[A-Za-z\s]+$/, "Category Name Must Only Contain Letters"),
    categorySlug: Yup.string().required("Category Slug Is Required"),
    categoryImage: Yup.mixed()
        .required("Category Image Is Required")
        .test("fileType", "Unsupported file format", value => isValidFileType(value)),
});

export const editCategorySchema = Yup.object().shape({
    categoryName: Yup.string()
        .required("Category Name Is Required")
        .min(5, "Category Atleast Have More Than 5 Characters")
        .matches(/^[A-Za-z\s]+$/, "Category Name Must Only Contain Letters"),
    categorySlug: Yup.string().required("Category Slug Is Required"),
    categoryImage: Yup.mixed().test("fileType", "Unsupported file format", value => {
        return !value || isValidExtensions(value);
    }),
});
