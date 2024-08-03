"use client"
import {useEffect, useState} from "react";
import {Property} from "../Properties";
import {getPropertyById} from "@/services/properties";
import "./PropertyDetail.css"

export interface PropertyDetailProps {
    propertyId: string
}

export const PropertyDetail = ({propertyId}: PropertyDetailProps) => {
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadProperty = async () => {
            if (propertyId) {
                const res = await getPropertyById(propertyId);
                setProperty(res.data);
                setLoading(false);
            }
        };
        loadProperty().then();
    }, [propertyId]);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <>
            {property ? (
                <div className="card">
                    <h1>Property Details</h1>
                    <h3>Adresse: {property.address}</h3><br/>
                    <h3>{property.status}</h3><br/>
                    <h3>Description</h3>
                    <textarea readOnly={true} value={property.description}/><br/>
                    <h5>Dernière MAJ : {property.updatedAt}</h5>
                </div>
            ) : (
                <h1>Property not Found</h1>
            )}
        </>
    );
}