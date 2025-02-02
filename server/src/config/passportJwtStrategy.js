import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { User } from "../models/user.model.js";

const OPTIONS = {
    jwtFromRequest: (req) => {
        // First, try to get the JWT token from cookies
        const tokenFromCookies = req.cookies.accessToken;
        return tokenFromCookies || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    },
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

passport.use(
    new JWTStrategy(OPTIONS, async (jwt_payload, done) => {
        try {
            const user = await User.findById(jwt_payload._id).select("-password -refreshToken");
            
            if (!user) {
                return done(null, false, { message: "User Not Found" });
            }
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    })
);
