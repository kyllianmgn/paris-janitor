"use client"
import {ChangeEvent, FormEvent, useRef, useState} from "react";
import {createPropertyReservation} from "@/api/services/properties-reservations";

export interface PropertyReservation {
    travelerId: number;
    occupationId: number; //not read by API but required
    status: string; //not read by API but required
    totalPrice: number;
    propertyId: number;
    startDate: string;
    endDate: string;
}

export interface PropertiesReservationsFormProps {
    propertyId: number;
    travelerId: number;
    price: number;
}

export const PropertiesReservationsForm = ({propertyId, travelerId, price}: PropertiesReservationsFormProps) => {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
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

    const onEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEndDateInputValue(event.target.value);
        if (startDateInput.current?.value && endDateInput.current?.value) {
            updateTotalPrice(startDateInput.current.value, endDateInput.current.value);
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
        if (!startDateInput.current?.value && !endDateInput.current?.value) {
            setError(true);
            return;
        }

        const propertyReservation: PropertyReservation = {
            travelerId: travelerId,
            occupationId: 0, //not read by API but required
            status: "PENDING", //not read by API but required
            totalPrice: price,
            propertyId: propertyId,
            startDate: new Date(String(startDateInput.current?.value)).toISOString(),
            endDate: new Date(String(endDateInput.current?.value)).toISOString(),
        }

        await createPropertyReservation(propertyReservation);
        setSubmitted(true);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            {
                submitted ? (
                    <p className="text-lg font-semibold text-green-600">Réservation effectué</p>
                ) : (
                    <form onSubmit={onFormSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
                        <p className="text-xl font-bold mb-4">Réserver une propriété</p>
                        <input placeholder="Date d'arrivé" type={"date"} ref={startDateInput}
                               onChange={onStartDateChange}
                               min={minStartDate} defaultValue={defaultStartDate}
                               className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <input placeholder="Date de départ" type={"date"} ref={endDateInput} onChange={onEndDateChange}
                               min={minEndDate} value={endDateInputValue}
                               className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                        <div className="mb-4 text-left">
                            Prix par nuit : {price}€
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
