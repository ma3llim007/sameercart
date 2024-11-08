import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    admin: null,
    accessToken: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.admin = action.payload.admin;
            state.accessToken = action.payload.accessToken;
        },
        logout: (state, action) => {
            state.status = false;
            state.admin = null;
            state.accessToken = null;
        },
    },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
