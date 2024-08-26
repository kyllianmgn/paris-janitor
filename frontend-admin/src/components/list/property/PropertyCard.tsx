import {Property} from "@/types";
import {ArrowRight} from "lucide-react";
import Link from "next/link";

export default function PropertyCard({property}: {property: Property}){
    return (
        <div className="flex bg-white shadow px-3 py-0.5 rounded-lg items-center justify-between">
            <div className="flex items-center">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold">{property.address}</h1>
                    <h2 className="text-sm">{property.description}</h2>
                </div>
                <div className="flex flex-col ml-5 text-sm">
                    <h2>Status : {property.status}</h2>
                    <h2>Landlord : {property.landlord?.user?.firstName} {property.landlord?.user?.lastName}</h2>
                </div>
            </div>
            <Link href={"/properties/" + property.id}>
                <ArrowRight className="cursor-pointer"/>
            </Link>
        </div>
    )
}