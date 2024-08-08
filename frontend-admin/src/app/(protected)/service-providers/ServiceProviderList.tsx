"use client";
import {useEffect, useState} from "react";
import {ServiceProvider, User} from "@/types";
import {getServiceProviders} from "@/api/services/service-provider-service";
import ServiceProviderCard from "@/app/(protected)/service-providers/ServiceProviderCard";
import Search from "@/components/list/search";
import Pagination from "@/components/list/pagination";
import UserCard from "@/app/(protected)/users/UserCard";


export default function ServiceProviderList({pending = false,query, page}: {pending?: boolean, query?: string, page?: number}) {
    const [serviceList, setServiceList] = useState<ServiceProvider[]>();
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const loadProviders = async () => {
        let newService;
        setLoading(true);
        newService = await getServiceProviders(query, page)
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
                    loading ? <h1 className="text-3xl text-center font-bold">Loading Service Providers...</h1> :
                        serviceList?.length ?
                            serviceList?.map((serviceProvider: ServiceProvider) => <ServiceProviderCard key={serviceProvider.id} serviceProvider={serviceProvider}/>)
                            :
                            <h1 className="text-3xl text-center font-bold">No service providers found.</h1>
                }
            </div>
            <Pagination count={totalCount} itemsName={"Users"}></Pagination>
        </div>
    )
}