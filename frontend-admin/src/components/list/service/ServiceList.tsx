"use client";
import {useEffect, useState} from "react";
import {Service, ServiceProvider} from "@/types";
import {getPendingServiceProviders, getServiceProviders} from "@/api/services/service-provider-service";
import ServiceProviderCard from "@/components/list/service-provider/ServiceProviderCard";
import Search from "@/components/list/search";
import Pagination from "@/components/list/pagination";
import ServiceCard from "@/components/list/service/ServiceCard";
import {getServices, getServicesFromProvider} from "@/api/services/service-service";

export default function ServiceList({providerId,query, page}: {providerId?: number, query?: string, page?: number}) {
    const [serviceList, setServiceList] = useState<Service[]>();
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const loadProviders = async () => {
        let newService;
        setLoading(true);
        if (providerId){
            newService = await getServicesFromProvider(providerId ,query, page)
        }else{
            newService = await getServices(query, page)
        }
        setLoading(false);
        setServiceList(newService.data)
        if (newService.count){
            setTotalCount(newService.count)
        }else{
            setTotalCount(0)
        }
    }

    useEffect(() => {
        loadProviders().then()
    }, [query, page]);


    return (
        <div>
            <Search placeholder={"Rechercher Prestataires"}></Search>

            <div className="flex flex-col gap-2.5 my-3">
                {
                    loading ? <h1 className="text-3xl text-center font-bold">Loading Services...</h1> :
                        serviceList?.length ?
                            serviceList?.map((service: Service) => <ServiceCard key={service.id} service={service}/>)
                            :
                            <h1 className="text-3xl text-center font-bold">No services found.</h1>
                }
            </div>
            <Pagination count={totalCount} itemsName={"Users"}></Pagination>
        </div>
    )
}