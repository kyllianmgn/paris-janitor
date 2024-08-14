"use client";
import {useEffect, useState} from "react";
import {getReservationsByUser, getReservationsByProperty} from "@/api/services/occupation-service";
import {PropertyReservation} from "@/types";
import ReservationCard, {ReservationCardMode} from "@/components/list/reservation/ReservationCard";
import Search from "@/components/list/search";
import Pagination from "@/components/list/pagination";

export default function ReservationList({travelerId = undefined, propertyId = undefined, query, page, mode}: {landlordId?: number, query?: string, page?: number, travelerId?: number, propertyId?: number, mode: ReservationCardMode}) {
    const [reservationList, setReservationList] = useState<PropertyReservation[]>();
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const loadReservations = async () => {
        let newReservations;
        setLoading(true);
        if (mode === "property"){
            if (!propertyId){
                return;
            }
            newReservations = await getReservationsByProperty(propertyId);
        }else if (mode === "traveler"){
            if (!travelerId){
                return;
            }
            newReservations = await getReservationsByUser(travelerId, query, page);
        }else {
            return;
        }
        setLoading(false);
        if (newReservations.count){
            setTotalCount(newReservations.count)
        }else{
            setTotalCount(0)
        }
        setReservationList(newReservations.data)
    }

    useEffect(() => {
        loadReservations().then()
    }, [query, page]);

    return (
        <div>
            <Search placeholder={"Rechercher Propriétés"}></Search>
            <div className="flex flex-col gap-2.5 my-3">
                {
                    loading ? <h1 className="text-3xl text-center font-bold">Loading Reservations...</h1> :
                        reservationList?.length ?
                            reservationList?.map((reservation: PropertyReservation) => <ReservationCard key={reservation.id} reservation={reservation} mode={mode}/>)
                            :
                            <h1 className="text-3xl text-center font-bold">No reservations found.</h1>
                }
            </div>
            <Pagination count={totalCount} itemsName={"Reservations"}></Pagination>
        </div>
    )
}