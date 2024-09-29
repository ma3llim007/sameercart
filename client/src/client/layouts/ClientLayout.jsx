import React from "react";
import { Outlet } from "react-router-dom";
import { Footer, Header } from "../components";
const ClientLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
            <Footer />
        </>
    );
};

export default ClientLayout;
