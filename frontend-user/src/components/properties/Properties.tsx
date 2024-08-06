"use client"
import {useEffect, useState} from "react";
import {getProperties} from "@/api/services/properties";
import {PropertyList} from "@/components/properties/PropertyList";

export interface Property {
    id?: number;
    landlordId: number;
    address: string;
    description: string;
    status: PropertyStatus;
    createdAt: string;
    updatedAt: string;
}

export enum PropertyStatus {
    PENDING,
    APPROVED,
    REJECTED,
}

export const Properties = () => {
    const [propertyList, setPropertyList] = useState<Property[]>([]);

    const loadProperties = async () => {
        const res = await getProperties();
        setPropertyList(res.data);
    };

    useEffect(() => {
        loadProperties().then();
    }, []);

    return (
        <>
            <div>
                <h1>Properties</h1>
                <p>Properties List</p>
            </div>
            <PropertyList properties={propertyList}></PropertyList>
        </>
    );
}
