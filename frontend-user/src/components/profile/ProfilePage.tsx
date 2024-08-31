"use client";

import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {User} from "@/types";
import {authService} from "@/api/services/authService";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";
import {PersonalInfoTab} from "@/components/profile/PersonalInfoTab";
import {SecurityTab} from "@/components/profile/SecurityTab";
import {SubscriptionTab} from "@/components/profile/SubscriptionTab";

export const ProfilePage = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeTab, setActiveTab] = useState<string>("info");
    const router = useRouter();

    const loadUser = async () => {
        const res: User = await authService.getUserInfo();
        setUser(res);
        setLoading(false);
    };

    const handleGoBack = () => {
        router.back();
    };

    useEffect(() => {
        loadUser().then();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!user) {
        return <div className="flex justify-center items-center h-screen">Loading User...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Profile</h1>
                <div className="space-x-2">
                    <Button onClick={handleGoBack} variant="ghost" className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4"/>Back
                    </Button>
                </div>
            </div>

            <div className="flex">
                <div className="w-1/6 rounded-lg border p-2 h-fit">
                    <div className="flex flex-col space-y-2">
                        <button onClick={() => setActiveTab("info")}
                                className={`py-2 px-4 text-left ${activeTab === "info" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"} rounded-lg`}>
                            Your informations
                        </button>
                        <button onClick={() => setActiveTab("security")}
                                className={`py-2 px-4 text-left ${activeTab === "security" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"} rounded-lg`}>
                            Security
                        </button>
                        <button onClick={() => setActiveTab("subscription")}
                                className={`py-2 px-4 text-left ${activeTab === "subscription" ? "bg-primary text-white" : "bg-gray-100 text-gray-700"} rounded-lg`}>
                            Subscription
                        </button>
                    </div>
                </div>

                <div className="w-3/4 pl-4">
                    {activeTab === "info" && (
                        <PersonalInfoTab user={user}/>
                    )}

                    {activeTab === "security" && (
                        <SecurityTab/>
                    )}

                    {activeTab === "subscription" && (
                        <SubscriptionTab/>
                    )}
                </div>
            </div>
        </div>
    );
}
