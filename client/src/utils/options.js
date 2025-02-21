export const productTypeOptions = [
    { _id: "simple", label: "Simple" },
    { _id: "variable", label: "Variable" },
];

export const orderViewActionOptions = [
    { _id: "Shipped", label: "Shipped" },
    { _id: "CanceledByAdmin", label: "Canceled By Admin" },
];

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
