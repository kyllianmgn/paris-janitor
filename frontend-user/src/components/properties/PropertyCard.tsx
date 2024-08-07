"use client"
import {Property} from "@/components/properties/Properties";
import {useRouter} from "next/navigation";

export interface PropertyCardProps {
    property: Property
}

export const PropertyCard = ({property}: PropertyCardProps) => {
    const router = useRouter();
    const onClickCard = () => {
        router.push(`/properties/${property.id}`);
    }

    return (
        <button onClick={onClickCard}
                className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mt-6 text-left">
            <h1 className="text-2xl font-bold mb-2">Property Details</h1>
            <h3 className="text-lg mb-1"><strong>Adresse:</strong> {property.address}</h3>
            <h3 className="text-lg mb-1"><strong>Status:</strong> {property.status}</h3>
            <h3 className="text-lg font-semibold mt-3 mb-2">Description</h3>
            <textarea
                readOnly
                value={property.description}
                className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <h5 className="text-sm text-gray-500">Dernière MAJ : {property.updatedAt}</h5>
        </button>
    )
}
