import * as Yup from "yup";

export const registerAdmin = Yup.object().shape({
    username: Yup.string()
        .required("Username is required")
        .min(3, "Username must be at least 3 characters long")
        .max(20, "Username must be at most 20 characters long")
        .matches(/^[a-zA-Z0-9]*$/, "Username can only contain letters and numbers"),
    email: Yup.string().required("Email is required").email("Must be a valid email"),
    fullname: Yup.string()
        .required("Full name is required")
        .min(2, "Full name must be at least 2 characters long")
        .max(50, "Full name must be at most 50 characters long")
        .matches(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
    phonenumber: Yup.string()
        .required("Phone number is required")
        .matches(/^\d{10}$/, "Phone number must be 10 digits long"),
    password: Yup.string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters long")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number")
        .matches(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
    confirmPassword: Yup.string()
        .required("Confirm password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
});
