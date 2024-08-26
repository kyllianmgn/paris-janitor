"use client"
import {getService, updateService} from "@/api/services/service-service";
import {ChangeEvent, useEffect, useState} from "react";
import {Service} from "@/types";
import {Undo2} from "lucide-react";
import {Button} from "@/components/ui/button";
import ReservationList from "@/components/list/reservation/ReservationList";
import InterventionList from "@/components/list/intervention/InterventionList";

export const ServiceDetails = ({id, query, page}: { id: number, query?: string, page?: number }) => {
    const [service, setService] = useState<Service | null>(null);

    const loadServices = async () => {
        const service = await getService(id)
        setService(service.data)
    }

    const applyChanges = async () => {
        if (!service) return
        const response = await updateService({...service})
        setService(response.data)
    }

    useEffect(() => {
        loadServices().then()
    });

    return (
        <div>
            {
                service ?
                    <>
                        <h1 className="text-xl font-bold">{service.name}</h1>
                        <h2 className="text-lg">{service.description}</h2>
                        <h2 className="text-lg">Par {service.provider?.user?.firstName} {service.provider?.user?.lastName}</h2>
                        <Button onClick={applyChanges}>Appliquer</Button>
                        <hr className="my-3"/>
                        <InterventionList query={query} page={page} serviceId={service.id}></InterventionList>
                    </>
                    :
                    <>
                        <h1>Service Not Found</h1>
                    </>
            }
        </div>
    )
}