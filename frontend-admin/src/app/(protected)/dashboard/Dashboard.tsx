"use client";
import {api} from "@/api/config";
import {useEffect} from "react";

export const Dashboard = () => {
    const amIAdmin = async () => {
        const res = await api.get('amiadmin').json()
        console.log(res)
    }

    useEffect(() => {
        amIAdmin().then()
    }, []);

    return (
            <div className="px-4 py-6 sm:px-0">
                <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-2">
                    <h2 className="text-2xl font-semibold mb-4">Dashboard Content</h2>
                </div>
            </div>
    )
}