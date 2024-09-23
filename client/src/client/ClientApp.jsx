import React from "react";
import { RouterProvider } from "react-router-dom";
import clientRouters from "./routes/clientRouter";
import { ThemeProvider } from "./context/themeProvider";

const ClientApp = () => {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RouterProvider router={clientRouters} />
        </ThemeProvider>
    );
};

export default ClientApp;
