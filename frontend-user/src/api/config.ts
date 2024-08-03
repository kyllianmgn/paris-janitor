import { TokenResponse, DecodedToken } from "@/types";
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
};

const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  timeout: 8000,
  credentials: "include",
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

const getUserRole = (decodedToken: DecodedToken) => {
  if (decodedToken.landlordId) {
    return "LANDLORD";
  }
  if (decodedToken.travelerId) {
    return "TRAVELER";
  }
  if (decodedToken.serviceProviderId) {
    return "SERVICE_PROVIDER";
  }
  return null;
};



export { api, getUserRole, tokenUtils };