"use client"
import {getServiceProvider, updateServiceProviderStatus} from "@/api/services/service-provider-service";
import {ChangeEvent, useEffect, useState} from "react";
import {PropertyStatus, ServiceProvider, ServiceProviderStatus} from "@/types";
import {Undo2} from "lucide-react";
import {Button} from "@/components/ui/button";

export const ServiceProviderDetails = ({id}: { id: number }) => {
    const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
    const [serviceStatus, setServiceStatus] = useState<ServiceProviderStatus>(ServiceProviderStatus.PENDING)

    const loadServices = async () => {
        const service = await getServiceProvider(id)
        console.log(service.data)
        setServiceProvider(service.data)
        setServiceStatus(service.data.status)
    }

    const serviceStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setServiceStatus(event.target.value as ServiceProviderStatus)
    }

    const revertServiceStatus = () => {
        if (!serviceProvider) return
        setServiceStatus(serviceProvider.status)
    }

    const applyChanges = async () => {
        if (!serviceProvider) return
        const response = await updateServiceProviderStatus({...serviceProvider, status: serviceStatus})
        setServiceProvider(response.data)
        setServiceStatus(response.data.status)
    }

    useEffect(() => {
        loadServices().then()
    }, []);

    return (
        <div>
            {
                serviceProvider ?
                    <>
                        <h1 className="text-xl font-bold">{serviceProvider.user?.firstName} {serviceProvider.user?.lastName}</h1>
                        <div className="text-lg flex">Status :
                            <select className="cursor-pointer" onChange={serviceStatusChange} value={serviceStatus}>
                                <option className="cursor-pointer" value={ServiceProviderStatus.PENDING}>PENDING</option>
                                <option className="cursor-pointer" value={ServiceProviderStatus.ACCEPTED}>ACCEPTED</option>
                                <option className="cursor-pointer" value={ServiceProviderStatus.REFUSED}>REFUSED</option>
                            </select>
                            {serviceProvider?.status.toString() !== serviceStatus &&
                                <Undo2 onClick={revertServiceStatus} className="cursor-pointer"/>}
                        </div>
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