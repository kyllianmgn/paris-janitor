"use client"
import React, {ChangeEvent, FormEvent, useEffect, useRef, useState} from "react";
import {serviceInterventionsService} from "@/api/services/service-interventions";
import {ServiceType} from "@/components/services/ServiceDetail";
import {Property} from "@/types";
import {Select, SelectContent, SelectItem} from "@/components/ui/select";
import {useSelector} from "react-redux";
import {RootState} from "@/store";

export interface ServiceInterventionPostReq {
    serviceId: number,
    propertyId?: number
    startDate: Date
    endDate?: Date
    additionalPrice: number
}

export interface ServiceInterventionFormProps {
    serviceId: number;
    serviceType: ServiceType;
    price: number;
    properties: Property[]
}

export enum InterventionStatus {
    PLANNED="PLANNED",
    IN_PROGRESS="IN_PROGRESS",
    COMPLETED="COMPLETED",
    CANCELLED="CANCELLED",
}

export const ServiceInterventionForm = ({serviceId, serviceType, price, properties}: ServiceInterventionFormProps) => {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const propertySelectRef = useRef<HTMLSelectElement>(null);
    const role = useSelector((state: RootState) => state.auth.role)
    //TODO manage and use available dates with property occupation
    //const [datesAvailable, setDatesAvailables] = useState<DateRange[]>([]);

    const [totalPrice, setTotalPrice] = useState<number>(price);

    const currentDatePlus1 = new Date();
    currentDatePlus1.setDate(currentDatePlus1.getDate() + 1);

    const defaultStartDate = new Date().toISOString().split("T")[0];
    const minStartDate = defaultStartDate;

    const defaultEndDate = currentDatePlus1.toISOString().split("T")[0];
    const [minEndDate, setMinEndDate] = useState<string>(defaultEndDate);
    const [endDateInputValue, setEndDateInputValue] = useState<string>(defaultEndDate);

    const startDateInput = useRef<HTMLInputElement>(null);
    const endDateInput = useRef<HTMLInputElement>(null);

    const onStartDateChange = () => {
        if (startDateInput.current?.value && endDateInput.current?.value) {
            const startDateInputValue = startDateInput.current.value;
            let endDateInputValue = endDateInput.current.value;

            const startDateInputDate = new Date(startDateInputValue);
            const endDateInputDate = new Date(endDateInputValue);

            startDateInputDate.setDate(startDateInputDate.getDate() + 1);
            setMinEndDate(startDateInputDate.toISOString().split("T")[0]);

            if (startDateInputDate.valueOf() > endDateInputDate.valueOf()) {
                const newEndDateInputValue = startDateInputDate.toISOString().split("T")[0];
                setEndDateInputValue(newEndDateInputValue);
                endDateInputValue = newEndDateInputValue;
            }

            updateTotalPrice(startDateInputValue, endDateInputValue);
        }
    }

    const updateTotalPrice = (startDate: string, endDate: string) => {
        const date1 = new Date(endDate);
        const date2 = new Date(startDate);
        const numberOfDays = Math.floor((Math.abs(date1.getTime() - date2.getTime())) / (1000 * 60 * 60 * 24));
        setTotalPrice(price * numberOfDays);
    }

    const onFormSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!startDateInput.current?.value || !propertySelectRef.current?.value) {
            setError(true);
            return;
        }


        let endDate = new Date(String(startDateInput.current?.value));
        endDate.setHours(endDate.getHours() + 4);
        const serviceInterventionPostReq: ServiceInterventionPostReq = {
            serviceId: serviceId,
            propertyId: +propertySelectRef.current?.value,
            startDate: new Date(String(startDateInput.current?.value)),
            additionalPrice: price,
            endDate: endDate,
        }

        if (role == "TRAVELER"){
            await serviceInterventionsService.createServiceInterventionAsTraveler(serviceInterventionPostReq);
        }else{
            await serviceInterventionsService.createServiceInterventionAsLandlord(serviceInterventionPostReq);
        }
        setSubmitted(true);
    }

    return (
        <div>
            {
                submitted ? (
                    <p className="text-lg font-semibold text-green-600">Réservation effectué</p>
                ) : (
                    <form onSubmit={onFormSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                        <p className="text-xl font-bold mb-4">Reserve a service</p>

                        {properties && <><label>Property</label>
                        <select ref={propertySelectRef} className="bg-white w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
                            {properties.map((property) => (<option key={property.id} value={property.id}>{property.address} - {property.city}, {property.country}</option>))}
                        </select></>}
                        <label>Date (une intervention devrait prendre la journée</label>
                        <input placeholder="Date" type={"date"} ref={startDateInput}
                               onChange={onStartDateChange}
                               min={minStartDate} defaultValue={defaultStartDate}
                               className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <div className="mb-4 text-left">
                            Service price : {price}€
                        </div>
                        {error && (
                            <p className="text-red-600 mb-4">Veuillez vérifier les informations puis réessayer</p>)}
                        <button type="submit"
                                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700">
                            Réserver pour {totalPrice}€
                        </button>
                    </form>
                )
            }
        </div>
    )
}
