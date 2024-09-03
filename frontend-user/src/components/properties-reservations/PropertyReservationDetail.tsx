"use client"
import {useEffect, useRef, useState} from "react";
import {PropertyReservation, PropertyReview} from "@/types";
import {propertiesReservationsService} from "@/api/services/properties-reservations";
import Link from "next/link";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {propertiesService} from "@/api/services/properties";
import {Star} from "lucide-react";
import ReviewEditor from "@/components/review/ReviewEditor";

export interface PropertyReservationDetailProps {
    propertyReservationId: number
}

export const PropertyReservationDetail = ({propertyReservationId}: PropertyReservationDetailProps) => {
    const [propertyReservationFull, setPropertyReservationFull] = useState<PropertyReservation | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [review, setReview] = useState<PropertyReview|null>(null);

    const loadReview = async () => {
        if (!propertyReservationFull?.occupation?.propertyId) return;
        const response = await propertiesService.getMyReviewOnProperty(propertyReservationFull?.occupation?.propertyId)
        setReview(response.data)
    }

    useEffect(() => {
        loadReview().then()
    }, [propertyReservationFull]);

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

    const uploadReview = async (note: number, comment: string): Promise<PropertyReview | undefined> => {
        if (!propertyReservationFull?.occupation?.propertyId) return;
        const response = await propertiesService.createPropertyReview(propertyReservationFull?.occupation?.propertyId, note, comment)
        setReview(response.data)
        return response.data
    }

    return (
        <>
            {propertyReservationFull && propertyReservationFull.occupation ? (
                <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md mt-10">
                    <h1 className="text-3xl font-bold mb-4">Property reservation Details</h1>
                    <h3 className="text-xl mb-2"><strong>Start Date :</strong>
                        <input type={"date"} readOnly={true}
                               value={new Date(propertyReservationFull?.occupation.startDate).toISOString().split("T")[0]}
                               className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </h3>
                    <h3 className="text-xl mb-2"><strong>End Date :</strong>
                        <input type={"date"} readOnly={true}
                               value={new Date(propertyReservationFull?.occupation.endDate).toISOString().split("T")[0]}
                               className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    </h3>
                    <h3 className="text-xl mb-2">
                        <strong>Status: </strong>{propertyReservationFull.status}
                    </h3>
                    <h3 className="text-xl mb-2"><strong>Total Price
                        : </strong>{propertyReservationFull.totalPrice}€</h3>
                    <Link
                        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700"
                        href={`/${propertyReservationFull.occupation.propertyId}`}>
                        <strong>See property</strong>
                    </Link>
                    <ReviewEditor baseReview={review} uploadReview={uploadReview}></ReviewEditor>
                </div>
            ) : (
                <h1 className="text-2xl font-semibold text-center mt-10">Property reservation not Found</h1>
            )}
        </>
    );
}
