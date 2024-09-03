"use client";
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { servicesService } from "@/api/services/services";
import {Service, ServicePayment} from "@/types";
import {redirect, useRouter} from 'next/navigation';
import {paymentService} from "@/api/services/paymentService";
import DatePicker from "react-datepicker";
import {Input} from "@/components/ui/input";

interface ReservationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: number
}

const OrderServicesDialog: React.FC<ReservationDialogProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 propertyId
                                                             }) => {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedServices, setSelectedServices] = useState<number[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [date, setDate] = useState<Date | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchServices = async () => {
            const res = await servicesService.getServicesForPropeties(undefined, undefined, date?date:undefined);
            setServices(res.data);
        };
        fetchServices().then();
    }, [date]);

    const handleServiceToggle = (serviceId: number, servicePrice: number) => {
        setSelectedServices([serviceId]);
        setTotalPrice(servicePrice)
    };

    const handleSubmit = async () => {
        try {
            if (!date) return;
            const response = await paymentService.createServicePayment({
                amount: Number(totalPrice), // Assurez-vous que c'est un nombre
                currency: 'EUR', // ou la devise appropriée
                paymentMethod: 'stripe',
                serviceId: selectedServices[0],
                date: date,
                propertyId: String(propertyId)
            });
            if (response.sessionUrl){
                router.push(response.sessionUrl)
            }
        } catch (error) {
            console.error('Error creating payment:', error);
            // Gérer l'erreur ici
        }
    };

    const buttonText = selectedServices.length > 0 ? 'Réservé le service sélectionné' : 'Pas de services ou de date, impossible de réservé';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Book your stay</DialogTitle>
                </DialogHeader>
                <Input type={"datetime-local"} onChange={(e) => {setDate(new Date(e.target.value))}}/>
                <div className="py-4">
                    <h3 className="mb-4 font-semibold">Available services:</h3>
                    {services.map(service => (
                        <div key={service.id} className="flex items-center space-x-2 mb-2">
                            <Checkbox
                                id={`service-${service.id}`}
                                checked={selectedServices.includes(service.id)}
                                onCheckedChange={() => handleServiceToggle(service.id, service.basePrice)}
                            />
                            <label htmlFor={`service-${service.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {service.name} - ${service.basePrice}
                            </label>
                        </div>
                    ))}
                    <p className="mt-4 font-semibold">Total price: ${totalPrice}</p>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={selectedServices.length <= 0 || !date}>{buttonText}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default OrderServicesDialog;
