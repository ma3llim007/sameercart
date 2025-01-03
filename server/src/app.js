import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminAuthRouter from "./routes/adminAuth.routes.js";
import categoryRouter from "./routes/category.routes.js";
import subCategoryRouter from "./routes/subCategory.routes.js";
import brandRouter from "./routes/brand.routes.js";
import productRouter from "./routes/product.routes.js";
import variantRouter from "./routes/variant.routes.js";

const app = express();
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
app.use("/api/v1/admin/brand", brandRouter);
app.use("/api/v1/admin/product", productRouter);
app.use("/api/v1/admin/variant", variantRouter);

export { app };
