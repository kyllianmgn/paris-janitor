"use client";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setCredentials, logout } from '@/store/slices/authSlice';
import { authService } from '@/api/services/authService';
import {LoginRequest, SignUpRequest, TokenResponse} from "@/types";
import { useState} from "react";

export const useAuth = () => {
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);
    const [isLoading, setIsLoading] = useState(true);

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

    const signup = async (signupData: SignUpRequest,role: string) => {
        try {
            const response = await authService.signup(signupData, dispatch, role);
            dispatch(setCredentials(response));
        } catch (error) {
            throw error;
        }
    };


    return {
        ...auth,
        isLoading,
        login,
        logout: logoutUser,
        signup,
    };
};