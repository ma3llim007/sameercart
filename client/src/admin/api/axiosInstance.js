import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_ADMIN_BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Token Management
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem("authTokne");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default axiosInstance;