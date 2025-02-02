import passport from "passport";
import { ApiError } from "../utils/index.js";

// Middleware to protect routes with passport-jwt strategy
const userVerify = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json(new ApiError(500, err.message || "Something Went Wrong During Authentication"));
        }

        if (!user) {
            return res.status(401).json(new ApiError(401, info ? info.message : "Unauthorized Access"));
        }

        req.user = user;
        next();
    })(req, res, next);
};

export default userVerify;
 