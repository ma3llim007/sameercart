import * as yup from "yup";

export const newOrderScheme = yup.object().shape({
    orderStatus: yup.string().oneOf(["Shipped", "CanceledByAdmin"], "Invalid Order Status").required("Order Status is required"),
    orderDate: yup
        .date()
        .typeError("Invalid Date")
        .required("Order Date Is Required")
        .min(new Date(Date.now() + 24 * 60 * 60 * 1000), "Date Must Be At Least 1 Day After Today")
        .max(new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), "Date Must Be Within 10 Days From Today"),
});
