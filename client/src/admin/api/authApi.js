import axiosInstance from "./axiosInstance";

const LoginApi = async credentials => {
    const response = await axiosInstance.post("auth/login", credentials);
    return response;
};

const logOutApi = async () => {
    await axiosInstance.post("auth/logout");
};

export { LoginApi, logOutApi };
