"use client";

import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {User} from "@/types";
import {authService} from "@/api/services/authService";
import {Button} from "@/components/ui/button";
import {ArrowLeft} from "lucide-react";

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
    });

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
                    </div>
                </div>

                <div className="w-3/4 pl-4">
                    {activeTab === "info" && (
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 text-center">
                            <h4 className="text-2xl font-bold pb-6">Personal informations</h4>

                            <div className="grid grid-cols-2 grid-rows-2 gap-4">
                                <div className="text-left">
                                    <p className="font-bold">First name</p>
                                    <input
                                        className="mb-3 h-10 w-full rounded-md border border-input px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        name="firstName" type="text" value={user.firstName}/>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold">Last Name</p>
                                    <input
                                        className="mb-3 h-10 w-full rounded-md border border-input px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        name="lastName" type="text" value={user.lastName}/>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold">Email</p>
                                    <input
                                        className="mb-3 h-10 w-full rounded-md border border-input px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        name="email" type="email" value={user.email}/>
                                </div>
                            </div>

                            <Button>Submit</Button>
                        </div>
                    )}

                    {activeTab === "security" && (
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 text-center">
                            <h4 className="text-2xl font-bold text-center pb-6 w-full">Change password</h4>

                            <div className="flex justify-center">
                                <div className="text-left w-fit" id="divtocenter">
                                    <p className="font-bold w-fit">Old Password</p>
                                    <input
                                        className="mb-3 h-10 w-full rounded-md border border-input px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        name="oldpassword" type="password"/>

                                    <p className="font-bold w-fit">New Password</p>
                                    <input
                                        className="mb-3 h-10 w-full rounded-md border border-input px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        name="newpassword" type="password"/>

                                    <p className="font-bold w-fit">Confirm Password</p>
                                    <input
                                        className="mb-3 h-10 w-full rounded-md border border-input px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        name="confirmpassword" type="password"/>
                                </div>
                            </div>

                            <Button>Submit</Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
