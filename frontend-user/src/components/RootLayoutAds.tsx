"use client";
import React, {ReactNode, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState} from "@/store";

export default function RootLayoutAds({children}: {children: ReactNode}) {
    const user = useSelector((state: RootState) => state.auth.user);
    const role = useSelector((state: RootState) => state.auth.role);
    const travelerStatus = useSelector((state: RootState) => state.auth.travelerPlan);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="mx-auto pt-20 px-4 py-8 flex items-center justify-evenly">
            {
                isClient && (!user || (user && role == "TRAVELER" && travelerStatus == "FREE")) &&
                <div className={"flex justify-center align-middle text-center h-96 w-32 border-2 border-black"}>
                    Votre pub ici
                </div>
            }
            <div className={"w-full"}>
                {children}
            </div>
            {
                isClient && (!user || (user && role == "TRAVELER" && travelerStatus == "FREE")) &&
                <div className={"flex justify-center align-middle text-center h-96 w-32 border-2 border-black"}>
                    Votre pub ici
                </div>
            }
        </div>
    )
}