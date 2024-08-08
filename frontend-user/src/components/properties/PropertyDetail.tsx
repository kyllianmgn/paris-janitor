"use client"
import {useEffect, useState} from "react";
import {Property} from "./Properties";
import {propertiesService} from "@/api/services/properties";

export interface PropertyDetailProps {
    propertyId: number
}

export const PropertyDetail = ({propertyId}: PropertyDetailProps) => {
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const loadProperty = async () => {
        if (propertyId) {
            const res = await propertiesService.getPropertyById(propertyId);
            setProperty(res.data);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProperty().then();
    }, [loadProperty, propertyId]);

    if (loading) {
        return <h1 className="text-2xl font-semibold text-center mt-10">Loading...</h1>;
    }

    return (
        <>
            {property ? (
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
                    <h1 className="text-3xl font-bold mb-4">Property Details</h1>
                    <h3 className="text-xl mb-2"><strong>Adresse:</strong> {property.address}</h3>
                    <h3 className="text-xl mb-2"><strong>Status:</strong> {property.status}</h3>
                    <h3 className="text-xl font-semibold mb-2">Description</h3>
                    <textarea
                        readOnly
                        value={property.description}
                        className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <h5 className="text-sm text-gray-500">Dernière MAJ : {property.updatedAt}</h5>
                </div>
            ) : (
                <h1 className="text-2xl font-semibold text-center mt-10">Property not Found</h1>
            )}
        </>
    );
}
