import axiosInstance from "@/services/axiosInstance";

const adminLogin = async ({ email, password }) => {
    try {
        const response = await axiosInstance.post("auth/login", { email, password });
        return response.data;
    } catch (error) {
        console.error("Login Failed", error?.response?.data?.message || error.message);
        throw error;
    }
};

const adminLogOut = async id => {
    try {
        const response = await axiosInstance.post("auth/logout", { id });
        return response.data;
    } catch (error) {
        console.error("LogOut Failed", error?.response?.data?.message || error.message);
        throw error;
    }
};

const checkAuthStatus = async () => {
    const response = await axiosInstance.get("auth/check-session");
    return response.data;
};

export { adminLogin, adminLogOut, checkAuthStatus };
