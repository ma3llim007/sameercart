export const formatDateTime = inputDate => {
    const date = new Date(inputDate);
    return date.toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
};

const currentYear = () => {
    let date = new Date();
    return date.getFullYear();
};

export const getMinDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today;
};

export const getMaxDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 10);
    return today;
};
export default currentYear;
