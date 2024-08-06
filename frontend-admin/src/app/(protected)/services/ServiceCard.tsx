import {Service} from "@/types";
import {ArrowRight} from "lucide-react";
import Link from "next/link";

export default function ServiceCard({service}: {service: Service}){
    return (
        <div className="flex bg-white shadow px-3 py-0.5 rounded-lg items-center justify-between">
            <div className="flex items-center">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold">{service.address}</h1>
                    <h2 className="text-sm">{service.description}</h2>
                </div>
                <div className="flex flex-col ml-5 text-sm">
                    <h2>Status : {service.status}</h2>
                    <h2>Landlord : {service.landlord?.user?.firstName} {service.landlord?.user?.lastName}</h2>
                </div>
            </div>
            <Link href={"/properties/" + service.id}>
                <ArrowRight className="cursor-pointer"/>
            </Link>
        </div>
    )
}