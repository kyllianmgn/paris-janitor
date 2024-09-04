"use client";
import {useEffect, useState} from "react";
import {getPendingProperties, getProperties, getPropertiesByLandlordId} from "@/api/services/property-service";
import {Property} from "@/types";
import PropertyCard from "@/components/list/property/PropertyCard";
import Search from "@/components/list/search";
import Pagination from "@/components/list/pagination";

export default function PropertyList({pending = false, landlordId = undefined, query, page}: {pending?: boolean, landlordId?: number, query?: string, page?: number}) {
    const [propertyList, setPropertyList] = useState<Property[]>();
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const loadProperties = async () => {
        let newProperties;
        setLoading(true);
        if (pending){
            newProperties = await getPendingProperties();
        }else if (landlordId !== undefined){
            newProperties = await getPropertiesByLandlordId(landlordId);
        }else{
            newProperties = await getProperties(query, page);
        }
        setLoading(false);
        if (newProperties.count){
            setTotalCount(newProperties.count)
        }else{
            setTotalCount(0)
        }
        setPropertyList(newProperties.data)
    }

    useEffect(() => {
        loadProperties().then()
    }, [query, page]);

    return (
        <div>
            <Search placeholder={"Rechercher Propriétés"}></Search>
            <div className="flex flex-col gap-2.5 my-3">
                {
                    loading ? <h1 className="text-3xl text-center font-bold">Loading Properties...</h1> :
                        propertyList?.length ?
                            propertyList?.map((property: Property) => <PropertyCard key={property.id} property={property}/>)
                            :
                            <h1 className="text-3xl text-center font-bold">No properties found.</h1>
                }
            </div>
            <Pagination count={totalCount} itemsName={"Properties"}></Pagination>
        </div>
    )
}