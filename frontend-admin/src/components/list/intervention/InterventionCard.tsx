import {Intervention} from "@/types";

export default function InterventionCard({intervention}: {intervention: Intervention}) {

    const formatDate = (date: Date|undefined) => {
        if (!date) return;
        const newDate = new Date(date);
        return `${newDate.toLocaleDateString("fr")} ${newDate.getHours()}h${newDate.getMinutes()}`;
    }

    return (
        <div className="flex bg-white shadow px-3 py-0.5 rounded-lg items-center justify-between">
            <div className="flex items-center">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold">{intervention.propertyOccupation?.property?.address}</h1>
                    <h2 className="text-sm">Du {formatDate(intervention.propertyOccupation?.startDate)} au {formatDate(intervention.propertyOccupation?.endDate)}</h2>
                </div>
                <div className="flex flex-col ml-5 text-sm">
                    <h2>Status : {intervention.status}</h2>
                    <h2>Landlord : {intervention.service?.provider?.user?.firstName} {intervention.service?.provider?.user?.firstName}</h2>
                </div>
            </div>
        </div>
    )
}