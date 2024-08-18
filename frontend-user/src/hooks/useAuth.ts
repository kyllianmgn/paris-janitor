"use client";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setCredentials, logout } from '@/store/slices/authSlice';
import { authService } from '@/api/services/authService';
import {LoginRequest, TokenResponse} from "@/types";
import {tokenUtils} from "@/api/config";
import {useEffect, useState} from "react";

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

    return {
        ...auth,
        isLoading,
        login,
        logout: logoutUser
    };
};