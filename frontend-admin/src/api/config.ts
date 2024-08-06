import {TokenResponse, DecodedAdminToken} from "@/types";
import {jwtDecode} from "jwt-decode";
import ky from "ky";
import Cookies from "js-cookie";
import {logoutAdmin} from "@/store/slices/authSlice";
import {store} from "@/store";

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
    decodeToken: (token: string): DecodedAdminToken => jwtDecode(token),
};

const api = ky.create({
    prefixUrl: process.env.NEXT_PUBLIC_API_URL,
    timeout: 8000,
    headers: {
        'Content-Type': 'application/json',
    },
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
                    request.headers.set("Authorization", tokens.accessToken);
                }
            },
        ],
        beforeRetry: [
            async () => {
                const response = await refreshToken()
                console.log("RETRY")
                if (!response){
                    store.dispatch(logoutAdmin())
                }
            }
        ],
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
            const refreshResponse = await api.post("auth/admin/refreshToken", {json: {token: tokens.refreshToken},}).json<TokenResponse>();
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



export {api, refreshToken, tokenUtils};
