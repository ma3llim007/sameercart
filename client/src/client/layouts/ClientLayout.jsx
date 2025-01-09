import { Outlet } from "react-router-dom";
import { Footer, Header } from "../components";
import crudService from "@/api/crudService";
import { useQuery } from "@tanstack/react-query";
import toastService from "@/services/toastService";
import Loader from "../components/Loader/Loader";

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
        <div className="h-screen w-screen flex flex-col">
            <Header data={data} />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default ClientLayout;
