import {DoorOpen} from "lucide-react";
import React from "react";
import {Admin} from "@/types";
import NavItem from "@/components/nav/NavItem";

export default function Nav({children, admin}: {children: React.ReactNode, admin: Admin}) {

    const logout = () => {
        alert("logout")
    }
    return (
        <div className="min-h-screen bg-gray-100 flex ">
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-0">Paris Janitor</h1>
                    <h2 className="text-sm">Admin Dashboard</h2>
                    <div className="flex items-center mt-2">
                        <span className="mr-2">Welcome, {admin.username} </span>
                        <DoorOpen className="cursor-pointer" onClick={() => logout()}/>
                    </div>
                    <div className="flex flex-col items-center mt-2 h-full justify-center">
                        <NavItem menuName="Dashboard" iconName="layout-dashboard" route="/dashboard"/>
                        <NavItem menuName="Properties" iconName="house" route="/properties"/>
                    </div>
                </div>
            </nav>
            <main className="flex-1">
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
        </div>
)
}