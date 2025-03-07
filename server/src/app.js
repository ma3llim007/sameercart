import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./config/passportStrategy.js";
import helmet from "helmet";
import { speedLimiter } from "./middlewares/midlewares.js";
import compression from "compression";
import { adminRoutes, publicRoutes } from "./routes/index.routes.js";

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
    })
);
app.use(speedLimiter);
app.use(
    compression({
        threshold: 1024,
        level: 6,
        filter: (req, res) => {
            if (req.headers["x-no-compression"]) {
                return false;
            }
            return compression.filter(req, res);
        },
    })
);
app.set("trust proxy", 1);

// Routes
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/", publicRoutes);

export { app };
