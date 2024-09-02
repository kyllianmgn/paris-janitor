import {PropertyReservation} from "@/types";

export type ReservationCardMode = "traveler" | "property"

export default function ReservationCard({reservation, mode}: {reservation: PropertyReservation, mode: ReservationCardMode}) {

    const formatDate = (date: Date|undefined) => {
        if (!date) return;
        const newDate = new Date(date);
        return `${newDate.toLocaleDateString("fr")} ${newDate.getHours()}h${newDate.getMinutes()}`;
    }

    const renderCard = () => {
        switch (mode){
            case "traveler":
                return (<>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold">{reservation.occupation?.property?.address}</h1>
                            <h2 className="text-sm">Du {reservation.occupation?.startDate} au {reservation.occupation?.endDate}</h2>
                        </div>
                        <div className="flex flex-col ml-5 text-sm">
                            <h2>Status : {reservation.status}</h2>
                            <h2>Landlord : {reservation.occupation?.property?.landlord?.user?.firstName} {reservation.occupation?.property?.landlord?.user?.lastName}</h2>
                        </div>
                        </>
                )
            case "property":
                return (<>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold">{reservation.traveler?.user?.firstName} {reservation.traveler?.user?.lastName}</h1>
                            <h2 className="text-sm">Du {reservation.occupation?.startDate} au {reservation.occupation?.endDate}</h2>
                        </div>
                        <div className="flex flex-col ml-5 text-sm">
                            <h2>Status : {reservation.status}</h2>
                        </div>
                    </>
                )
            default:
                return (<>
                        <h1>Erreur dans le mode</h1>
                    </>
                )
        }
    }

    return (
        <div className="flex bg-white shadow px-3 py-0.5 rounded-lg items-center justify-between">
            <div className="flex items-center">
                {renderCard()}
            </div>
        </div>
    )
}