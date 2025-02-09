import passport from "passport";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { User } from "../models/user.model.js";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";

const OPTIONS = {
    jwtFromRequest: (req) => {
        // First, try to get the JWT token from cookies
        const tokenFromCookies = req.cookies.accessToken;
        return tokenFromCookies || ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    },
    secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

// Password Set
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

// Google Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({
                    $or: [{ googleId: profile.id }, { email: profile.emails?.[0].value }],
                });

                if (!user) {
                    const lastSixDigit = profile.id.slice(-6);
                    const lastTwoNameDigit = profile.name.givenName.slice(-2);
                    const newPassword = lastTwoNameDigit + lastSixDigit;

                    // Create new user
                    user = await User.create({
                        firstName: profile?.name?.givenName,
                        lastName: profile?.name?.familyName,
                        email: profile?.emails[0]?.value,
                        email_verify: true,
                        googleId: profile?.id,
                        authMethod: "google",
                        password: newPassword,
                    });
                }
                // Remove sensitive information before sending response
                const updateUserValues = user.toObject();
                delete updateUserValues.authMethod;
                delete updateUserValues.password;

                return done(null, updateUserValues);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);

// Github Strategy
passport.use(
    new GithubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.GITHUB_CALLBACK_URL,
            scope: ["user:email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({
                    $or: [{ googleId: profile.id }, { email: profile.emails?.[0].value }],
                });

                if (!user) {
                    const lastSixDigit = profile.id.slice(-6);
                    const lastTwoNameDigit = profile.displayName ? profile.displayName.slice(-2) : "00";
                    const newPassword = lastTwoNameDigit + lastSixDigit;

                    // Create new user
                    user = await User.create({
                        firstName: profile?.displayName?.split(" ")[0] || "GitHub",
                        lastName: profile?.displayName?.split(" ")[1] || "User",
                        email: profile?.emails[0]?.value || `github_user_${profile.id}@example.com`,
                        email_verify: true,
                        googleId: profile?.id,
                        authMethod: "github",
                        password: newPassword,
                    });
                }
                // Remove sensitive information before sending response
                const updateUserValues = user.toObject();
                delete updateUserValues.authMethod;
                delete updateUserValues.password;

                return done(null, updateUserValues);
            } catch (error) {
                return done(error, false);
            }
        }
    )
);
