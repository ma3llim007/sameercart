import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "@/client/components/Loader/Loader";

// Layouts
const AuthLayout = lazy(() => import("@/admin/layouts/AuthLayout"));
const DashboardLayout = lazy(() => import("@/admin/layouts/DashboardLayout"));

// Pages
const Login = lazy(() => import("@/admin/pages/Login"));
const Dashboard = lazy(() => import("@/admin/pages/Dashboard"));
const AdminProfile = lazy(() => import("@/admin/pages/AdminProfile"));
const CategoryList = lazy(() => import("@/admin/pages/CategoryList"));
const AddCategory = lazy(() => import("@/admin/pages/AddCategory"));
const EditCategory = lazy(() => import("@/admin/pages/EditCategory"));
const SubCategoryList = lazy(() => import("@/admin/pages/SubCategoryList"));
const AddSubCategory = lazy(() => import("@/admin/pages/AddSubCategory"));
const EditSubCategory = lazy(() => import("@/admin/pages/EditSubCategory"));
const AdminNotFound = lazy(() => import("@/admin/pages/AdminNotFound"));
const AddProducts = lazy(() => import("@/admin/pages/AddProducts"));
const EditProducts = lazy(() => import("@/admin/pages/EditProducts"));
const ProductsList = lazy(() => import("@/admin/pages/ProductsList"));
const AddBrands = lazy(() => import("@/admin/pages/AddBrand"));
const BrandList = lazy(() => import("@/admin/pages/BrandList"));
const EditBrand = lazy(() => import("@/admin/pages/EditBrand"));
const ViewBrand = lazy(() => import("@/admin/pages/ViewBrand"));

const adminRouters = createBrowserRouter([
    {
        path: "admin/auth",
        element: (
            <Suspense fallback={<Loader />}>
                <AuthLayout />
            </Suspense>
        ),
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<Loader />}>
                        <Login />
                    </Suspense>
                ),
            },
            {
                path: "login",
                element: (
                    <Suspense fallback={<Loader />}>
                        <Login />
                    </Suspense>
                ),
            },
        ],
    },
    {
        path: "admin",
        element: (
            <Suspense fallback={<Loader />}>
                <DashboardLayout />
            </Suspense>
        ),
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<Loader />}>
                        <Dashboard />
                    </Suspense>
                ),
            },
            {
                path: "dashboard",
                element: (
                    <Suspense fallback={<Loader />}>
                        <Dashboard />
                    </Suspense>
                ),
            },
            {
                path: "profile",
                element: (
                    <Suspense fallback={<Loader />}>
                        <AdminProfile />
                    </Suspense>
                ),
            },
            {
                path: "category",
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<Loader />}>
                                <CategoryList />
                            </Suspense>
                        ),
                    },
                    {
                        path: "add-category/",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <AddCategory />
                            </Suspense>
                        ),
                    },
                    {
                        path: "category-list/",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <CategoryList />
                            </Suspense>
                        ),
                    },
                    {
                        path: "edit-category/:categoryId",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <EditCategory />
                            </Suspense>
                        ),
                    },
                ],
            },
            {
                path: "sub-category",
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<Loader />}>
                                <SubCategoryList />
                            </Suspense>
                        ),
                    },
                    {
                        path: "add-subcategory/",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <AddSubCategory />
                            </Suspense>
                        ),
                    },
                    {
                        path: "subcategory-list/",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <SubCategoryList />
                            </Suspense>
                        ),
                    },
                    {
                        path: "edit-category/:subCategoryId",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <EditSubCategory />
                            </Suspense>
                        ),
                    },
                ],
            },
            {
                path: "products",
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<Loader />}>
                                <AddProducts />
                            </Suspense>
                        ),
                    },
                    {
                        path: "add-products/",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <AddProducts />
                            </Suspense>
                        ),
                    },
                    {
                        path: "products-list/",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <ProductsList />
                            </Suspense>
                        ),
                    },
                    {
                        path: "edit-products/:productId",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <EditProducts />
                            </Suspense>
                        ),
                    },
                ],
            },
            {
                path: "brands",
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<Loader />}>
                                <AddBrands />
                            </Suspense>
                        ),
                    },
                    {
                        path: "add-brands/",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <AddBrands />
                            </Suspense>
                        ),
                    },
                    {
                        path: "brands-list/",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <BrandList />
                            </Suspense>
                        ),
                    },
                    {
                        path: "edit-brand/:brandId",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <EditBrand />
                            </Suspense>
                        ),
                    },
                    {
                        path: "view-brand/:brandId",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <ViewBrand />
                            </Suspense>
                        ),
                    },
                ],
            },
            {
                path: "*",
                element: (
                    <Suspense fallback={<Loader />}>
                        <AdminNotFound />
                    </Suspense>
                ),
            },
        ],
    },
]);

export default adminRouters;
