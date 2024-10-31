import axiosInstance from "./axiosInstance";

const adminLogin = async ({ email, password }) => {
    try {
        const response = await axiosInstance.post("auth/login", { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

const adminLogOut = async id => {
    try {
        const response = await axiosInstance.post("auth/logout", { id });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export { adminLogin, adminLogOut };
