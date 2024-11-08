import { store } from "@/store";
import axios from "axios";

// Public Axios instance
const axiosInstancePublic = axios.create({
    baseURL: import.meta.env.VITE_ADMIN_FRONTEND_URL || "http://localhost:8000",
    timeout: 1000,
});

// Authenticated Axios instance
const axiosInstanceAuth = axios.create({
    baseURL: import.meta.env.VITE_ADMIN_BACKEND_URL || "http://localhost:8000/",
    withCredentials: true,
    timeout: 1000,
});

// Interceptor for attaching token
axiosInstanceAuth.interceptors.request.use(
    config => {
        const token = store.getState().auth.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export { axiosInstancePublic, axiosInstanceAuth };
