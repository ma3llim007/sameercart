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
            state.admin = action.payload;
        },
        logout: (state, action) => {
            state.status = false;
            state.admin = null;
        },
    },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
