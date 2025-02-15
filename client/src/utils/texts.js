export const capitalizeWords = str => {
    return str
        .trim()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

export const slugToText = str => {
    return str
        .trim()
        .replace(/-+/g, " ")
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

export const formatNumberWithCommas = number => {
    return new Intl.NumberFormat().format(number);
};
