export const productTypeOptions = [
    { _id: "simple", label: "Simple" },
    { _id: "variable", label: "Variable" },
];

export const orderViewActionOptions = [
    { _id: "Shipping", label: "Shipping" },
    { _id: "CanceledByAdmin", label: "Canceled By Admin" },
];

export const orderShippingActionOptions = [{ _id: "Delivery", label: "Delivery" }];
export const orderShippingActionPaymentOptions = [{ _id: "Completed", label: "Completed" },];

export const statusClass = {
    Order: "Secondary",
    Shipping: "Info",
    Delivery: "Success",
    CanceledByUser: "Danger",
    CanceledByAdmin: "Danger",
};

export const paymentStatusClass = {
    Pending: "Secondary",
    Completed: "Success",
    Failed: "Danger",
};
