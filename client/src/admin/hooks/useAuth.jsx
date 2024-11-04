import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { checkAuthStatus } from "../services/authService";
import toastService from "@/services/toastService";
import { useEffect } from "react";

const useAuth = () => {
    const navigate = useNavigate();

    // Using React Query to check authentication status
    const authStatusQuery = useQuery({
        queryKey: ["authStatus"],
        queryFn: checkAuthStatus,
        retry: false,
        onError: error => toastService.error(error.message || "Error fetching authentication status"),
    });

    // Select admin and status from Redux store
    const { admin, status } = useSelector(state => state.auth);

    // Check if loading or error occurs
    const { data: authStatus, isLoading, isError } = authStatusQuery;

    useEffect(() => {
        if (isLoading) return;

        if (!authStatus || !admin || !admin.asOwnerShip || !status) {
            navigate("/admin/auth/login", { replace: true });
        }
    }, [authStatus, admin, status, isLoading, isError]);

    return { authStatus, admin, isLoading, isError };
};

export default useAuth;
