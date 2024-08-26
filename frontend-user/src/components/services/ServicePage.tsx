"use client"
import React, {useEffect, useState} from "react";
import {Property, Service} from "@/types";
import {propertiesService} from "@/api/services/properties";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowLeft, Option} from "lucide-react";
import {useRouter} from "next/navigation";
import {servicesService} from "@/api/services/services";
import {ServiceInterventionForm} from "@/components/services/ServiceInterventionForm";
import {Select} from "@/components/ui/select";
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {propertiesReservationsService} from "@/api/services/properties-reservations";

export interface ServiceDetailProps {
    serviceId: number
}

export const ServicePage = ({serviceId}: ServiceDetailProps) => {
    const [service, setService] = useState<Service | null>(null);
    const [properties, setProperties] = useState<Property[] | null>(null);
    const role = useSelector((state: RootState) => state.auth.role);
    const user = useSelector((state: RootState) => state.auth.user);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    const loadService = async () => {
        if (serviceId) {
            const res = await servicesService.getServiceById(serviceId);
            setService(res.data);
            setLoading(false);
        }
    };

    const loadProperties = async () => {
        let newProperties: Property[] = [];
        if (role == "LANDLORD"){
            const response = await propertiesService.getMyProperties()
            newProperties = response.data
        }else if (role == "TRAVELER"){
            const response = await propertiesReservationsService.getMyFutureReservations()
            let properties = response.data.map((property) => {
                    return property.occupation?.property
            })
            properties = properties.filter((property) => property !== undefined)
            newProperties = properties as Property[]
        }
        setProperties(newProperties)
    }

    useEffect(() => {
        loadService().then();
        loadProperties().then();
    }, [serviceId]);

    const handleGoBack = () => {
        router.back();
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!service) {
        return <div className="text-center mt-10">Service not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Service Details</h1>
                <div className="space-x-2">
                    <Button
                        onClick={handleGoBack}
                        variant="ghost"
                        className="mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4"/> Back
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><strong>Name:</strong> {service.name}</p>
                        <p><strong>Price:</strong> {service.basePrice}</p>
                        <p><strong>Nom du prestataires :</strong> {service.provider?.user?.firstName} {service.provider?.user?.lastName} </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{service.description}</p>
                    </CardContent>
                </Card>

                {user && !properties &&
                    <Card>
                        <CardHeader>
                            <CardTitle>Reserve</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            {role == "LANDLORD" && "You don't have any properties. Service reservation is locked"}
                            {role == "TRAVELER" && "You don't have any future reservations. Service reservation is locked"}
                        </CardContent>
                    </Card>
                }
                {user && properties &&
                    <Card>
                        <CardHeader>
                            <CardTitle>Reserve</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <ServiceInterventionForm serviceId={serviceId} price={service.basePrice} serviceType={service.type} properties={properties}></ServiceInterventionForm>
                        </CardContent>
                    </Card>
                }

            </div>
        </div>
    );
};
