import { axiosInstanceAuth, axiosInstancePublic } from "./apiInstance";

const crudService = {
    get: async (url, params = {}, authRequired = false) => {
        const axiosInstance = authRequired ? axiosInstanceAuth : axiosInstancePublic;
        const response = await axiosInstance.get(url, { params });
        return response.data;
    },
    post: async (url, data = {}, authRequired = false) => {
        const axiosInstance = authRequired ? axiosInstanceAuth : axiosInstancePublic;
        const response = await axiosInstance.post(url, data);
        return response.data;
    },
    put: async (url, data = {}, authRequired = false) => {
        const axiosInstance = authRequired ? axiosInstanceAuth : axiosInstancePublic;
        const response = await axiosInstance.put(url, data);
        return response.data;
    },
    delete: async (url, authRequired = false) => {
        const axiosInstance = authRequired ? axiosInstanceAuth : axiosInstancePublic;
        const response = await axiosInstance.delete(url);
        return response.data;
    },
};

export default crudService;