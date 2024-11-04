import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_ADMIN_BACKEND_URL || "http://localhost:8000",
    withCredentials: true,
    timeout: 1000,
});

// Request interceptor to add the access token if available
axiosInstance.interceptors.request.use(
    response => response,
    async error => {
        const originalRequest = error.config;

        // Handle token expiration
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                await axiosInstance.post("/auth/refresh-token");
                return axiosInstance(originalRequest);
            } catch (error) {
                console.error("Refresh Token Expired Or Invalid");
            }
        }
    }
);

export default axiosInstance;
