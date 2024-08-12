"use client";
import { useRouter } from "next/navigation";
import React, {useEffect, useState} from "react";
import { useAuth } from '@/hooks/useAuth';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, checkAuth } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const verifyAuth = async () => {
            const authStatus = await checkAuth();
            setIsLoading(false);
            if (!authStatus) {
                router.push('/');
            }
        };

        verifyAuth();
    }, [checkAuth, router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <>{children}</> : null;
}