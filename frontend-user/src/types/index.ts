

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  Traveler?: Traveler;
  Landlord?: Landlord;
  ServiceProvider?: ServiceProvider;
}

export interface Landlord {
  id: number;
  userId: number;
}

export interface Traveler {
  id: number;
  userId: number;
}

export interface ServiceProvider {
  id: number;
  userId: number;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  role: 'LANDLORD' | 'TRAVELER' | 'SERVICE_PROVIDER' | null;
  idRole: number | null;
}

export interface DecodedToken {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  landlordId?: number;
  travelerId?: number;
  serviceProviderId?: number;
  role:string;
  exp: number;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;

}
export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  token: string;
}

export interface RevokeRefreshTokenRequest {
  userId: number;
}

export interface ApiResponse<T> {
  data: T
}
