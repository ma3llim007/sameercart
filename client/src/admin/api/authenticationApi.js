import axiosInstance from "./axiosInstance"

export const login = async (data) => {
    const response = await axiosInstance.post("auth/login", data);
    return response.data;
}