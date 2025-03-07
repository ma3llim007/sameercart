import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";
import { ApiError } from "../utils/index.js";

// General limiter for public routes
const publicLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Minutes
    max: 100,
    handler: (_, res) => {
        return res.status(429).json(new ApiError(429, null, "Too Many Requests Form This IP, Please Try Again Later."));
    },
});

// Stricter limiter for authentication routes
const authLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 Minutes
    max: 30,
    handler: (_, res) => {
        return res.status(429).json(new ApiError(429, null, "Too Many Requests Form This Ip, Please Try Again Later."));
    },
});

const speedLimiter = slowDown({
    windowMsL: 15 * 60 * 1000,
    delayAfter: 50,
    delayMs: () => 500,
});

export { publicLimiter, authLimiter, speedLimiter };
