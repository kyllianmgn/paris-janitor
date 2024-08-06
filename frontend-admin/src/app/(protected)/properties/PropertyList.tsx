"use client";
import {useEffect, useState} from "react";
import {getPendingProperties, getProperties} from "@/api/services/property-service";
import {Property} from "@/types";
import PropertyCard from "@/app/(protected)/properties/PropertyCard";


export default function PropertyList({pending = false}: {pending?: boolean}) {
    const [propertyList, setPropertyList] = useState<Property[]>();

    const loadProperties = async () => {
        let newProperties;
        if (pending){
            newProperties = await getPendingProperties();
        }else{
            newProperties = await getProperties();
        }
        setPropertyList(newProperties.data)
    }

    useEffect(() => {
        loadProperties().then()
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold">Property List</h1>
            <div className="flex flex-col gap-2.5 my-3">
                {propertyList?.map((property: Property) => <PropertyCard key={property.id} property={property}/>)}
            </div>
        </div>
    )
}