import currentYear, { formatDateTime, getMaxDate, getMinDate } from "./currentYear";
import { isValidExtensions, isValidFileType } from "./files";
import slugTransform from "./slugTransform";
import { slugToText, capitalizeWords, formatNumberWithCommas } from "./texts";
import { orderViewActionOptions, paymentStatusClass, productTypeOptions, statusClass } from "./options";
import { calculateUserDetailsScore } from "./calculateUserDetailsScore";
import { loadScript } from "./loadScript";

export {
    currentYear,
    isValidFileType,
    slugTransform,
    isValidExtensions,
    formatDateTime,
    productTypeOptions,
    slugToText,
    capitalizeWords,
    formatNumberWithCommas,
    calculateUserDetailsScore,
    loadScript,
    orderViewActionOptions,
    getMaxDate,
    getMinDate,
    statusClass,
    paymentStatusClass
};
