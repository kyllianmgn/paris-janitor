"use client";
import {useEffect, useState} from "react";
import {ServiceProvider} from "@/types";
import {getServiceProviders} from "@/api/services/service-provider-service";
import ServiceProviderCard from "@/app/(protected)/service-providers/ServiceProviderCard";


export default function ServiceProviderList({pending = false}: {pending?: boolean}) {
    const [serviceList, setServiceList] = useState<ServiceProvider[]>();

    const loadProperties = async () => {
        let newService;
        newService = await getServiceProviders()
        setServiceList(newService.data)
    }

    useEffect(() => {
        loadProperties().then()
    }, []);


    return (
        <div>
            <div className="flex flex-col gap-2.5 my-3">
                {serviceList?.map((serviceProvider: ServiceProvider) => <ServiceProviderCard key={serviceProvider.id} serviceProvider={serviceProvider}/>)}
            </div>
        </div>
    )
}