"use client"

import {PropertyReservation} from "@/types";
import {useRouter} from "next/navigation";

export interface PropertyReservationCardProps {
    propertyReservationFull: PropertyReservation
}

export const PropertyReservationCard = ({propertyReservationFull}: PropertyReservationCardProps) => {
    const router = useRouter();
    const onClickCard = () => {
        router.push(`/properties-reservations/${propertyReservationFull.id}`);
    }

    return (
        <button onClick={onClickCard}
                className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 mt-6 text-left">
            <h1 className="text-2xl font-bold mb-2">Property reservation Details</h1>

            {
                propertyReservationFull.occupation?.startDate &&
                <h3 className="text-lg mb-1">
                    <strong>Start Date :</strong>
                    <input type={"date"} readOnly={true}
                           value={new Date(propertyReservationFull.occupation?.startDate).toISOString().split("T")[0]}
                           className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </h3>
            }
            {
                propertyReservationFull.occupation?.endDate &&
                <h3 className="text-lg mb-1">
                    <input type={"date"} readOnly={true}
                           value={new Date(propertyReservationFull.occupation?.endDate).toISOString().split("T")[0]}
                           className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </h3>
            }
            <h3 className="text-lg mb-1">
                <strong>Status: </strong>{propertyReservationFull.status}
            </h3>
        </button>
    )
}
