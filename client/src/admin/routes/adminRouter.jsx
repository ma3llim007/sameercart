import { createBrowserRouter } from "react-router-dom";
import {
    AddCategory,
    AddSubCategory,
    AdminNotFound,
    AdminProfile,
    CategoryList,
    Dashboard,
    EditCategory,
    EditSubCategory,
    Login,
    SubCategoryList,
} from "../pages";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

const adminRouters = createBrowserRouter([
    {
        path: "admin/auth",
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <Login />,
            },
            {
                path: "login",
                element: <Login />,
            },
        ],
    },
    {
        path: "admin",
        element: <DashboardLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "dashboard",
                element: <Dashboard />,
            },
            {
                path: "profile",
                element: <AdminProfile />,
            },
            {
                path: "category",
                children: [
                    {
                        index: true,
                        element: <CategoryList />,
                    },
                    {
                        path: "add-category/",
                        element: <AddCategory />,
                    },
                    {
                        path: "category-list/",
                        element: <CategoryList />,
                    },
                    {
                        path: "edit-category/:categoryId",
                        element: <EditCategory />,
                    },
                ],
            },
            {
                path: "sub-category",
                children: [
                    {
                        index: true,
                        element: <SubCategoryList />,
                    },
                    {
                        path: "add-subcategory/",
                        element: <AddSubCategory />,
                    },
                    {
                        path: "subcategory-list/",
                        element: <SubCategoryList />,
                    },
                    {
                        path: "edit-category/:subCategoryId",
                        element: <EditSubCategory />,
                    },
                ],
            },
            {
                path: "*",
                element: <AdminNotFound />,
            },
        ],
    },
]);

export default adminRouters;
