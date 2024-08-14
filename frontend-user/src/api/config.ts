import {TokenResponse, DecodedToken, User} from "@/types";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import ky from "ky";

const tokenUtils = {
  getTokens: (): TokenResponse | null => {
    const accessToken = Cookies.get("authorization");
    const refreshToken = Cookies.get("refreshToken");
    return accessToken && refreshToken
        ? { accessToken: accessToken.replace("Bearer ", ""), refreshToken }
        : null;
  },
  setTokens: (tokenObject: TokenResponse) => {
    Cookies.set("authorization", `Bearer ${tokenObject.accessToken}`, {
      expires: 1, // 1 day
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    Cookies.set("refreshToken", tokenObject.refreshToken, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  },
  clearTokens: () => {
    Cookies.remove("authorization");
    Cookies.remove("refreshToken");
  },
  decodeToken: (token: string): DecodedToken => jwtDecode(token),
  isTokenValid: (token: string): boolean => {
    try {
      const decodedToken = tokenUtils.decodeToken(token);
      return decodedToken.exp > Date.now() / 1000;
    } catch (error) {
      return false;
    }
  },
};

const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  timeout: 8000,
  hooks: {
    beforeRequest: [
      (request) => {
        const tokens = tokenUtils.getTokens();
        if (tokens?.accessToken) {
          request.headers.set("Authorization", `Bearer ${tokens.accessToken}`);
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          tokenUtils.clearTokens();
        }
      },
    ],
  },
});

const getUserFromToken = (): User | null => {
  const tokens = tokenUtils.getTokens();
  if (tokens?.accessToken) {
    const decodedToken = tokenUtils.decodeToken(tokens.accessToken);
    const user: User = {
      id: decodedToken.userId,
      email: decodedToken.email,
      firstName: decodedToken.firstName,
      lastName: decodedToken.lastName,
    };
    if (decodedToken.landlordId) {
      user.Landlord = { id: decodedToken.landlordId, userId: decodedToken.userId };
    }
    if (decodedToken.travelerId) {
      user.Traveler = { id: decodedToken.travelerId, userId: decodedToken.userId };
    }
    if (decodedToken.serviceProviderId) {
      user.ServiceProvider = { id: decodedToken.serviceProviderId, userId: decodedToken.userId };
    }
    return user;
  }
  return null;
};

export { api, getUserFromToken, tokenUtils };


