import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, TokenResponse, DecodedAdminToken } from '@/types';
import { jwtDecode } from 'jwt-decode';
import {cookies} from "next/headers";
import {RootState} from "@/store";

const initialState: AuthState = {
    admin: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAdminCredentials: (state, action: PayloadAction<TokenResponse>) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
            const decodedToken = jwtDecode(action.payload.accessToken) as DecodedAdminToken;
            state.admin = {
                id: decodedToken.adminId,
                username: decodedToken.username,
            };
        },
        logoutAdmin: (state) => {
            console.log("LOGOUT")
            state.admin = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setAdminCredentials, logoutAdmin } = authSlice.actions;
export default authSlice.reducer;
export const selectCurrentAdmin =(state: RootState) => state.auth.admin;