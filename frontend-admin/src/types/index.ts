export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

export interface DecodedToken {
  userId: number;
  email: string;
  role: string;
  exp: number;
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
