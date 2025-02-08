import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ProtectedRoute = () => {
    const navigate = useNavigate();
    // Select user and status from Redux store
    const { user, isAuthenticated } = useSelector(state => state.userAuth);

    useEffect(() => {
        if (!user || !isAuthenticated) {
            navigate("/login", { replace: true });
        }
    }, [user, isAuthenticated, navigate]);

    return <Outlet />;
};

export default ProtectedRoute;
