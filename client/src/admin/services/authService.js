import axiosInstance from "./axiosInstance";

const adminLogin = async ({ email, password }) => {
    const response = await axiosInstance.post("auth/login", { email, password });
    return response.data;
};

const adminLogOut = () => {};

export { adminLogin, adminLogOut };
