"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        if (user === null) {
            router.push('/');
        }
    }, [user, router]);

    if (!isClient) return null;

    return <>{user ? children : null}</>;
}