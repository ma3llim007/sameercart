/* eslint-disable react-hooks/exhaustive-deps */
import crudService from "@/api/crudService";
import { userLogin } from "@/features/home/userAuthSlice";
import toastService from "@/services/toastService";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader/Loader";

const OAuthSuccess = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const disptach = useDispatch();

    // Mutation
    const { mutate, isPending } = useMutation({
        enabled: !!userId,
        mutationFn: () => crudService.get(`users/oauth-sign-in/${userId}`, false),
        onSuccess: data => {
            const { _id, firstName, lastName, email } = data?.data?.user || {};
            disptach(userLogin({ _id, firstName, lastName, email }));
            navigate("/account/dashboard");
            toastService.success(data?.message);
        },
        onError: error => {
            const message = error?.response?.data?.message || error?.message;
            navigate("/login", { state: message });
        },
    });

    useEffect(() => {
        if (userId) {
            mutate();
        } else {
            navigate("/login");
        }
    }, [userId]);

    if (isPending) return <Loader />;
    return null;
};

export default OAuthSuccess;
