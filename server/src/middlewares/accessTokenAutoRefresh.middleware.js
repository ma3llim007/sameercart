import { ApiError, generateAccessAndRefeshTokens, isTokenExpired } from "../utils/index.js";
import jwt from "jsonwebtoken";

const HttpOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
};

const accessTokenAutoRefresh = async (req, res, next) => {
    try {
        const currentAccessToken = req.cookies.accessToken;
        const currentRefreshToken = req.cookies.refreshToken;

        // If the access token is valid, pass the request forward
        if (currentAccessToken || !isTokenExpired(currentAccessToken)) {
            req.headers["authorization"] = `Bearer ${currentAccessToken}`;
            return next();
        } else {
            // If no refresh token, return 401
            if (!currentRefreshToken) {
                return res.status(401).json(new ApiError(401, "Refresh Token Missing. Please Log In Again."));
            }
            // Verify the refresh token
            const decodedToken = jwt.decode(currentRefreshToken);

            // Generate new access and refresh tokens
            const { accessToken, refreshToken } = await generateAccessAndRefeshTokens(decodedToken._id);

            // Set new tokens in cookies
            res.cookie("accessToken", accessToken, HttpOptions);
            res.cookie("refreshToken", refreshToken, HttpOptions);

            // Update the authorization header with the new access token
            req.headers["authorization"] = `Bearer ${accessToken}`;
            return next();
        }
    } catch (error) {
        const errorMessage = error.name === "TokenExpiredError" ? "Access Token Expired" : error?.message || "Invalid Access Token";
        res.status(401).json(new ApiError(401, errorMessage));
    }
};

export default accessTokenAutoRefresh;
