import crudService from "@/api/crudService";
import toastService from "@/services/toastService";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
    const navigate = useNavigate();

    // Using React Query to check authentication status
    const { data, isError, isLoading } = useQuery({
        queryKey: ["authStatus"],
        queryFn: () => crudService.get("auth/check-session", true),
        retry: false,
        onError: error => toastService.error(error.message || "Error fetching authentication status"),
    });

    // Select admin and status from Redux store
    const { admin, status } = useSelector(state => state.auth);

    // Check if loading or error occurs
    useEffect(() => {
        if (isLoading) return;

        if (!admin || !admin.asOwnerShip || !status || !data?.data?.isAuthenticated) {
            navigate("/admin/auth/login", { replace: true });
        }
    }, [admin, status, isLoading, isError]);

    return { admin, isLoading, isError };
};

export default useAuth;
