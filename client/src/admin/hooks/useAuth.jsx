import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
    const navigate = useNavigate();

    // Using React Query to check authentication status
    const {
        data: authData,
        isError,
        isLoading,
    } = useQuery({
        queryKey: ["authStatus"],
        queryFn: () => crudService.get("auth/check-session", true),
        retry: false,
        staleTime: 5 * 60 * 1000,
        onError: error => toastService.error(error.message || "Error checking authentication status"),
    });

    // Select admin and status from Redux store
    const { admin, status } = useSelector(state => state.auth);
    const isAuthenticated = authData?.data?.isAuthenticated;

    useEffect(() => {
        if (isLoading) return;
        const isAuthenticated = authData?.data?.isAuthenticated;
        const hasOwnerShip = admin?.asOwnerShip;

        if (!isAuthenticated || !hasOwnerShip || !status) {
            navigate("/admin/auth/login", { replace: true });
        }
    }, [authData, admin, status, isLoading, isError, navigate]);

    return { admin, isAuthenticated, isLoading, isError };
};

export default useAuth;
