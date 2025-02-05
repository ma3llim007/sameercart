import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { AdminSideBar, Footer, Header, Loading } from "../components";
import useAuth from "../hooks/useAuth";
import toastService from "@/services/toastService";

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
