import { api, tokenUtils } from '@/api/config';
import { setCredentials, logout } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';
import { LoginRequest, SignUpRequest, TokenResponse } from '@/types';

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

    refreshToken: async (dispatch: AppDispatch): Promise<TokenResponse> => {
        try {
            const tokens = tokenUtils.getTokens();
            if (!tokens?.refreshToken) {
                throw new Error('No refresh token available');
            }
            const response: TokenResponse = await api.post('auth/refreshToken', { json: { token: tokens.refreshToken } }).json();
            tokenUtils.setTokens(response);
            dispatch(setCredentials(response));
            return response;
        } catch (error) {
            console.error('Token refresh error:', error);
            dispatch(logout());
            throw error;
        }
    },

    checkAuth: async (dispatch: AppDispatch): Promise<TokenResponse> => {
        try {
            const response: TokenResponse = await api.get('auth/check').json();
            dispatch(setCredentials(response));
            return response;
        } catch (error) {
            console.error('Auth check error:', error);
            dispatch(logout());
            throw error;
        }
    },
};