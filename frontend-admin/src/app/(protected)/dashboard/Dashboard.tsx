"use client"
import {api} from "@/api/config";
import {useEffect, useState} from "react";
import {getPendingPropertiesCount} from "@/api/services/property-service";
import Link from "next/link";
import {getPendingServiceProviders, getPendingServiceProvidersCount} from "@/api/services/service-provider-service";

export const Dashboard = () => {
    const [pendingProprietiesCount, setPendingProprietiesCount] = useState(0);
    const [pendingServiceProvidersCount, setPendingServiceProvidersCount] = useState(0);

    const loadPendingProprietiesCount = async () => {
        const count = await getPendingPropertiesCount()
        setPendingProprietiesCount(count.data.count)
    }

    const loadPendingServiceProviders = async () => {
        const count = await getPendingServiceProvidersCount()
        setPendingServiceProvidersCount(count.data.count)
    }

    useEffect(() => {
        loadPendingProprietiesCount().then()
        loadPendingServiceProviders().then()
    }, []);

    return (
        <div className="px-4 py-6 sm:px-0">
            <h2 className="text-2xl font-semibold mb-4">Dashboard Content</h2>
            <div className=" border-4 border-dashed border-gray-200 rounded-lg h-96 p-3 grid grid-cols-6 grid-rows-6 gap-3">
                <Link href={"/properties/pending"} className="col-span-3 row-span-2">
                    <div className="p-2 shadow rounded-lg h-full w-full border-gray-200 border-2  bg-gradient-to-br from-gray-100 from-50% to-gray-300 hover:from-30% transition-all">
                        <h1 className="text-lg font-bold">Propritétiés en attente de validation</h1>
                        <h1 className="text-3xl font-bold">{pendingProprietiesCount}</h1>
                    </div>
                </Link>
                <Link href={"/service-providers/pending"} className="col-span-3 row-span-2">
                    <div className="p-2 shadow rounded-lg h-full w-full border-gray-200 border-2  bg-gradient-to-br from-gray-100 from-50% to-gray-300 hover:from-30% transition-all">
                        <h1 className="text-lg font-bold">Prestataires en attente de validation</h1>
                        <h1 className="text-3xl font-bold">{pendingServiceProvidersCount}</h1>
                    </div>
                </Link>
            </div>
        </div>
    )
}