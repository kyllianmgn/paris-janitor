"use client";
import { useRouter } from "next/navigation";
import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {authService} from "@/api/services/authService";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const isAuthenticated = await authService.checkAuth(dispatch);
                if (isAuthenticated) {

                    setIsLoading(false);
                } else {
                    router.push("/");
                }
            } catch (error) {
                console.error('Auth check error:', error);
                router.push("/");
            }
        };

        verifyAuth().then(r => console.log(r));
    }, [dispatch, router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}