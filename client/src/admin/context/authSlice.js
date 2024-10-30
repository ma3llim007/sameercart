import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    admin: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.admin = action.payload.admin;
        },
        logout: (state, action) => {
            state.status = false;
            state.userDate = null;
        },
    },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
