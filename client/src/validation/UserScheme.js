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

export const profileInformation = Yup.object().shape({
    firstName: Yup.string().required("First Name Is Required").min(3, "First Name Must Be At Least 3 Characters Long"),
    lastName: Yup.string().required("Last Name Is Required").min(3, "Last Name Must Be At Least 3 Characters Long"),
    email: Yup.string().required("Email Is Required").email("Please Enter A Valid Email Address"),
    username: Yup.string().required("Username Is Required").min(3, "Username Must Be At Least 3 Characters Long").matches(/^\S*$/, "Username Cannot Contain Spaces"),
    phoneNumber: Yup.string()
        .required("Phone Number Is Required")
        .matches(/^[0-9]{10,15}$/, "Phone Number Must Be Between 10 and 15 digits"),
});

export const addressInformation = Yup.object().shape({
    street: Yup.string().required("Street Is Required").min(3, "Street Must Be At Least 3 Characters"),
    city: Yup.string().required("City Is Required").notOneOf(["", "default"], "You Must Select A Valid City"),
    state: Yup.string().required("State Is Required").notOneOf(["", "default"], "You Must Select A Valid State"),
    country: Yup.string().required("Country Is Required").notOneOf(["", "default"], "You Must Select A Valid Country"),
    zipCode: Yup.string()
        .required("Zip Code Is Required")
        .matches(/^\d{5}(-\d{4})?$/, "Invalid Zip Code Format"),
});
