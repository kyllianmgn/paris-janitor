"use client"
import {getServiceProvider, updateServiceProviderStatus} from "@/api/services/service-provider-service";
import {ChangeEvent, useEffect, useState} from "react";
import {Service, ServiceProvider, ServiceProviderStatus} from "@/types";
import {Undo2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {getServiceProviders} from "@/api/services/service-provider-service";

export const ServiceProviderDetails = ({id}: { id: number }) => {
    const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
    const [serviceStatus, setServiceStatus] = useState<ServiceProviderStatus>(ServiceProviderStatus.PENDING)

    const loadServices = async () => {
        const service = await getServiceProvider(id)
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
                        <h1 className="text-xl font-bold">{serviceProvider.user?.firstName}</h1>
                        <h2 className="text-lg">Landlord : {serviceProvider.user?.firstName} {serviceProvider.user?.lastName}</h2>
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