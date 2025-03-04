import { Outlet } from "react-router-dom";
import crudService from "@/api/crudService";
import { useQuery } from "@tanstack/react-query";
import toastService from "@/services/toastService";
import Loader from "../components/Loader/Loader";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

const ClientLayout = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["headerContent"],
        queryFn: () => crudService.get("category/category-with-sub-category"),
        cacheTime: 1000 * 60 * 60 * 48,
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            toastService.error(message || "Failed to fetch Data.");
        },
    });

    if (isLoading) return <Loader />;

    return (
        <div className="h-screen w-full flex flex-col overflow-x-hidden">
            <Header data={data} />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default ClientLayout;
