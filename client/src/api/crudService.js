import { axiosInstanceAuth, axiosInstancePublic } from "./apiInstance";

const crudService = {
    get: async (url, authRequired = false, params = {}) => {
        const axiosInstance = authRequired ? axiosInstanceAuth : axiosInstancePublic;
        const response = await axiosInstance.get(url, { params });
        return response.data;
    },
    post: async (url, authRequired = false, data = {}) => {
        const axiosInstance = authRequired ? axiosInstanceAuth : axiosInstancePublic;
        const response = await axiosInstance.post(url, data);
        return response.data;
    },
    put: async (url, authRequired = false, data = {}) => {
        const axiosInstance = authRequired ? axiosInstanceAuth : axiosInstancePublic;
        const response = await axiosInstance.put(url, data);
        return response.data;
    },
    delete: async (url, authRequired = false) => {
        const axiosInstance = authRequired ? axiosInstanceAuth : axiosInstancePublic;
        const response = await axiosInstance.delete(url);
        return response.data;
    },
    patch: async (url, authRequired = false, data = {}) => {
        const axiosInstance = authRequired ? axiosInstanceAuth : axiosInstancePublic;
        const response = await axiosInstance.patch(url, data);
        return response.data;
    },
};

export default crudService;
