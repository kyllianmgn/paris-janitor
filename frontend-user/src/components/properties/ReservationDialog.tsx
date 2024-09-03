"use client";
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { servicesService } from "@/api/services/services";
import {Service, ServicePayment} from "@/types";
import {redirect, useRouter} from 'next/navigation';
import {paymentService} from "@/api/services/paymentService";
import {propertiesReservationsService} from "@/api/services/properties-reservations";

interface ReservationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: number;
    propertyPrice: number;
    startDate: Date;
    endDate: Date;
}

const ReservationDialog: React.FC<ReservationDialogProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 propertyId,
                                                                 propertyPrice,
                                                                 startDate,
                                                                 endDate
                                                             }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedServices, setSelectedServices] = useState<number[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const fetchServices = async () => {
            const res = await servicesService.getServices();
            setServices(res.data);
        };
        fetchServices().then();
    }, []);

    useEffect(() => {
        if (endDate && startDate) {
            const numberOfNights: number = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
            const accommodationPrice: number = propertyPrice * numberOfNights;

            const servicesPrices: number = selectedServices.reduce((total, serviceId) => {
                const service: Service | undefined = services.find(s => s.id === serviceId);
                return total + (service?.basePrice || 0);
            }, 0);

            // Calculer le total et le convertir en nombre avec deux décimales
            const totalPrice = (Number(accommodationPrice) + Number(servicesPrices)).toFixed(2);
            setTotalPrice(+totalPrice);
        }
    }, [selectedServices, services, propertyPrice, startDate, endDate]);

    const handleServiceToggle = (serviceId: number) => {
        setSelectedServices(prev =>
            prev.includes(serviceId)
                ? prev.filter(id => id !== serviceId)
                : [...prev, serviceId]
        );
    };

    const handleSubmit = async () => {
        try {
            const responseReservation = await propertiesReservationsService.createPropertyReservation({
                propertyId: propertyId,
                endDate: endDate.toISOString(),
                startDate: startDate.toISOString(),
                totalPrice: totalPrice
            });

            const response = await paymentService.createPayment({
                amount: Number(totalPrice), // Assurez-vous que c'est un nombre
                currency: 'EUR', // ou la devise appropriée
                paymentMethod: 'stripe',
                propertyReservationId: responseReservation.data.id,
                services: selectedServices.map(serviceId => ({
                    serviceId,
                    name: services.find(s => s.id === serviceId)?.name,
                    amount: Number(services.find(s => s.id === serviceId)?.basePrice || 0)
                } as ServicePayment))
            });
            if (response.sessionUrl){
                router.push(response.sessionUrl)
            }
        } catch (error) {
            console.error('Error creating payment:', error);
            // Gérer l'erreur ici
        }
    };

    // Déterminer le texte du bouton en fonction des services sélectionnés
    const buttonText = selectedServices.length > 0 ? 'Book with selected services' : 'No services, proceed to payment';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Book your stay</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <h3 className="mb-4 font-semibold">Available services:</h3>
                    {services.map(service => (
                        <div key={service.id} className="flex items-center space-x-2 mb-2">
                            <Checkbox
                                id={`service-${service.id}`}
                                checked={selectedServices.includes(service.id)}
                                onCheckedChange={() => handleServiceToggle(service.id)}
                            />
                            <label htmlFor={`service-${service.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {service.name} - ${service.basePrice}
                            </label>
                        </div>
                    ))}
                    <p className="mt-4 font-semibold">Total price: ${totalPrice}</p>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>{buttonText}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReservationDialog;
