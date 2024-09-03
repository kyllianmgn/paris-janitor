import {TokenResponse, DecodedToken, User} from "@/types";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import ky from "ky";
import {logout} from "@/store/slices/authSlice";

const tokenUtils = {
  getTokens: (): Partial<TokenResponse> | null => {
    const accessToken = Cookies.get("authorization");
    const refreshToken = Cookies.get("refreshToken");
    return {accessToken, refreshToken};
  },
  setTokens: (tokenObject: TokenResponse): void => {
    console.log(tokenObject.accessToken)
    Cookies.set("authorization", `Bearer ${tokenObject.accessToken}`, {
      expires: 1,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    Cookies.set("refreshToken", tokenObject.refreshToken, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  },
  clearTokens: (): void => {
    Cookies.remove("authorization");
    Cookies.remove("refreshToken");
  },
  decodeToken: (token: string): DecodedToken => jwtDecode(token),
};

const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  timeout: 8000,
  retry: {
    limit: 1,
    statusCodes: [401],
    methods: ["get","post","patch","put"],
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const tokens = tokenUtils.getTokens();
        if (tokens?.accessToken) {
          request.headers.set("Authorization", `${tokens.accessToken}`);
        }
      },
    ],
    beforeRetry: [
      async () => {
        const response = await refreshToken()
        console.log("RETRY")
        if (!response){
          console.log("cleareddd")
          tokenUtils.clearTokens()
        }
      }
    ]
  },
});


let refreshPromise: Promise<boolean> | null = null;

const refreshToken = async (): Promise<boolean> => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = new Promise(async (resolve) => {
    const tokens = tokenUtils.getTokens();
    if (!tokens?.refreshToken) {
      resolve(false);
      return;
    }

    try {
      const refreshResponse = await api.post("auth/refreshToken", {json: {token: tokens.refreshToken},}).json<TokenResponse>();
      tokenUtils.setTokens(refreshResponse);
      resolve(true);
    } catch (error) {
      tokenUtils.clearTokens();
      alert("disconnected")
      resolve(false);
    } finally {
      refreshPromise = null;
    }
  });

  return refreshPromise;
};

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


