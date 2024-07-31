// src/types/index.ts
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  // Ajoutez d'autres propriétés selon votre modèle utilisateur
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

// Ajoutez d'autres interfaces selon vos besoins
export interface DecodedToken {
  userId: number;
  email: string;
  role: string;
  exp: number;
  // Ajoutez d'autres champs si nécessaire
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}
