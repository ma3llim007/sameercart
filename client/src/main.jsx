import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/css";
import AdminApp from "./admin/AdminApp";
import ClientApp from "./client/ClientApp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./client/context/themeProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const pathName = window.location.pathname;
const isAdmin = pathName.startsWith("/admin");
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <QueryClientProvider client={queryClient}>
                {isAdmin ? <AdminApp /> : <ClientApp />}
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
            <ToastContainer />
        </ThemeProvider>
    </StrictMode>
);
