import {PropertyReservation} from "@/types";

export type ReservationCardMode = "traveler" | "property"

export default function ReservationCard({reservation, mode}: {reservation: PropertyReservation, mode: ReservationCardMode}) {

    const renderCard = () => {
        switch (mode){
            case "traveler":
                return (<>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold">{reservation.occupation?.property?.address}</h1>
                            <h2 className="text-sm">Du {reservation.occupation?.startDate.toDateString()} au {reservation.occupation?.endDate.toDateString()}</h2>
                        </div>
                        <div className="flex flex-col ml-5 text-sm">
                            <h2>Status : {reservation.status}</h2>
                            <h2>Landlord : {reservation.occupation?.property?.landlord?.user?.firstName} {reservation.occupation?.property?.landlord?.user?.lastName}</h2>
                        </div>
                        </>
                )
                break;
            case "property":
                return (<>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold">{reservation.traveler?.user?.firstName} {reservation.traveler?.user?.lastName}</h1>
                            <h2 className="text-sm">Du {reservation.occupation?.startDate.toDateString()} au {reservation.occupation?.endDate.toDateString()}</h2>
                        </div>
                        <div className="flex flex-col ml-5 text-sm">
                            <h2>Status : {reservation.status}</h2>
                        </div>
                    </>
                )
                break;
            default:
                return (<>
                        <h1>Erreur dans le mode</h1>
                    </>
                )
                break;
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