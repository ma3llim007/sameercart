import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import toastService from "@/services/toastService";
import { AdminSideBar } from "../components/AdminSideBar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

export default function DashboardLayout() {
    const { admin, isError, isLoading } = useAuth();

    if (isLoading) {
        return <Loading />;
    }

    if (isError) {
        toastService.error("Please Log In To Access The Admin Panel");
        return null;
    }

    return (
        <SidebarProvider>
            <AdminSideBar username={admin?.username} />
            <SidebarInset>
                <Header />
                <section className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                    <Outlet />
                </section>
                <Footer />
            </SidebarInset>
        </SidebarProvider>
    );
}
