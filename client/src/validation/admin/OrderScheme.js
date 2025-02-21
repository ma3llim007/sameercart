import { getMaxDate, getMinDate } from "@/utils";
import * as yup from "yup";

export const newOrderScheme = yup.object().shape({
    orderStatus: yup.string().oneOf(["Shipped", "CanceledByAdmin"], "Invalid Order Status").required("Order Status is required"),
    orderShippingDate: yup
        .date()
        .transform((value, originalValue) => (originalValue === "" ? null : value))
        .nullable()
        .when("orderStatus", {
            is: "Shipped",
            then: schema =>
                schema
                    .typeError("Invalid Date")
                    .required("Shipping Date Is Required For Shipped Orders")
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
