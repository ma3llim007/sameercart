import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/styles.css";
import "swiper/css";
import AdminApp from "./admin/AdminApp";
import ClientApp from "./client/ClientApp";
import { QueryClientProvider } from "@tanstack/react-query";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./client/context/themeProvider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, storePersistor } from "./store";
import queryClient from "./api/queryClientConfig";
import ResponsiveViewer from "./components/ResponsiveViewer";

const pathName = window.location.pathname;
const isAdmin = pathName.startsWith("/admin");

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <Provider store={store}>
                <PersistGate loading={null} persistor={storePersistor}>
                    <QueryClientProvider client={queryClient}>
                        {isAdmin ? <AdminApp /> : <ClientApp />}
                        <ReactQueryDevtools initialIsOpen={false} />
                        <ResponsiveViewer />
                    </QueryClientProvider>
                </PersistGate>
            </Provider>
            <ToastContainer limit={3} />
        </ThemeProvider>
    </StrictMode>
);
