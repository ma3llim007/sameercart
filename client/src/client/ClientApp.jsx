import React, { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import clientRouters from "./routes/clientRouter";
import { ThemeProvider } from "./context/themeProvider";
import Loader from "./components/Loader/Loader";

const ClientApp = () => {
    return (
        // <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Suspense fallback={<Loader />}>
                <RouterProvider router={clientRouters} />
            </Suspense>
        // </ThemeProvider>
    );
};

export default ClientApp;
