// api/services/calendarService.ts

import { api } from '@/api/config';
import {PropertyOccupation, CalendarEvent, ApiResponse, PropertyReservation} from '@/types';

export const calendarService = {
    getLandlordOccupations: async (): Promise<{
        resourceId: number;
        endDate: string;
        start: string;
        reservation?: PropertyReservation;
        end: string;
        id: number;
        title: string;
        propertyId: number;
        startDate: string
    }[]> => {
        try {
            const response: ApiResponse<PropertyOccupation[]> = await api.get('property-occupations/landlord').json();
            return response.data.map(occupation => ({
                ...occupation,
                title: occupation.reservation
                    ? `Reservation: ${occupation.reservation.status}`
                    : 'Unavailable',
                start: occupation.startDate,
                end: occupation.endDate,
                resourceId: occupation.propertyId
            }));
        } catch (error) {
            console.error('Error fetching landlord occupations:', error);
            throw error;
        }
    },

    createOccupation: async (occupation: Omit<PropertyOccupation, 'id'>): Promise<PropertyOccupation> => {
        try {
            const response: PropertyOccupation = await api.post('property-occupations', { json: occupation }).json();
            return response;
        } catch (error) {
            console.error('Error creating occupation:', error);
            throw error;
        }
    },

    updateOccupation: async (id: number, occupation: Partial<PropertyOccupation>): Promise<PropertyOccupation> => {
        try {
            const response: PropertyOccupation = await api.patch(`property-occupations/${id}`, { json: occupation }).json();
            return response;
        } catch (error) {
            console.error('Error updating occupation:', error);
            throw error;
        }
    },

    deleteOccupation: async (id: number): Promise<void> => {
        try {
            await api.delete(`property-occupations/${id}`);
        } catch (error) {
            console.error('Error deleting occupation:', error);
            throw error;
        }
    },
};