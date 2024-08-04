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

    useEffect(() => {
        console.log(propertyList)
    }, [propertyList]);

    return (
        <div>
            <h1>Property List</h1>
            {propertyList?.map((property: Property) => <PropertyCard property={property}/>)}
        </div>
    )
}