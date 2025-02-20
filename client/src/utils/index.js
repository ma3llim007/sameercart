import currentYear, { formatDateTime } from "./currentYear";
import { isValidExtensions, isValidFileType } from "./files";
import slugTransform from "./slugTransform";
import { slugToText, capitalizeWords, formatNumberWithCommas } from "./texts";
import { orderViewActionOptions, productTypeOptions } from "./options";
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
};
