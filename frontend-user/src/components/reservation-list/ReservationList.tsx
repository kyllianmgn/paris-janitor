"use client";
import {useEffect, useState} from "react";
import {PropertyReservation} from "@/types";
import Search from "@/components/ui/search";
import Pagination from "@/components/ui/pagination";
import ReservationCard, {ReservationCardMode} from "@/components/reservation-list/ReservationCard";
import {propertiesReservationsService} from "@/api/services/properties-reservations";

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
            newReservations = await propertiesReservationsService.getPropertiesReservationsFullByPropertyId(propertyId)
        }else if (mode === "traveler"){
            if (!travelerId){
                return;
            }
            newReservations = await propertiesReservationsService.getMyReservationsAsUser()
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
            {reservationList && reservationList?.length > 0 &&
                <>
                    <Search placeholder={"Rechercher Reservation"}></Search>
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
                </>
            }
            {reservationList && reservationList?.length <= 0 && <h1>Pas de réservations pour cette propriétés</h1>}
        </div>
    )
}