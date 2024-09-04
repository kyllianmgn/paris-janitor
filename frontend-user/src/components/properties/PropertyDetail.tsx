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
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import OrderServicesDialog from "@/components/properties/OrderServicesDialog";
import { CrudModal, Field } from "@/components/public/CrudModal";
import {ReviewSection} from "@/components/review/ReviewSection";
import AuthModal from "@/components/public/auth/AuthModal";

const propertyFields: Field[] = [
    { name: 'address', label: 'Address', type: 'text', required: true },
    { name: 'postalCode', label: 'Postal Code', type: 'text', required: true },
    { name: 'city', label: 'City', type: 'text', required: true },
    { name: 'country', label: 'Country', type: 'text', required: true },
    { name: 'pricePerNight', label: 'Price per night', type: 'number', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
];

export interface PropertyDetailsProps {
    propertyId: number;
    isPersonal?: boolean;
}



interface ServiceAvailability { state: boolean, reason: string }

export const PropertyDetails = ({ propertyId, isPersonal = false }: PropertyDetailsProps) => {
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
    const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({ start: new Date(), end: null });
    const [servicesModal, setServicesModal] = useState<boolean>(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [imageList, setImageList] = useState<string[]>([]);
    const router = useRouter();
    const { toast } = useToast();
    const user = useSelector((state: RootState) => state.auth.user);
    const role = useSelector((state: RootState) => state.auth.role);
    const idRole = useSelector((state: RootState) => state.auth.idRole);

    const [modalState, setModalState] = useState<{isOpen: boolean, mode: 'edit' | 'delete', property: Property | null}>({
        isOpen: false,
        mode: 'edit',
        property: null
    });

    useEffect(() => {
        const loadProperty = async () => {
            if (propertyId) {
                if (isPersonal){
                    try {
                        const res = await propertiesService.getMyPropertyById(propertyId);
                        const images = await propertiesService.getMyPropertyImageById(propertyId);
                        setProperty(res.data);
                        setImageList(images.data)
                    } catch (error) {
                        console.error("Failed to load property:", error);
                        toast({
                            title: "Error",
                            description: "Failed to load property details.",
                            variant: "destructive",
                        });
                    } finally {
                        setLoading(false);
                    }
                }else{
                    try {
                        const res = await propertiesService.getPropertyById(propertyId);
                        const images = await propertiesService.getPropertyImageById(propertyId);
                        setProperty(res.data);
                        setImageList(images.data)
                    } catch (error) {
                        console.error("Failed to load property:", error);
                        toast({
                            title: "Error",
                            description: "Failed to load property details.",
                            variant: "destructive",
                        });
                    } finally {
                        setLoading(false);
                    }
                }
            }
        };
        loadProperty();
    }, [propertyId, toast]);

    const handleGoBack = () => router.back();

    const handleReserveClick = () => {
        if (!user) {
            setIsAuthModalOpen(true);
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

        setIsReservationDialogOpen(true);
    };

    const handleModalClose = () => {
        setModalState({ isOpen: false, mode: 'edit', property: null });
    };

    const handleModalSubmit = async (data: Partial<Property>) => {
        try {
            if (modalState.mode === 'edit') {
                if (data.id) {
                    const propertyId = data.id;
                    delete data.id;
                    delete data.landlord;
                    delete data.landlordId;
                    delete data.instruction;
                    delete data.roomCount;
                    delete data.propertyType;
                    delete data.status;
                    delete data.createdAt;
                    delete data.updatedAt;
                    await propertiesService.updateProperty(propertyId, data as Property);

                    // Refresh property data
                    const updatedProperty = await propertiesService.getMyPropertyById(propertyId);
                    setProperty(updatedProperty.data);

                    toast({title: "Success", description: "Property updated successfully"});
                } else {
                    toast({
                        title: "Error",
                        description: `Failed to ${modalState.mode === 'edit' ? 'update' : 'delete'} property`,
                        variant: "destructive",
                    });
                }
            } else if (modalState.mode === 'delete') {
                await propertiesService.disableProperty(modalState.property!.id!);
                toast({ title: "Success", description: "Property deleted successfully" });
                router.push('/my-properties');
            }
        } catch (error) {
            console.error(`Error ${modalState.mode === 'edit' ? 'updating' : 'deleting'} property:`, error);
            toast({
                title: "Error",
                description: `Failed to ${modalState.mode === 'edit' ? 'update' : 'delete'} property`,
                variant: "destructive",
            });
        }
        handleModalClose();
    };

    const handleManageReservations = () => {
        router.push(`/my-properties/${propertyId}/reservations`);
    };

    const handleEditProperty = () => {
        setModalState({ isOpen: true, mode: 'edit', property });
    };

    const handleDeleteProperty = () => {
        setModalState({ isOpen: true, mode: 'delete', property });
    };

    const handleToggleServices = () => {
        setServicesModal(true);
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (!property) return <div className="text-center mt-10">Property not found</div>;

    const isOwner = role === 'LANDLORD' && idRole === property.landlordId;
    const canReserve = role === 'TRAVELER';


    return (
        <div className="container mx-auto px-4 py-8">
            <Button onClick={handleGoBack} variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4"/> Back
            </Button>

            <h1 className="text-3xl font-bold mb-6">{property.address}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-4">
                    <PropertyImageCarousel propertyId={propertyId} images={imageList} />
                    <PropertyInfo property={property} />
                    <PropertyDescription description={property.description} />
                </div>
                <div>
                    {canReserve && <ReservationCard
                        price={property.pricePerNight}
                        onReserveClick={handleReserveClick}
                        startDate={selectedDates.start}
                        endDate={selectedDates.end}
                        setStartDate={(date) => setSelectedDates(prev => ({ ...prev, start: date }))}
                        setEndDate={(date) => setSelectedDates(prev => ({ ...prev, end: date }))}
                        canReserve={canReserve}
                    />}

                    {isOwner && (
                        <OwnerActions
                            onManageOccupations={handleManageReservations}
                            onEditProperty={handleEditProperty}
                            onDeleteProperty={handleDeleteProperty}
                            onToggleServices={handleToggleServices}
                        />
                    )}
                </div>
                <div className="md:col-span-2">
                    <ReviewSection propertyId={propertyId}/>
                </div>
            </div>

            {canReserve && (
                <ReservationDialog
                    isOpen={isReservationDialogOpen}
                    onClose={() => setIsReservationDialogOpen(false)}
                    propertyId={propertyId}
                    propertyPrice={property.pricePerNight}
                    startDate={selectedDates.start ?? new Date()}
                    endDate={selectedDates.end ?? new Date()}
                />
            )}

            {isOwner && (
                <OrderServicesDialog
                    isOpen={servicesModal}
                    onClose={() => setServicesModal(false)}
                    propertyId={propertyId}
                />
            )}

            <CrudModal<Property>
                isOpen={modalState.isOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                fields={propertyFields}
                title={modalState.mode === 'edit' ? 'Edit Property' : 'Delete Property'}
                initialData={modalState.property || {}}
                mode={modalState.mode}
            />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode="login"
            />
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
    onToggleServices: () => void;
}> = ({ onManageOccupations, onEditProperty, onDeleteProperty, onToggleServices }) => (
    <Card>
        <CardHeader>
            <CardTitle>Owner Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
            <Button onClick={onManageOccupations} className="w-full">
                <Calendar className="mr-2 h-4 w-4" />
                Manage Reservations
            </Button>
            <Button onClick={onEditProperty} className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Edit Property
            </Button>
            <Button onClick={onToggleServices} className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Access Services Tab
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
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;
    canReserve: boolean;
}> = ({ price, onReserveClick, startDate, endDate, setStartDate, setEndDate, canReserve }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Reservation</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-2xl font-bold mb-4">€{price} / night</p>
                <DatePicker
                    selected={startDate}
                    onChange={(dates) => {
                        const [start, end] = dates;
                        setStartDate(start);
                        setEndDate(end);
                    }}
                    startDate={startDate ? startDate : undefined}
                    endDate={endDate ? endDate : undefined}
                    selectsRange
                    inline
                />
                {canReserve ? (
                    <Button onClick={onReserveClick} className="w-full mt-4">
                        Reserve
                    </Button>
                ) : (
                    <p className="text-sm text-gray-500 mt-4">
                        You must be logged in as a traveler to make reservations.
                    </p>
                )}
            </CardContent>
        </Card>
    );
};


export default PropertyDetails;