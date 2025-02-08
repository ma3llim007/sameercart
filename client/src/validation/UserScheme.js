import * as Yup from "yup";

export const registerUser = Yup.object().shape({
    firstName: Yup.string().required("First Name Is Required").min(3, "First Name Must Be At Least 3 Characters Long"),
    lastName: Yup.string().required("Last Name Is Required").min(3, "Last Name Must Be At Least 3 Characters Long"),
    email: Yup.string().required("Email Is Required").email("Please Enter A Valid Email Address"),
    password: Yup.string()
        .required("Password Is Required")
        .max(20, "Password Must Be Less Than 20 Characters Long")
        .matches(/[A-Z]/, "Password Must Contain At Least One Uppercase Letter")
        .matches(/[a-z]/, "Password Must Contain At Least One Lowercase Letter")
        .matches(/[0-9]/, "Password Must Contain At Least One Number")
        .matches(/[@$!%*?&]/, "Password Must Contain At Least One Special Character (@, $, !, %, *, ?, &)"),
});

export const loginUser = Yup.object().shape({
    email: Yup.string().required("Email Is Required").email("Please Enter A Valid Email Address"),
    password: Yup.string()
        .required("Password Is Required")
        .max(20, "Password Must Be Less Than 20 Characters Long")
        .matches(/[A-Z]/, "Password Must Contain At Least One Uppercase Letter")
        .matches(/[a-z]/, "Password Must Contain At Least One Lowercase Letter")
        .matches(/[0-9]/, "Password Must Contain At Least One Number")
        .matches(/[@$!%*?&]/, "Password Must Contain At Least One Special Character (@, $, !, %, *, ?, &)"),
});

export const resetPassword = Yup.object().shape({
    email: Yup.string().required("Email Is Required").email("Please Enter A Valid Email Address"),
});

export const emailVerify = Yup.object().shape({
    email: Yup.string().required("Email Is Required").email("Please Enter A Valid Email Address"),
    otp: Yup.string().required("OTP Is Required").length(6, "OTP Must Be Exactly 6 Digits"),
});

export const forgotPassword = Yup.object().shape({
    email: Yup.string().required("Email Is Required").email("Please Enter A Valid Email Address"),
});

export const resetPasswordConfrim = Yup.object().shape({
    new_password: Yup.string()
        .required("New Password Is Required")
        .max(20, "New Password Must Be Less Than 20 Characters Long")
        .matches(/[A-Z]/, "New Password Must Contain At Least One Uppercase Letter")
        .matches(/[a-z]/, "New Password Must Contain At Least One Lowercase Letter")
        .matches(/[0-9]/, "New Password Must Contain At Least One Number")
        .matches(/[@$!%*?&]/, "New Password Must Contain At Least One Special Character (@, $, !, %, *, ?, &)"),
    confirm_password: Yup.string()
        .required("Confirm Password Is Required")
        .oneOf([Yup.ref("new_password")], "Passwords Must Match"),
});

export const changePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string().required("Current Password is required").min(6, "Current Password must be at least 6 characters").max(20, "Current Password must be less than 20 characters"),

    newPassword: Yup.string()
        .required("New Password is required")
        .min(8, "New Password must be at least 8 characters")
        .max(20, "New Password must be less than 20 characters")
        .matches(/[A-Z]/, "New Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "New Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "New Password must contain at least one number")
        .matches(/[@$!%*?&]/, "New Password must contain at least one special character (@, $, !, %, *, ?, &)"),

    confirmPassword: Yup.string()
        .required("Confirm Password is required")
        .oneOf([Yup.ref("newPassword")], "Confirm Password must match New Password"),
});
