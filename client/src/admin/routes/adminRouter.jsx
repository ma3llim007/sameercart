import { createBrowserRouter } from "react-router-dom";
import { AddCategory, AdminNotFound, AdminProfile, CategoryList, Dashboard, Login } from "../pages";
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
                        element: <AddCategory />,
                    },
                    {
                        path:"add-category/",
                        element: <AddCategory />,
                    },
                    {
                        path:"category-list/",
                        element: <CategoryList />,
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
