import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { AdminSideBar, Footer, Header } from "../components";

export default function DashboardLayout() {
    const navigate = useNavigate();
    const { status: authStatus, admin } = useSelector(state => state.auth);

    useEffect(() => {
        if (!authStatus) {
            navigate("/admin/auth/login");
        }
    }, [authStatus]);

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
