export const productTypeOptions = [
    { _id: "simple", label: "Simple" },
    { _id: "variable", label: "Variable" },
];

export const orderViewActionOptions = [
    { _id: "Shipped", label: "Shipped" },
    { _id: "CanceledByAdmin", label: "Canceled By Admin" },
];

export const orderShippingActionOptions = [{ _id: "Delivery", label: "Delivery" }];
export const orderShippingActionPaymentOptions = [{ _id: "Failed", label: "Failed" }, { _id: "Completed", label: "Completed" },];

export const statusClass = {
    Order: "Secondary",
    Shipped: "Info",
    Delivery: "Success",
    CanceledByUser: "Danger",
    CanceledByAdmin: "Danger",
};

export const paymentStatusClass = {
    Pending: "Secondary",
    Completed: "Success",
    Failed: "Danger",
};
