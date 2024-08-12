"use client";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setCredentials, logout } from '@/store/slices/authSlice';
import { authService } from '@/api/services/authService';
import {LoginRequest, TokenResponse} from "@/types";
import {tokenUtils} from "@/api/config";

export const useAuth = () => {
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);

    const login = async (loginData: LoginRequest) => {
        try {
            const response = await authService.login(loginData, dispatch);
            dispatch(setCredentials(response));
        } catch (error) {
            throw error;
        }
    };

    const logoutUser = () => {
        authService.logout(dispatch);
        dispatch(logout());
    };

    const checkAuth = async () => {
        try {
            const isAuthenticated = await authService.checkAuth(dispatch);
            if (isAuthenticated){
                dispatch(setCredentials(tokenUtils.getTokens() as TokenResponse));
            } else{
                dispatch(logout());
            }

            return isAuthenticated;
        } catch (error) {
            dispatch(logout());
            return false;
        }
    };

    return {
        ...auth,
        login,
        logout: logoutUser,
        checkAuth,
    };
};