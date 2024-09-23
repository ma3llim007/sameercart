import React from "react";
import { RouterProvider } from "react-router-dom";
import adminRouters from "./routes/adminRouter";

const AdminApp = () => {
    return (
        <div>
            <RouterProvider router={adminRouters}/>
        </div>
    );
};

export default AdminApp;
