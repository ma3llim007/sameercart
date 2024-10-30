import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
export default function DashboardLayout() {
    const navigate = useNavigate();
    const authStatus = useSelector(state => state.auth.status);

    console.log(authStatus);
    
    
    useEffect(() => {
        if (!authStatus) {
            navigate("/admin/auth/login");
        }
    }, [authStatus]);

    return (
        <div>
            <h1>Admin Header</h1>
            <h1>Admin Aside</h1>
            <Outlet />
            <h1>Admin Footer</h1>
        </div>
    );
}
