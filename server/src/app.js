import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminAuthRouter from "./routes/admin/adminAuth.routes.js";
import categoryRouter from "./routes/admin/category.routes.js";
import subCategoryRouter from "./routes/admin/subCategory.routes.js";
import productRouter from "./routes/admin/product.routes.js";
import variantRouter from "./routes/admin/variant.routes.js";
import publicCategoryRouter from "./routes/category.routes.js";
import publicSubCategoryRouter from "./routes/subcategory.routes.js";
import publicProductRouter from "./routes/product.routes.js";
import publicUserRouter from "./routes/user.routes.js";
import publicDashboardRouter from "./routes/dashboard.routes.js";
import "./config/passportStrategy.js";

const app = express();

// Middleware
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Admin Routes
app.use("/api/v1/admin/auth", adminAuthRouter);
app.use("/api/v1/admin/category", categoryRouter);
app.use("/api/v1/admin/sub-category", subCategoryRouter);
app.use("/api/v1/admin/product", productRouter);
app.use("/api/v1/admin/variant", variantRouter);

// Public Routes
app.use("/api/v1/category", publicCategoryRouter);
app.use("/api/v1/sub-category", publicSubCategoryRouter);
app.use("/api/v1/products", publicProductRouter);
app.use("/api/v1/users", publicUserRouter);
app.use("/api/v1/users/dashboard", publicDashboardRouter);

export { app };
