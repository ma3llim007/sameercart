import React, { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import clientRouters from "./routes/clientRouter";
import Loader from "./components/Loader/Loader";

const ClientApp = () => {
    return (
        <Suspense fallback={<Loader />}>
            <RouterProvider router={clientRouters} />
        </Suspense>
    );
};

export default ClientApp;
