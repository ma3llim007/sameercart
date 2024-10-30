import { toast } from "react-toastify";

const defaultConfig = {
    position: "bottom-center",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
};

const toastService = {
    success: (message, options = {}) => {
        toast.success(message, { ...defaultConfig, ...options });
    },
    error: (message, options = {}) => {
        toast.error(message, { ...defaultConfig, ...options });
    },
    info: (message, options = {}) => {
        toast.info(message, { ...defaultConfig, ...options });
    },
    warning: (message, options = {}) => {
        toast.warning(message, { ...defaultConfig, ...options });
    },
};

export default toastService;
