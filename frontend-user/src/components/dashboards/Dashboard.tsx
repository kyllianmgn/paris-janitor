"use client"

import React, { useEffect, useState } from "react";
import { User } from "@/types";
import { authService } from "@/api/services/authService";
import {UserDashboard} from "@/components/UserDashboard";


export const Dashboard = () => {
    const [user, setUser] = useState<User | null>(null);

    const loadUser = async () => {
        const res: User = await authService.getUserInfo();
        setUser(res);
    };

    useEffect(() => {
        loadUser().then();
    }, []);

    if (!user) return <div>Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col items-center justify-center mb-8">
                <h1 className="text-3xl font-bold">Dashboard</h1>
            </div>
            {(user.Landlord || user.ServiceProvider) && <UserDashboard user={user} />}
            {user.Traveler && <div>Traveler Dashboard</div>}
        </div>
    );
}