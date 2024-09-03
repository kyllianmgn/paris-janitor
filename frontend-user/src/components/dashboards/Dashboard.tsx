"use client"

import React, {useEffect, useState} from "react";
import {User} from "@/types";
import {authService} from "@/api/services/authService";
import {LandlordDashboard} from "@/components/dashboards/LandlordDashboard";

export const Dashboard = () => {
    const [user, setUser] = useState<User | null>(null);

    const loadUser = async () => {
        const res: User = await authService.getUserInfo();
        setUser(res);
    };

    useEffect(() => {
        loadUser().then();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div>
                <div className="flex flex-col items-center justify-center">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                </div>
            </div>
            <div className="flex justify-between items-center mb-6">
                {user?.Landlord && (
                    <LandlordDashboard user={user}/>
                )}
                {user?.Traveler && (
                    <div>
                        Traveler Dashboard
                    </div>
                )}
                {user?.ServiceProvider && (
                    <div>
                        ServiceProvider Dashboard
                    </div>
                )}
            </div>
        </div>
    );
}
