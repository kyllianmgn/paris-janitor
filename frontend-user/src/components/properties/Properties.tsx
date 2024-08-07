"use client"
import {useEffect, useState} from "react";
import {propertiesService} from "@/api/services/properties";
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
        const res = await propertiesService.getProperties();
        setPropertyList(res.data);
    };

    useEffect(() => {
        loadProperties().then();
    }, []);

    return (
        <>
            <div className="text-center my-8">
                <h1 className="text-4xl font-bold mb-4">Properties</h1>
                <p className="text-lg text-gray-600">Properties List</p>
            </div>
            <PropertyList properties={propertyList}></PropertyList>
        </>
    );
}
