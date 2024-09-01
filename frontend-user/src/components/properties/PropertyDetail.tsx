"use client";
import React, { useEffect, useState } from "react";
import {Property, PropertyStatus, Service, User} from "@/types";
import { propertiesService } from "@/api/services/properties";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Edit, Trash2, Calendar , Settings} from "lucide-react";
import { useRouter } from "next/navigation";
import PropertyImageCarousel from "./PropertyImageCarousel";
import PropertyCalendar from "./PropertyCalendar";
import ReservationDialog from "./ReservationDialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {servicesService} from "@/api/services/services";
import {Input} from "@/components/ui/input";
import {Simulate} from "react-dom/test-utils";

export interface PropertyDetailsProps {
    propertyId: number;
}

interface ServiceAvailability { state: boolean, reason: string }

export const PropertyDetails = ({propertyId}: PropertyDetailsProps) => {
    const [property, setProperty] = useState<Property | null>(null);
    const [propertyServicesTab, setPropertyServicesTab] = useState<boolean>(false);
    const [availableServices, setAvailableServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service|null>(null);
    const [serviceInterventionDate, setServiceInterventionDate] = useState<string>("");
    const [availability, setAvailability] = useState<ServiceAvailability>({state: false, reason: ""});
    const [loading, setLoading] = useState<boolean>(true);
    const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
    const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({ start: null, end: null });
    const router = useRouter();
    const { toast } = useToast();
    const { user, isAuthenticated, role } = useAuth();
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
        if (SPResponse.data && propertyResponse.data){
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

    const setStartDate = (date: string) => {
        setSelectedDates((prevDates) => ({ ...prevDates, start: new Date(date) }));
    };

    const setEndDate = (date: string) => {
        setSelectedDates((prevDates) => ({ ...prevDates, end: new Date(date) }));
    };

    const handleGoBack = () => router.back();

    const handleReserveClick = () => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (role !== 'TRAVELER') {
            toast({
                title: "Reservation not possible",
                description: "Your role does not allow you to make reservations.",
                variant: "destructive",
            });
            return;
        }

        if (!selectedDates.start || !selectedDates.end) {
            toast({
                title: "Select dates",
                description: "Please select your check-in and check-out dates before reserving.",
                variant: "destructive",
            });
            return;
        }

        // Si toutes les conditions sont remplies, ouvrir le dialogue de réservation
        setIsReservationDialogOpen(true);
    };



    const handleManageOccupations = () => {
        router.push(`/properties/${propertyId}/occupations`);
    };

    const handleEditProperty = () => {
        router.push(`/properties/${propertyId}/edit`);
    };

    const handleDeleteProperty = async () => {
        if (window.confirm("Are you sure you want to delete this property?")) {
            try {
                await propertiesService.disableProperty(propertyId);
                toast({
                    title: "Property deleted",
                    description: "The property has been successfully deleted.",
                    variant: "default",
                });
                router.push('/my-properties');
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to delete the property. Please try again.",
                    variant: "destructive",
                });
            }
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (!property) return <div className="text-center mt-10">Property not found</div>;

    const isOwner = role === 'LANDLORD' && user?.id === property.landlordId;

    return (
        <div className="container mx-auto px-4 py-8">
            <Button onClick={handleGoBack} variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4"/> Back
            </Button>

            <h1 className="text-3xl font-bold mb-6">{property.address}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <PropertyImageCarousel propertyId={propertyId} />
                    <PropertyInfo property={property} />
                    <PropertyDescription description={property.description} />
                </div>
                <div>
                    <ReservationCard
                        price={property.pricePerNight}
                        onReserveClick={handleReserveClick}
                        startDate={selectedDates.start?.toISOString().split('T')[0] || ''}
                        endDate={selectedDates.end?.toISOString().split('T')[0] || ''}
                        setStartDate={setStartDate}
                        setEndDate={setEndDate}
                    />
                    {isOwner && (
                        <OwnerActions
                            onManageOccupations={handleManageOccupations}
                            onEditProperty={handleEditProperty}
                            onDeleteProperty={handleDeleteProperty}
                        />
                    )}
                </div>
            </div>

            {!isOwner && (
                <ReservationDialog
                    isOpen={isReservationDialogOpen}
                    onClose={() => setIsReservationDialogOpen(false)}
                    propertyId={propertyId}
                    propertyPrice={property.pricePerNight}
                    startDate={selectedDates.start ?? new Date()}
                    endDate={selectedDates.end ?? new Date()}
                />

            )}

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
        </div>
    );
};
const PropertyInfo: React.FC<{ property: Property }> = ({ property }) => (
    <Card>
        <CardHeader>
            <CardTitle>Information</CardTitle>
        </CardHeader>
        <CardContent>
            <p><strong>City:</strong> {property.city}</p>
            <p><strong>Country:</strong> {property.country}</p>
            <p><strong>Postal Code:</strong> {property.postalCode}</p>
            <p><strong>Price per night:</strong> ${property.pricePerNight}</p>
            <p>
                <strong>Status:</strong>
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
);

const PropertyDescription: React.FC<{ description: string }> = ({ description }) => (
    <Card>
        <CardHeader>
            <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
            <p>{description}</p>
        </CardContent>
    </Card>
);

const OwnerActions: React.FC<{
    onManageOccupations: () => void;
    onEditProperty: () => void;
    onDeleteProperty: () => void;
}> = ({ onManageOccupations, onEditProperty, onDeleteProperty }) => (
    <Card>
        <CardHeader>
            <CardTitle>Owner Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
            <Button onClick={onManageOccupations} className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Manage Occupations
            </Button>
            <Button onClick={onEditProperty} className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Edit Property
            </Button>
            <Button onClick={onDeleteProperty} className="w-full" variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Property
            </Button>
        </CardContent>
    </Card>
);
const ReservationCard: React.FC<{
    price: number;
    onReserveClick: () => void;
    startDate: string;
    endDate: string;
    setStartDate: (date: string) => void;
    setEndDate: (date: string) => void;
}> = ({ price, onReserveClick, startDate, endDate, setStartDate, setEndDate }) => {
    return (
        <div>
            <div>
                <label>Check-in</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border rounded"
                />
            </div>
            <div>
                <label>Check-out</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="w-full p-2 border rounded"
                />
            </div>
            <button onClick={onReserveClick}>Reserve</button>
        </div>
    );
};


export default PropertyDetails;