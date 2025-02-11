import currentYear, { formatDateTime } from "./currentYear";
import { isValidExtensions, isValidFileType } from "./files";
import slugTransform from "./slugTransform";
import { slugToText, capitalizeWords, formatNumberWithCommas } from "./texts";
import { productTypeOptions } from "./options";
import { calculateUserDetailsScore } from "./calculateUserDetailsScore";

export { currentYear, isValidFileType, slugTransform, isValidExtensions, formatDateTime, productTypeOptions, slugToText, capitalizeWords, formatNumberWithCommas, calculateUserDetailsScore };
