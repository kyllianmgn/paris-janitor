import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { AuthState, TokenResponse, DecodedToken } from '@/types';
import { jwtDecode } from 'jwt-decode';
import {authService} from "@/api/services/authService";
import {tokenUtils} from "@/api/config";

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    idRole: null,
    role: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<TokenResponse>) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
            const decodedToken = jwtDecode(action.payload.accessToken) as DecodedToken;
            console.log(decodedToken)
            state.user = {
                id: decodedToken.userId,
                email: decodedToken.email,
                firstName: decodedToken.firstName,
                lastName: decodedToken.lastName,
            };
            if (decodedToken.landlordId) {
                state.idRole = decodedToken.landlordId;
                state.role = 'LANDLORD';
            }
            if (decodedToken.travelerId) {
                state.idRole = decodedToken.travelerId;
                state.role = 'TRAVELER';
            }
            if (decodedToken.serviceProviderId) {
                state.idRole = decodedToken.serviceProviderId;
                state.role = 'SERVICE_PROVIDER';
            }
        },
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.idRole = null;
            state.role = null;
            tokenUtils.clearTokens();
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

const refreshAccessToken = async (refreshToken: string): Promise<string> => {
    try {
        const response = await authService.refreshToken(refreshToken);
        return response.accessToken;
    } catch (error) {
        throw error;
    }
};
