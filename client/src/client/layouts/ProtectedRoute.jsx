import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import toastService from "@/services/toastService";

const ProtectedRoute = () => {
    const navigate = useNavigate();
    // Select user and status from Redux store
    const { user, isAuthenticated } = useSelector(state => state.userAuth);

    useEffect(() => {
        if (!user || !isAuthenticated) {
            navigate("/login", { replace: true });
            toastService.error("Login First To Access The Authorized Pages");
        }
    }, [user, isAuthenticated, navigate]);

    return <Outlet />;
};

export default ProtectedRoute;
