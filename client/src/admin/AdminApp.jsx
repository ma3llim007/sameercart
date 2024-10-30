import React from "react";
import { RouterProvider } from "react-router-dom";
import adminRouters from "./routes/adminRouter";
import { Provider } from "react-redux";
import adminStore, { adminStorePeristor } from "./context/adminStore";
import { PersistGate } from "redux-persist/integration/react";

const AdminApp = () => {
    return (
        <Provider store={adminStore}>
            <PersistGate loading={null} persistor={adminStorePeristor}>
                <RouterProvider router={adminRouters} />
            </PersistGate>
        </Provider>
    );
};

export default AdminApp;
