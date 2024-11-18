import * as Yup from "yup";
import { isValidExtensions, isValidFileType } from "@/utils";

export const addSubCategoryScheme = Yup.object().shape({
    parentCategory: Yup.string().required("Category is required").notOneOf(["", "default"], "You Must Select A Valid Category"),
    subCategoryName: Yup.string().required("Sub-Category Name Is Required").min(5, "Sub-Category Atleast Have More Than 5 Characters"),
    subCategorySlug: Yup.string().required("Sub-Category Slug Is Required"),
    subCategoryImage: Yup.mixed()
        .required("Sub-Category Image Is Required")
        .test("fileType", "Unsupported file format", value => {
            return value && isValidFileType(value);
        }),
});

export const editSubCategoryScheme = Yup.object().shape({
    parentCategory: Yup.string().required("Category is required").notOneOf(["", "default"], "You Must Select A Valid Category"),
    subCategoryName: Yup.string().required("Sub-Category Name Is Required").min(5, "Sub-Category Atleast Have More Than 5 Characters"),
    subCategorySlug: Yup.string().required("Sub-Category Slug Is Required"),
    subCategoryImage: Yup.mixed().test("fileType", "Unsupported file format", value => {
        return !value || isValidExtensions(value);
    }),
});
