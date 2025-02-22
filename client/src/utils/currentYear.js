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
    today.setHours(0, 0, 0, 0);
    return today;
};

export const getMaxDate = (dayAhead = 10) => {
    const today = new Date();
    today.setDate(today.getDate() + dayAhead);
    today.setHours(0, 0, 0, 0);
    return today;
};

export const getToday = () => {
    const today = new Date();
    today.setDate(today.getDate());
    today.setHours(0, 0, 0, 0);
    return today;
};

export default currentYear;
