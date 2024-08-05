"use client";
import {useEffect, useState} from "react";
import {getPendingProperties, getProperties} from "@/api/services/property-service";
import {Service} from "@/types";
import ServiceCard from "@/app/(protected)/services/ServiceCard";


export default function ServiceList({pending = false}: {pending?: boolean}) {
    const [serviceList, setServiceList] = useState<Service[]>();

    const loadProperties = async () => {
        let newService;
        if (pending){
            newService = await
        }else{
            newService = await
        }
        setServiceList(newService.data)
    }

    useEffect(() => {
        loadProperties().then()
    }, []);


    return (
        <div>
            <h1 className="text-3xl font-bold">Property List</h1>
            <div className="flex flex-col gap-2.5 my-3">
                {serviceList?.map((service: Service) => <ServiceCard key={service.id} service={service}/>)}
            </div>
        </div>
    )
}