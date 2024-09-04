
import {ServiceCard} from "@/components/services/ServiceCard";
import {Service} from "@/types";

export interface ServiceListProps {
    services: Service[],
    personal?: boolean
}

export const ServiceList = ({services,personal = false}: ServiceListProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
            {services.map((service: Service) => (
                <ServiceCard key={service.id} service={service} personal={personal}></ServiceCard>
            ))}
        </div>
    )
}
