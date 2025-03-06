import { lazy, StrictMode, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./client/context/themeProvider";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, storePersistor } from "./store";
import queryClient from "./api/queryClientConfig";
import Loading from "./admin/components/Loading";
import "./index.css";
import "./styles/styles.css";
import "swiper/css";
import "react-toastify/dist/ReactToastify.css";
import { HelmetProvider } from "react-helmet-async";
const AdminApp = lazy(() => import("./admin/AdminApp"));
const ClientApp = lazy(() => import("./client/ClientApp"));

function AppRouter() {
    const location = window.location.pathname;
    const isAdmin = location.startsWith("/admin");
    useEffect(() => {
        if (isAdmin) {
            document.documentElement.style.overflow = "auto";
        } else {
            document.documentElement.style.overflow = "hidden";
        }

        return () => {
            document.documentElement.style.overflow = "auto";
        };
    }, [isAdmin]);
    return <Suspense fallback={<Loading />}>{isAdmin ? <AdminApp /> : <ClientApp />}</Suspense>;
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <HelmetProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Provider store={store}>
                    <PersistGate loading={null} persistor={storePersistor}>
                        <QueryClientProvider client={queryClient}>
                            <AppRouter />
                        </QueryClientProvider>
                    </PersistGate>
                </Provider>
                <ToastContainer limit={4} />
            </ThemeProvider>
        </HelmetProvider>
    </StrictMode>
);
