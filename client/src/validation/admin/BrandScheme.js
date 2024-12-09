import * as Yup from "yup";
import { isValidExtensions, isValidFileType } from "@/utils";

export const addBrandSchema = Yup.object().shape({
    brandName: Yup.string()
        .required("Brand Name Is Required")
        .min(2, "Brand Name Atleast Have More Than 2 Characters")
        .matches(/^[A-Za-z\s]+$/, "Brand Name Must Only Contain Letters"),
    brandLogo: Yup.mixed()
        .required("Brand Logo Image Is Required")
        .test("fileType", "Supported formats: jpeg, jpg, png, webp", value => {
            return value && isValidFileType(value);
        }),
    brandDescription: Yup.string().required("Brand Description Is Required").min(2, "Brand Description Atleast More Than 2 Characters"),
});

export const editBrandSchema = Yup.object().shape({
    brandName: Yup.string()
        .required("Brand Name Is Required")
        .min(2, "Brand Name Atleast Have More Than 2 Characters")
        .matches(/^[A-Za-z\s]+$/, "Brand Name Must Only Contain Letters"),
    brandLogo: Yup.mixed()
        .required("Brand Logo Image Is Required")
        .test("fileType", "Supported formats: jpeg, jpg, png, webp", value => {
            return !value || isValidExtensions(value);
        }),
    brandDescription: Yup.string().required("Brand Description Is Required").min(2, "Brand Description Atleast More Than 2 Characters"),
});
