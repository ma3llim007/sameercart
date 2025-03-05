import { Router } from "express";
import { authLimiter, publicLimiter } from "../middlewares/midlewares.js";
import adminAuthRouter from "./admin/adminAuth.routes.js";
import categoryRouter from "./admin/category.routes.js";
import subCategoryRouter from "./admin/subCategory.routes.js";
import productRouter from "./admin/product.routes.js";
import orderRouter from "./admin/order.routes.js";
import variantRouter from "./admin/variant.routes.js";
import usersRouter from "./admin/users.routes.js";
import blogRouter from "./admin/blog.routes.js";
import contactRouter from "./admin/contact.routes.js";
import dashboardRouter from "./admin/dashboard.routes.js";
import publicCategoryRouter from "./category.routes.js";
import publicSubCategoryRouter from "./subcategory.routes.js";
import publicProductRouter from "./product.routes.js";
import publicUserRouter from "./user.routes.js";
import publicDashboardRouter from "./dashboard.routes.js";
import publicOrderRouter from "./order.routes.js";
import publicContactRouter from "./contact.routes.js";
import publicBlogRouter from "./blog.routes.js";

// Admin Routes
const adminRoutes = Router();
adminRoutes.use("/auth", authLimiter, adminAuthRouter);
adminRoutes.use("/category", categoryRouter);
adminRoutes.use("/sub-category", subCategoryRouter);
adminRoutes.use("/product", productRouter);
adminRoutes.use("/variant", variantRouter);
adminRoutes.use("/order", orderRouter);
adminRoutes.use("/users", usersRouter);
adminRoutes.use("/blog", blogRouter);
adminRoutes.use("/contact", contactRouter);
adminRoutes.use("/dashboard", dashboardRouter);

// Public Routes
const publicRoutes = Router();
publicRoutes.use("/category", publicLimiter, publicCategoryRouter);
publicRoutes.use("/sub-category", publicLimiter, publicSubCategoryRouter);
publicRoutes.use("/products", publicLimiter, publicProductRouter);
publicRoutes.use("/users", publicLimiter, publicUserRouter);
publicRoutes.use("/users/dashboard", publicLimiter, publicDashboardRouter);
publicRoutes.use("/order", publicLimiter, publicOrderRouter);
publicRoutes.use("/contacts", publicLimiter, publicContactRouter);
publicRoutes.use("/blog", publicLimiter, publicBlogRouter);

export { adminRoutes, publicRoutes };
