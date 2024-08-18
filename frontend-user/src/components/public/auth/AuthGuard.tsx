"use client";
import { useRouter } from "next/navigation";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/store";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const user = useSelector((state: RootState) => state.auth.user)
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log(user)
        if (user === null){
            router.push('/');
        }
    }, [router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (<>
        {user && <>{children}</>}
    </>)
}