import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AdminSideBar } from "../components/AdminSideBar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "@/client/components/ModeToggle";

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
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <div className="flex-grow flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem className="hidden md:block">
                                    <Link to={"/admin/dashboard"}>Home</Link>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <ModeToggle />
                </header>
                <section className="flex flex-1 flex-col gap-4 p-4">
                    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                        <div className="aspect-video rounded-xl bg-muted/50" />
                    </div>
                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
                        <Outlet />
                    </div>
                </section>
                <footer className="border-t px-4 py-4 bg-muted/50 text-center">
                    <div className="text-base font-bold text-muted-foreground">© {new Date().getFullYear()} SameerCart. All rights reserved.</div>
                </footer>
            </SidebarInset>
        </SidebarProvider>
    );
}
