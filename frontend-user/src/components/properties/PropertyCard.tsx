"use client"
import {Property} from "@/components/properties/Properties";
import {useRouter} from "next/navigation";
import "./PropertyCard.css"

export interface PropertyCardProps {
    property: Property
}

export const PropertyCard = ({property}: PropertyCardProps) => {
    const router = useRouter();
    const onClickCard = () => {
        router.push(`/properties/${property.id}`);
    }

    return (
        <button className="card" onClick={onClickCard}>
            <h1>Property Details</h1>
            <h3>Adresse: {property.address}</h3><br/>
            <h3>{property.status}</h3><br/>
            <h3>Description</h3>
            <textarea readOnly={true} value={property.description}/><br/>
            <h5>Dernière MAJ : {property.updatedAt}</h5>
        </button>
    )
}
