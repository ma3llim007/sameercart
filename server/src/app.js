import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminAuthRouter from "./routes/admin/adminAuth.routes.js";
import categoryRouter from "./routes/admin/category.routes.js";
import subCategoryRouter from "./routes/admin/subCategory.routes.js";
import productRouter from "./routes/admin/product.routes.js";
import orderRouter from "./routes/admin/order.routes.js";
import variantRouter from "./routes/admin/variant.routes.js";
import usersRouter from "./routes/admin/users.routes.js";
import blogRouter from "./routes/admin/blog.routes.js";
import contactRouter from "./routes/admin/contact.routes.js";
import dashboardRouter from "./routes/admin/dashboard.routes.js";
import publicCategoryRouter from "./routes/category.routes.js";
import publicSubCategoryRouter from "./routes/subcategory.routes.js";
import publicProductRouter from "./routes/product.routes.js";
import publicUserRouter from "./routes/user.routes.js";
import publicDashboardRouter from "./routes/dashboard.routes.js";
import publicOrderRouter from "./routes/order.routes.js";
import publicContactRouter from "./routes/contact.routes.js";
import publicBlogRouter from "./routes/blog.routes.js";
import "./config/passportStrategy.js";
import helmet from "helmet";
import { authLimiter, publicLimiter, speedLimiter } from "./middlewares/midlewares.js";
import compression from "compression";

const app = express();

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(helmet());
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

// Admin Routes
app.use("/api/v1/admin/auth", authLimiter, adminAuthRouter);
app.use("/api/v1/admin/category", publicLimiter, categoryRouter);
app.use("/api/v1/admin/sub-category", publicLimiter, subCategoryRouter);
app.use("/api/v1/admin/product", publicLimiter, productRouter);
app.use("/api/v1/admin/variant", publicLimiter, variantRouter);
app.use("/api/v1/admin/order", publicLimiter, orderRouter);
app.use("/api/v1/admin/users", publicLimiter, usersRouter);
app.use("/api/v1/admin/blog", publicLimiter, blogRouter);
app.use("/api/v1/admin/contact", publicLimiter, contactRouter);
app.use("/api/v1/admin/dashboard", publicLimiter, dashboardRouter);

// Public Routes
app.use("/api/v1/category", publicLimiter, publicCategoryRouter);
app.use("/api/v1/sub-category", publicLimiter, publicSubCategoryRouter);
app.use("/api/v1/products", publicLimiter, publicProductRouter);
app.use("/api/v1/users", publicLimiter, publicUserRouter);
app.use("/api/v1/users/dashboard", publicLimiter, publicDashboardRouter);
app.use("/api/v1/order", publicLimiter, publicOrderRouter);
app.use("/api/v1/contacts", publicLimiter, publicContactRouter);
app.use("/api/v1/blog", publicLimiter, publicBlogRouter);

export { app };
