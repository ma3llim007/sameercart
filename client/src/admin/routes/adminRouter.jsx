import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { AdminNotFound, AdminProfile, Dashboard, Login } from "../pages";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

const adminRouters = createBrowserRouter([
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
        ],
    },
    {
        path: "admin/auth",
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <Login />,
            },
            {
                path: 'login',
                element: <Login />,
            },
        ],
    },
    {
        path: "*",
        element: <AdminNotFound />,
    },
]);

export default adminRouters;
