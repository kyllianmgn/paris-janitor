import { api, tokenUtils } from '@/api/config';
import { setCredentials, logout } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store/store';
import {ApiResponse, LoginRequest, SignUpRequest, TokenResponse, User} from '@/types';

export const authService = {
    login: async (loginData: LoginRequest, dispatch: AppDispatch): Promise<TokenResponse> => {
        try {
            console.log("je suis dans le login fucntion");
            console.log(loginData);
            const response: TokenResponse = await api.post('auth/login', { json: loginData }).json();
            tokenUtils.setTokens(response);
            dispatch(setCredentials(response));
            console.log("response");
            console.log(response);
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    signup: async (userData: SignUpRequest, dispatch: AppDispatch, role: string): Promise<TokenResponse> => {
        try {
            const response: TokenResponse = await api.post(`auth/signup/${role.toLowerCase()}`, { json: userData }).json();
            tokenUtils.setTokens(response);
            dispatch(setCredentials(response));
            return response;
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    },

    logout: (dispatch: AppDispatch): void => {
        tokenUtils.clearTokens();
        dispatch(logout());
    },

    refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
        try {
            const response: TokenResponse = await api.post('auth/refreshToken', { json: { token: refreshToken } }).json();
            tokenUtils.setTokens(response);
            return response;
        } catch (error) {
            console.error('Token refresh error:', error);
            throw error;
        }
    },

    checkAuth: async (dispatch: AppDispatch) => {
        try {
            const response = await api.get('auth/check');
            if (response.status === 200) {
                return true;
            } else {
                console.log("l'api renvoie : ", response.status);
                console.log("donc je deconectte");
                dispatch(logout());
                return false;
            }
        } catch (error) {
            console.error('Auth check error:', error);
            dispatch(logout());
            throw error;
        }
    },

    getUserInfo: async (): Promise<User> => {
        try {
            console.log("je suis dans le getUserInfo");
            const res = await api.get("users/me").json<ApiResponse<User>>();
            return res.data;
        } catch (error) {
            console.error("Error fetching user info:", error);
            throw error;
        }
    },
};