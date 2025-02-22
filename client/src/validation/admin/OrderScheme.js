import { getMaxDate, getMinDate, getToday } from "@/utils";
import * as yup from "yup";

export const newOrderScheme = yup.object().shape({
    orderStatus: yup.string().oneOf(["Shipping", "CanceledByAdmin"], "Invalid Order Status").required("Order Status Is Required"),
    orderShippingDate: yup
        .date()
        .transform((value, originalValue) => (originalValue === "" ? null : value))
        .nullable()
        .when("orderStatus", {
            is: "Shipping",
            then: schema =>
                schema
                    .typeError("Invalid Date")
                    .required("Shipping Date Is Required For Shipping Orders")
                    .min(getMinDate(), "Date Must Be At Least 1 Day After Today")
                    .max(getMaxDate(), "Date Must Be Within 10 Days From Today"),
            otherwise: schema => schema.notRequired(),
        }),
    orderCancelReason: yup
        .string()
        .trim()
        .when("orderStatus", {
            is: "CanceledByAdmin",
            then: schema => schema.required("Cancellation Reason Is Required When Order Is Canceled").min(10, "Cancellation Reason Must Be At Least 10 Characters"),
            otherwise: schema => schema.notRequired(),
        }),
});

export const shippingOrderScheme = yup.object().shape({
    orderStatus: yup.string().oneOf(["Delivery"], "Invalid Order Status").required("Order Status Is Required"),
    completeOrderdate: yup
        .date()
        .typeError("Invalid Date Format")
        .nullable()
        .transform((value, originalValue) => (originalValue === "" ? null : value))
        .required("Delivery Date Is Required")
        .min(getToday(), "Delivery Date Cannot Be In The Past")
        .max(getMaxDate(3), "Delivery Date Must Be Within 3 Days From Today"),
    paymentStatus: yup.string().oneOf(["Completed"], "Invalid Payment Status").required("Payment Status Is Required"),
});
