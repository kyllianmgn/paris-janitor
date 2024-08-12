"use client"
import {useEffect, useState} from "react";
import {PropertyReservationFull} from "@/components/properties-reservations/PropertiesReservations";
import {propertiesReservationsService} from "@/api/services/properties-reservations";

export interface PropertyReservationDetailProps {
    propertyReservationId: number
}

export const PropertyReservationDetail = ({propertyReservationId}: PropertyReservationDetailProps) => {
    const [propertyReservationFull, setPropertyReservationFull] = useState<PropertyReservationFull | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadPropertyReservationFull = async () => {
            if (propertyReservationId) {
                const res = await propertiesReservationsService.getPropertyReservationFullById(propertyReservationId);
                setPropertyReservationFull(res.data);
            }
        };

        loadPropertyReservationFull().then();
        setLoading(false);
    }, [propertyReservationId]);

    if (loading) {
        return <h1 className="text-2xl font-semibold text-center mt-10">Loading...</h1>;
    }

    return (
        <>
            {propertyReservationFull ? (
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
                    <h1 className="text-3xl font-bold mb-4">Property reservation Details</h1>
                    <h3 className="text-xl mb-2"><strong>Start Date :</strong>
                        <input type={"date"} readOnly={true}
                               value={new Date(propertyReservationFull.occupation.startDate).toISOString().split("T")[0]}
                               className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </h3>
                    <h3 className="text-xl mb-2"><strong>End Date :</strong>
                        <input type={"date"} readOnly={true}
                               value={new Date(propertyReservationFull.occupation.endDate).toISOString().split("T")[0]}
                               className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </h3>
                    <h3 className="text-xl mb-2">
                        <strong>Status: </strong>{propertyReservationFull.status}
                    </h3>
                    <h3 className="text-xl mb-2"><strong>Total Price
                        : </strong>{propertyReservationFull.totalPrice}€</h3>
                    <a className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700"
                       href={`http://localhost:3001/properties/${propertyReservationFull.occupation.propertyId}`}>
                        <strong>See property</strong>
                    </a>
                </div>
            ) : (
                <h1 className="text-2xl font-semibold text-center mt-10">Property reservation not Found</h1>
            )}
        </>
    );
}
