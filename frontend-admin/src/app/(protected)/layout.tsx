"use client"
import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {useRouter} from "next/navigation";
import {DoorOpen} from "lucide-react";
import Nav from "@/components/nav/Nav";

export default ({children}: {children: React.ReactNode}) => {
    const router = useRouter();
    const admin = useSelector((state: RootState) => state.auth.admin)

    useEffect(() => {
        if (!admin) {
            router.push('/')
        }
    }, [admin]);



    return (<>
        {admin && <Nav admin={admin}>{children}</Nav>}
        </>
    )
}