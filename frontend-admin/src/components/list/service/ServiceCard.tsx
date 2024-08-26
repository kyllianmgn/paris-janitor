"use client"
import {Service, ServiceProvider} from "@/types";
import {ArrowRight} from "lucide-react";
import Link from "next/link";
import {useEffect, useState} from "react";
import {getServiceCount} from "@/api/services/service-service";

export default function ServiceCard({service}: {service: Service}){
    const [count, setCount] = useState<number>(0);

    const loadCount = async () => {
        const count = await getServiceCount(service.id)
        setCount(count.data)
    }

    useEffect(() => {
        loadCount().then()
    }, []);

    return (
        <div className="flex bg-white shadow px-3 py-0.5 rounded-lg items-center justify-between">
            <div className="flex items-center">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold">{service.name}</h1>
                    <h2 className="text-lg">{service.description}</h2>
                </div>
                <div className="flex flex-col ml-5 text-sm">
                    <h2>Base Price : {service.basePrice}</h2>
                </div>
            </div>
            <Link href={"/services/" + service.id}>
                <ArrowRight className="cursor-pointer"/>
            </Link>
        </div>
    )
}