"use client"
import {getService, updateServiceStatus} from "@/api/services/service-service";
import {ChangeEvent, useEffect, useState} from "react";
import {Service, ServiceStatus} from "@/types";
import {Undo2} from "lucide-react";
import {Button} from "@/components/ui/button";

export const ServiceDetails = ({id}: { id: number }) => {
    const [service, setService] = useState<Service | null>(null);
    const [serviceStatus, setServiceStatus] = useState<ServiceStatus>(ServiceStatus.PENDING)

    const loadServices = async () => {
        const service = await getService(id)
        setService(service.data)
        setServiceStatus(service.data.status)
    }

    const serviceStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setServiceStatus(event.target.value as ServiceStatus)
    }

    const revertServiceStatus = () => {
        if (!service) return
        setServiceStatus(service.status)
    }

    const applyChanges = async () => {
        if (!service) return
        const response = await updateServiceStatus({...service, status: serviceStatus})
        setService(response.data)
        setServiceStatus(response.data.status)
    }

    useEffect(() => {
        loadServices().then()
    }, []);

    return (
        <div>
            {
                service ?
                    <>
                        <h1 className="text-xl font-bold">{service.address}</h1>
                        <h2 className="text-lg">{service.description}</h2>
                        <div className="text-lg flex">Status :
                            <select className="cursor-pointer" onChange={serviceStatusChange} value={serviceStatus}>
                                <option className="cursor-pointer" value={ServiceStatus.PENDING}>PENDING</option>
                                <option className="cursor-pointer" value={ServiceStatus.APPROVED}>APPROVED</option>
                                <option className="cursor-pointer" value={ServiceStatus.REJECTED}>REJECTED</option>
                            </select>
                            { service.status.toString() !== serviceStatus && <Undo2 onClick={revertServiceStatus} className="cursor-pointer"/>}
                        </div>
                        <h2 className="text-lg">Landlord : {service.landlord?.user?.firstName} {service.landlord?.user?.lastName}</h2>
                        <Button onClick={applyChanges}>Appliquer</Button>
                    </>
                    :
                    <>
                        <h1>Service Not Found</h1>
                    </>
            }

        </div>
    )
}