import { api, tokenUtils } from '@/api/config';
import { setAdminCredentials, logoutAdmin } from '@/store/slices/authSlice';
import { AppDispatch } from '@/store';
import { AdminLoginRequest, TokenResponse } from '@/types';

export const authService = {
    loginAdmin: async (loginData: AdminLoginRequest, dispatch: AppDispatch): Promise<TokenResponse> => {
        try {
            const response: TokenResponse = await api.post('auth/login/admin', { json: loginData }).json();
            tokenUtils.setTokens(response);
            dispatch(setAdminCredentials(response));
            return response;
        } catch (error) {
            console.error('Admin login error:', error);
            throw error;
        }
    },

    logoutAdmin: (dispatch: AppDispatch): void => {
        tokenUtils.clearTokens();
        dispatch(logoutAdmin());
    },

    refreshAdminToken: async (dispatch: AppDispatch): Promise<TokenResponse> => {
        try {
            const tokens = tokenUtils.getTokens();
            if (!tokens?.refreshToken) {
                throw new Error('No refresh token available');
            }
            const response: TokenResponse = await api.post('auth/refreshToken', { json: { token: tokens.refreshToken } }).json();
            tokenUtils.setTokens(response);
            dispatch(setAdminCredentials(response));
            return response;
        } catch (error) {
            console.error('Token refresh error:', error);
            dispatch(logoutAdmin());
            throw error;
        }
    },

    checkAdminAuth: async (dispatch: AppDispatch): Promise<TokenResponse> => {
        try {
            const response: TokenResponse = await api.get('auth/check').json();
            dispatch(setAdminCredentials(response));
            return response;
        } catch (error) {
            console.error('Auth check error:', error);
            dispatch(logoutAdmin());
            throw error;
        }
    },
};