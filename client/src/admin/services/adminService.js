import toastService from "@/services/toastService";
import axiosInstance from "./axiosInstance";

const registerAdminSer = async credential => {
    try {
        const response = await axiosInstance.post("auth/register", credential);
        return response.data;
    } catch (error) {
        const errorMessage = error?.response?.data?.message || "Registration failed. Please try again.";
        toastService.error(errorMessage);
    }
};

const adminListSer = async () => {
    try {
        const { data, status, statusText } = await axiosInstance.get("auth/admin-list");
        if (status === 200 && statusText.toLowerCase() === "ok") {
            return data?.data;
        } else {
            toastService.error("Failed to fetch the admin list. Unexpected server response.");
        }
    } catch (error) {
        const errorMessage = error?.response?.data?.message || "Could not retrieve the admin list. Please try again.";
        toastService.error(errorMessage);
    }
};

export { registerAdminSer, adminListSer };
