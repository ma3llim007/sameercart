import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Loader from "@/client/components/Loader/Loader";

// Layouts
const AuthLayout = lazy(() => import("@/admin/layouts/AuthLayout"));
const DashboardLayout = lazy(() => import("@/admin/layouts/DashboardLayout"));

// Pages
const Login = lazy(() => import("@/admin/pages/Login"));
const Dashboard = lazy(() => import("@/admin/pages/Dashboard"));
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
const ViewProduct = lazy(() => import("@/admin/pages/ViewProduct"));
const AddVariants = lazy(() => import("@/admin/pages/AddVariants"));
const EditVariant = lazy(() => import("@/admin/pages/EditVariant"));
const NewOrder = lazy(() => import("@/admin/pages/NewOrder"));
const ViewNewOrder = lazy(() => import("@/admin/pages/ViewNewOrder"));
const ShippingOrder = lazy(() => import("@/admin/pages/ShippingOrder"));
const CanceledOrder = lazy(() => import("@/admin/pages/CanceledOrder"));
const DeliveryOrder = lazy(() => import("@/admin/pages/DeliveryOrder"));
const AllOrder = lazy(() => import("@/admin/pages/AllOrder"));
const ViewShippingOrder = lazy(() => import("@/admin/pages/ViewShippingOrder"));
const ViewCanceledOrder = lazy(() => import("@/admin/pages/ViewCanceledOrder"));
const ViewDeliveryOrder = lazy(() => import("@/admin/pages/ViewDeliveryOrder"));
const ViewAllOrder = lazy(() => import("@/admin/pages/ViewAllOrder"));
const UserListing = lazy(() => import("@/admin/pages/UserListing"));
const ViewUser = lazy(() => import("@/admin/pages/ViewUser"));

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
                path: "users",
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<Loader />}>
                                <UserListing />
                            </Suspense>
                        ),
                    },
                    {
                        path: "user-list/",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <UserListing />
                            </Suspense>
                        ),
                    },
                    {
                        path: "view-user/:userId",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <ViewUser />
                            </Suspense>
                        ),
                    },
                ],
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
                        path: "edit-product/:productId",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <EditProducts />
                            </Suspense>
                        ),
                    },
                    {
                        path: "view-product/:productId",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <ViewProduct />
                            </Suspense>
                        ),
                    },
                    {
                        path: "variants/:productId",
                        children: [
                            {
                                index: true,
                                element: (
                                    <Suspense fallback={<Loader />}>
                                        <AddVariants />
                                    </Suspense>
                                ),
                            },
                            {
                                path: "edit-variant/:variantId",
                                element: (
                                    <Suspense fallback={<Loader />}>
                                        <EditVariant />
                                    </Suspense>
                                ),
                            },
                        ],
                    },
                ],
            },
            {
                path: "orders",
                children: [
                    {
                        index: true,
                        element: (
                            <Suspense fallback={<Loader />}>
                                <NewOrder />
                            </Suspense>
                        ),
                    },
                    {
                        path: "new-order/",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <NewOrder />
                            </Suspense>
                        ),
                    },
                    {
                        path: "view-new-order/:orderId",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <ViewNewOrder />
                            </Suspense>
                        ),
                    },
                    {
                        path: "shipping-order/",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <ShippingOrder />
                            </Suspense>
                        ),
                    },
                    {
                        path: "view-shipping-order/:orderId",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <ViewShippingOrder />
                            </Suspense>
                        ),
                    },
                    {
                        path: "canceled-order/",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <CanceledOrder />
                            </Suspense>
                        ),
                    },
                    {
                        path: "view-canceled-order/:orderId",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <ViewCanceledOrder />
                            </Suspense>
                        ),
                    },
                    {
                        path: "delivery-order/",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <DeliveryOrder />
                            </Suspense>
                        ),
                    },
                    {
                        path: "view-delivery-order/:orderId",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <ViewDeliveryOrder />
                            </Suspense>
                        ),
                    },
                    {
                        path: "all-order/",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <AllOrder />
                            </Suspense>
                        ),
                    },
                    {
                        path: "view-all-order/:orderId",
                        element: (
                            <Suspense fallback={<Loader />}>
                                <ViewAllOrder />
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
