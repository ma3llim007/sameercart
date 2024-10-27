import { useMutation } from "@tanstack/react-query";
import { login } from "../api/authenticationApi";

export const adminLogin = () => {
    return useMutation((data) => login(data));
};
