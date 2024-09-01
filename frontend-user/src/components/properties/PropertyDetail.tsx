"use client"
import React, {useEffect, useState} from "react";
import {Property, PropertyStatus, Service} from "@/types";
import {propertiesService} from "@/api/services/properties";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Edit, Calendar, Settings, ArrowLeft} from "lucide-react";
import {useRouter} from "next/navigation";
import {servicesService} from "@/api/services/services";
import {Input} from "@/components/ui/input";
import {Simulate} from "react-dom/test-utils";

export interface PropertyDetailProps {
    propertyId: number
}

interface ServiceAvailability { state: boolean, reason: string }

export const PropertyDetail = ({propertyId}: PropertyDetailProps) => {
    const [property, setProperty] = useState<Property | null>(null);
    const [propertyServicesTab, setPropertyServicesTab] = useState<boolean>(false);
    const [availableServices, setAvailableServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service|null>(null);
    const [serviceInterventionDate, setServiceInterventionDate] = useState<string>("");
    const [availability, setAvailability] = useState<ServiceAvailability>({state: false, reason: ""});
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    let date = new Date();
    date.setDate(date.getDate() + 1);

    const loadProperty = async () => {
        if (propertyId) {
            const res = await propertiesService.getPropertyById(propertyId);
            setProperty(res.data);
            setLoading(false);
        }
    };

    const toggleServices = async () => {
        setPropertyServicesTab(prevState => !prevState);
    }

    const loadAvailability = async () => {
        if (!serviceInterventionDate || !selectedService) return;
        const SPResponse = await servicesService.getProviderAvailabilityFromService(selectedService?.id, serviceInterventionDate)
        const propertyResponse = await propertiesService.getPropertyAvailability(propertyId, serviceInterventionDate)
        if (SPResponse.data & propertyResponse.data){
            setAvailability({state: true, reason: "All Good"});
        }else if (!SPResponse.data){
            setAvailability({state: false, reason: "Service Provider Not Available at selected date."});
        } else if (!propertyResponse.data){
            setAvailability({state: false, reason: "Property Unavailable at selected date."});
        }
        console.log(SPResponse, propertyResponse)
    }

    useEffect(() => {
        loadAvailability().then()
    }, [serviceInterventionDate]);

    const loadServices = async () => {
        const res = await servicesService.getAvailableInterventionServices();
        console.log(res)
        setAvailableServices(res.data)
    }

    useEffect(() => {
        if (propertyServicesTab){
            loadServices().then()
        }
    }, [propertyServicesTab]);

    useEffect(() => {
        loadProperty().then();
    }, [propertyId]);

    const handleGoBack = () => {
        router.push('/my-properties');
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!property) {
        return <div className="text-center mt-10">Property not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Property Details</h1>
                <div className="space-x-2">
                    <Button
                        onClick={handleGoBack}
                        variant="ghost"
                        className="mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4"/> Back
                    </Button>
                    <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4"/>
                        Edit Property
                    </Button>
                    <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4"/>
                        Manage Reservations
                    </Button>
                    <Button onClick={toggleServices} variant="outline">
                        <Settings className="mr-2 h-4 w-4"/>
                        Property Services
                    </Button>

                </div>
            </div>

            {!propertyServicesTab &&
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p><strong>Address:</strong> {property.address}</p>
                            <p><strong>City:</strong> {property.city}</p>
                            <p><strong>Country:</strong> {property.country}</p>
                            <p><strong>Postal Code:</strong> {property.postalCode}</p>
                            <p><strong>Price per night:</strong> {property.pricePerNight}</p>
                            <p><strong>Status:</strong>
                                <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    property.status === PropertyStatus.APPROVED ? 'bg-green-100 text-green-800' :
                                        property.status === PropertyStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                }`}>
                                {property.status}
                            </span>
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{property.description}</p>
                        </CardContent>
                    </Card>

                    {/* Placeholder for future information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Additional Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Additional property information will be displayed here.</p>
                        </CardContent>
                    </Card>

                    {/* Placeholder for statistics or other relevant information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Property Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Property statistics and performance metrics will be shown here.</p>
                        </CardContent>
                    </Card>
                </div>
            }

            {
                propertyServicesTab &&
                <div>
                    <h1>Available Services for your property</h1>

                    {availableServices.map((service: Service, index: number) => (
                        <div key={index} onClick={() => {setSelectedService(service)}}>
                            <h1>{service.name}</h1>
                        </div>
                    ))}
                    {selectedService && (
                        <div className={"shadow-card"}>
                            <h1 className={"font-bold"}>{selectedService.name}</h1>
                            <Input
                                type="datetime-local"
                                id="startDate"
                                min={date.toISOString().split('T')[0] + "T00:00:00"}
                                value={serviceInterventionDate}
                                onChange={(e) => setServiceInterventionDate(e.target.value)}
                                required
                                className="mt-1"
                            />
                        </div>
                    )}
                    {!availability.state && <h1>{availability.reason}</h1>}
                </div>
            }

            <div className="mt-6">
                <p className="text-sm text-gray-500">Last updated: {new Date(property.updatedAt!).toLocaleString()}</p>
            </div>
        </div>
    );
};