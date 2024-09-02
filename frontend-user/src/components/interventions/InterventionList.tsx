
import {ServiceCard} from "@/components/services/ServiceCard";
import {Intervention, Service} from "@/types";
import {InterventionCard} from "@/components/interventions/InterventionCard";

export interface ServiceListProps {
    interventions: Intervention[],
    personal?: boolean
}

export const InterventionList = ({interventions,personal = false}: ServiceListProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {interventions.map((intervention: Intervention) => (
                <InterventionCard key={intervention.id} intervention={intervention}></InterventionCard>
            ))}
        </div>
    )
}
