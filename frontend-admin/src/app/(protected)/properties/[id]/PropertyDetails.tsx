"use client"
import {getProperty, updatePropertyStatus} from "@/api/services/property-service";
import {ChangeEvent, useEffect, useState} from "react";
import {Property, PropertyStatus} from "@/types";
import {Undo2} from "lucide-react";
import {Button} from "@/components/ui/button";

export const PropertyDetails = ({id}: { id: number }) => {
    const [property, setProperty] = useState<Property | null>(null);
    const [propertyStatus, setPropertyStatus] = useState<PropertyStatus>(PropertyStatus.PENDING)

    const loadProperties = async () => {
        const property = await getProperty(id)
        setProperty(property.data)
        setPropertyStatus(property.data.status)
    }

    const propertyStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setPropertyStatus(event.target.value as PropertyStatus)
    }

    const revertPropertyStatus = () => {
        if (!property) return
        setPropertyStatus(property.status)
    }

    const applyChanges = async () => {
        if (!property) return
        const response = await updatePropertyStatus({...property, status: propertyStatus})
        setProperty(response.data)
        setPropertyStatus(response.data.status)
    }

    useEffect(() => {
        loadProperties().then()
    }, []);

    return (
        <div>
            {
                property ?
                    <>
                        <h1 className="text-xl font-bold">{property.address}</h1>
                        <h2 className="text-lg">{property.description}</h2>
                        <div className="text-lg flex">Status :
                            <select className="cursor-pointer" onChange={propertyStatusChange} value={propertyStatus}>
                                <option className="cursor-pointer" value={PropertyStatus.PENDING}>PENDING</option>
                                <option className="cursor-pointer" value={PropertyStatus.APPROVED}>APPROVED</option>
                                <option className="cursor-pointer" value={PropertyStatus.REJECTED}>REJECTED</option>
                            </select>
                            { property.status.toString() !== propertyStatus && <Undo2 onClick={revertPropertyStatus} className="cursor-pointer"/>}
                        </div>
                        <h2 className="text-lg">Landlord : {property.landlord?.user?.firstName} {property.landlord?.user?.lastName}</h2>
                        <Button onClick={applyChanges}>Appliquer</Button>
                    </>
                    :
                    <>
                        <h1>Property Not Found</h1>
                    </>
            }

        </div>
    )
}