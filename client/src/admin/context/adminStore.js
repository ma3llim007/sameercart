import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";

const adminStore = configureStore({
    reducer: {
        auth: authSlice,
    },
});

export default adminStore;