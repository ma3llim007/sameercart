import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import Loader from "./components/Loader/Loader";
import clientRouters from "@/routes/clientRouter";

const ClientApp = () => {
    return (
        <Suspense fallback={<Loader />}>
            <RouterProvider router={clientRouters} />
        </Suspense>
    );
};

export default ClientApp;
