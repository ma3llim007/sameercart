import React from "react";
import { Outlet } from "react-router-dom";
import { Footer, Header } from "../components";
const ClientLayout = () => {
    return (
        <div className="h-screen w-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default ClientLayout;
