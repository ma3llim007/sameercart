import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    admin: null,
    token: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.admin = action.payload.admin;
            state.token = action.payload.token;
        },
        logout: (state, action) => {
            state.status = false;
            state.admin = null;
            state.token = null;
        },
    },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
