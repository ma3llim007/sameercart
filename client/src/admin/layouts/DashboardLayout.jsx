import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { AdminSideBar, Footer, Header } from "../components";
import useAuth from "../hooks/useAuth";
import toastService from "@/services/toastService";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function DashboardLayout() {
    const navigate = useNavigate();
    const { status, admin, accessToken } = useSelector(state => state.auth);
    useEffect(() => {
        if (!status || !admin || !admin.asOwnerShip || !accessToken) {
            navigate("/admin/auth/login", { replace: true });
        }
    }, [admin, status, accessToken]);

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
