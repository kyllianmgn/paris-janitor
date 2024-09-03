import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, TokenResponse, DecodedToken } from '@/types';
import { jwtDecode } from 'jwt-decode';
import { tokenUtils } from "@/api/config";

const initialState: AuthState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    idRole: null,
    role: null,
    travelerPlan: null,
    landlordStatus: null,
    serviceProviderStatus: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<TokenResponse>) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
            const decodedToken = jwtDecode<DecodedToken>(action.payload.accessToken);
            state.user = {
                id: decodedToken.userId,
                email: decodedToken.email,
                firstName: decodedToken.firstName,
                lastName: decodedToken.lastName,
            };
            if (decodedToken.landlordId && decodedToken.landlordStatus) {
                state.landlordStatus = decodedToken.landlordStatus;
                state.idRole = decodedToken.landlordId;
                state.role = 'LANDLORD';
            } else if (decodedToken.travelerId && decodedToken.travelerPlan) {
                state.travelerPlan = decodedToken.travelerPlan
                state.idRole = decodedToken.travelerId;
                state.role = 'TRAVELER';
            } else if (decodedToken.serviceProviderId && decodedToken.serviceProviderStatus) {
                state.idRole = decodedToken.serviceProviderId;
                state.role = 'SERVICE_PROVIDER';
                state.serviceProviderStatus = decodedToken.serviceProviderStatus
            }
        },
        logout: (state) => {
            Object.assign(state, initialState);
            tokenUtils.clearTokens();
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;