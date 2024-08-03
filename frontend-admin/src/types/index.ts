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