"use client";
import { useDispatch, useSelector } from 'react-redux';
import {AppDispatch, RootState, store} from '@/store/store';
import { setCredentials, logout } from '@/store/slices/authSlice';
import { authService } from '@/api/services/authService';
import {LoginRequest, SignUpRequest, TokenResponse} from "@/types";
import {tokenUtils} from "@/api/config";
import {useEffect, useState} from "react";

export const useAuth = () => {
    const dispatch: AppDispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.auth);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (loginData: LoginRequest) => {
        try {
            const response = await authService.login(loginData, dispatch);
            store.dispatch(setCredentials(response));
        } catch (error) {
            throw error;
        }
    };

    const logoutUser = () => {
        authService.logout(dispatch);
        dispatch(logout());
    };

    const signup = async (signupData: SignUpRequest) => {
        try {
            const response = await authService.signup(signupData, dispatch);
            store.dispatch(setCredentials(response));
        } catch (error) {
            throw error;
        }
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
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth().then();
    }, []);
    return {
        ...auth,
        isLoading,
        login,
        logout: logoutUser,
        checkAuth,
    };
};