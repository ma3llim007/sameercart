import { createSlice } from "@reduxjs/toolkit";

const initialState = { user: null, isAuthenticated: false };

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        userLogin: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        userLogOut: state => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { userLogin, userLogOut } = userSlice.actions;
export default userSlice.reducer;
