import React from "react";
import { RouterProvider } from "react-router-dom";
import adminRouters from "./routes/adminRouter";
import { Provider } from "react-redux";
import adminStore from "./context/store";

const AdminApp = () => {
    return (
        <Provider store={adminStore}>
            <RouterProvider router={adminRouters} />
        </Provider>
    );
};

export default AdminApp;
