
import {ServiceCard} from "@/components/services/ServiceCard";
import {Service} from "@/types";

export interface ServiceListProps {
    services: Service[]
}

export const ServiceList = ({services}: ServiceListProps) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {services.map((service: Service) => (
                <ServiceCard key={service.id} service={service}></ServiceCard>
            ))}
        </div>
    )
}