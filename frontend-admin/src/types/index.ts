export interface Admin {
    id: number;
    username: string;
}

export interface AdminLoginRequest {
    username: string;
    password: string;
}

export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface DecodedAdminToken {
    adminId: number;
    username: string;
    exp: number;
}

export interface AuthState {
    admin: Admin | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
}

export interface Property {
    id?: number;
    landlordId: number;
    address: string;
    description: string;
    status: PropertyStatus;
    createdAt: string;
    updatedAt: string;
    landlord?: Landlord
}

export interface Landlord {
    id: number,
    userId: number;
    user?: User
}

export interface User{
    id: number
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export enum PropertyStatus {
    PENDING="PENDING",
    APPROVED="APPROVED",
    REJECTED="REJECTED",
}

enum ServiceProviderStatus {
    PENDING="PENDING",
    ACCEPTED="ACCEPTED",
    REFUSED="REFUSED"
}

export interface Service{
    id: number,
    providerId: number,
    name: string,
    description: string,
    basePrice: number
}

export interface ApiResponse<T>{
    data: T
}