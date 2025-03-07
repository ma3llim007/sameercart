import { Outlet, useLocation } from "react-router-dom";
import crudService from "@/api/crudService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toastService from "@/services/toastService";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useEffect } from "react";

const fetchHeaderContent = async () => {
    try {
        return await crudService.get("category/category-with-sub-category");
    } catch (error) {
        const message = error?.response?.data?.message || error?.message;
        toastService.error(message || "Failed to fetch Data.");
    }
};

const ClientLayout = () => {
    const queryClient = useQueryClient();
    const location = useLocation();

    // Prefetch data on mount
    useEffect(() => {
        queryClient.prefetchQuery({
            queryKey: ["headerContent"],
            queryFn: fetchHeaderContent,
            cacheTime: 1000 * 60 * 60 * 48,
        });
    }, [queryClient]);

    // Use the pre-fetched data
    const { data, isLoading } = useQuery({
        queryKey: ["headerContent"],
        queryFn: fetchHeaderContent,
        cacheTime: 1000 * 60 * 60 * 48,
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    if (isLoading) return <Loader />;
    return (
        <div className="min-h-screen w-full flex flex-col !overflow-x-hidden">
            <Header data={data} />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default ClientLayout;
