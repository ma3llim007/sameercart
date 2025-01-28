import * as Yup from "yup";

// Validation schema for the login form
export const adminLoginSchema = Yup.object().shape({
    email: Yup.string().required("Email Is Required").email("Enter a Valid Email"),
    password: Yup.string().required("Password Is Required").min(8, "Password Must Be At Least 8 Characters").max(16, "Password Should Be Must Under 16 Characters"),
});
