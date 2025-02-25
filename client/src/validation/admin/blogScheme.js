import { isValidExtensions, isValidFileType } from "@/utils";
import * as Yup from "yup";

export const addBlogScheme = Yup.object().shape({
    blogTitle: Yup.string()
        .required("Blog Title Is Required")
        .min(3, "Blog Title Atleast Have More Than 3 Characters")
        .matches(/^[A-Za-z\s]+$/, "Blog Title Must Only Contain Letters"),
    blogSlug: Yup.string().required("Blog Slug Is Required"),
    blogFeatureImage: Yup.mixed()
        .required("Blog Feature Image Is Required")
        .test("fileType", "Unsupported file format", value => isValidFileType(value)),
    blogDetailImage: Yup.mixed()
        .required("Blog Detail Image Is Required")
        .test("fileType", "Unsupported file format", value => isValidFileType(value)),
    blogShortDescription: Yup.string().min(5, "Blog Short Description Atleast Have More Than 5 Characters").required("Blog Short Description is required"),
    blogDescription: Yup.string().min(5, "Blog Description Atleast Have More Than 3 Characters").required("Blog Description is required"),
});

export const editBlogScheme = Yup.object().shape({
    blogTitle: Yup.string()
        .required("Blog Title Is Required")
        .min(3, "Blog Title Atleast Have More Than 3 Characters")
        .matches(/^[A-Za-z\s]+$/, "Blog Title Must Only Contain Letters"),
    blogSlug: Yup.string().required("Blog Slug Is Required"),
    blogFeatureImage: Yup.mixed().test("fileType", "Unsupported file format", value => {
        return !value || isValidExtensions(value);
    }),
    blogDetailImage: Yup.mixed().test("fileType", "Unsupported file format", value => {
        return !value || isValidExtensions(value);
    }),
    blogShortDescription: Yup.string().min(5, "Blog Short Description Atleast Have More Than 5 Characters").required("Blog Short Description is required"),
    blogDescription: Yup.string().min(5, "Blog Description Atleast Have More Than 3 Characters").required("Blog Description is required"),
});
