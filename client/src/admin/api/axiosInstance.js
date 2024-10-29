import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_ADMIN_BACKEND_URL,
    withCredentials: true,
});

export default axiosInstance;
