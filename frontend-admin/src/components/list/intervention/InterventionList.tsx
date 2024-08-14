"use client";
import {useEffect, useState} from "react";
import InterventionCard from "@/components/list/intervention/InterventionCard";
import Search from "@/components/list/search";
import Pagination from "@/components/list/pagination";
import {getInterventionByServiceId} from "@/api/services/service-service";
import {Intervention} from "@/types";

export default function InterventionList({serviceId, query, page}: {serviceId: number, query?: string, page?: number}) {
    const [interventionList, setInterventionList] = useState<Intervention[]>();
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const loadInterventions = async () => {
        let newInterventions;
        setLoading(true);
        newInterventions = await getInterventionByServiceId(serviceId);
        setLoading(false);
        if (newInterventions.count){
            setTotalCount(newInterventions.count)
        }else{
            setTotalCount(0)
        }
        setInterventionList(newInterventions.data)
    }

    useEffect(() => {
        loadInterventions().then()
    }, [query, page]);

    return (
        <div>
            <Search placeholder={"Rechercher Propriétés"}></Search>
            <div className="flex flex-col gap-2.5 my-3">
                {
                    loading ? <h1 className="text-3xl text-center font-bold">Loading Interventions...</h1> :
                        interventionList?.length ?
                            interventionList?.map((intervention: Intervention) => <InterventionCard key={intervention.id} intervention={intervention}/>)
                            :
                            <h1 className="text-3xl text-center font-bold">No interventions found.</h1>
                }
            </div>
            <Pagination count={totalCount} itemsName={"Interventions"}></Pagination>
        </div>
    )
}