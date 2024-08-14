"use client"
import {getServiceProvider, updateServiceProviderStatus} from "@/api/services/service-provider-service";
import {ChangeEvent, useEffect, useState} from "react";
import {PropertyStatus, ServiceProvider, ServiceProviderStatus} from "@/types";
import {Check, Undo2, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import ServiceList from "@/components/list/service/ServiceList";
import {updatePropertyStatus} from "@/api/services/property-service";

export const ServiceProviderDetails = ({id, query, page}: { id: number , query?: string, page?: number}) => {
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

    const approveServiceProvider = async () => {
        if (!serviceProvider) return
        const response = await updateServiceProviderStatus({...serviceProvider, status: ServiceProviderStatus.ACCEPTED})
        setServiceProvider(response.data)
        setServiceStatus(response.data.status)
    }

    const rejectServiceProvider = async () => {
        if (!serviceProvider) return
        const response = await updateServiceProviderStatus({...serviceProvider, status: ServiceProviderStatus.REFUSED})
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
                        {serviceProvider.status === ServiceProviderStatus.PENDING ?
                            <h1 className="text-lg">Status : PENDING</h1>
                            :
                            <div className="text-lg flex">Status :
                                <select className="cursor-pointer" onChange={serviceStatusChange}
                                        value={serviceStatus}>
                                    <option className="cursor-pointer" value={ServiceProviderStatus.PENDING}>PENDING</option>
                                    <option className="cursor-pointer" value={ServiceProviderStatus.ACCEPTED}>ACCEPTED</option>
                                    <option className="cursor-pointer" value={ServiceProviderStatus.REFUSED}>REFUSED</option>
                                </select>
                                {serviceProvider.status.toString() !== serviceStatus &&
                                    <Undo2 onClick={revertServiceStatus} className="cursor-pointer"/>}
                            </div>
                        }
                        {serviceProvider.status === ServiceProviderStatus.PENDING ?
                            <>
                                <Button onClick={approveServiceProvider} variant={"validation"}><Check/></Button>
                                <Button onClick={rejectServiceProvider} variant={"destructive"}><X/></Button>
                            </>
                            :
                            <Button onClick={applyChanges}>Appliquer</Button>
                        }
                        <hr className="my-3"/>
                        <ServiceList providerId={serviceProvider.id} query={query} page={page} ></ServiceList>
                    </>
                    :
                    <>
                        <h1>Service Not Found</h1>
                    </>
            }

        </div>
    )
}