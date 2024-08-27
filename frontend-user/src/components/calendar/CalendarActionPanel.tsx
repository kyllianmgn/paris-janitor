import React, { useState, useEffect } from 'react';
import { PropertyOccupation } from '@/types';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface CalendarActionPanelProps {
    selectedProperty: number;
    selectedOccupation: PropertyOccupation | null;
    onCreateOccupation: (occupation: Omit<PropertyOccupation, 'id'>) => Promise<void>;
    onUpdateOccupation: (id: number, occupation: Partial<PropertyOccupation>) => Promise<void>;
    onDeleteOccupation: (id: number) => Promise<void>;
    occupations: PropertyOccupation[];
}

const CalendarActionPanel: React.FC<CalendarActionPanelProps> = ({
                                                                     selectedProperty,
                                                                     selectedOccupation,
                                                                     onCreateOccupation,
                                                                     onUpdateOccupation,
                                                                     onDeleteOccupation,
                                                                     occupations,
                                                                 }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (selectedOccupation) {
            setStartDate(new Date(selectedOccupation.startDate).toISOString().slice(0, 16));
            setEndDate(new Date(selectedOccupation.endDate).toISOString().slice(0, 16));

        } else {
            setStartDate('');
            setEndDate('');
        }
    }, [selectedOccupation]);

    const checkOverlap = (start: Date, end: Date): boolean => {
        return occupations.some(occupation => {
            if (selectedOccupation && occupation.id === selectedOccupation.id) return false;
            const occStart = new Date(occupation.startDate);
            const occEnd = new Date(occupation.endDate);
            return (start < occEnd && end > occStart);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const newStart = new Date(startDate);
        const newEnd = new Date(endDate);

        const now = new Date();
        now.setHours(now.getHours() + 1);

        if (newStart < now) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Cannot set unavailability in the past or within the next hour",
            });
            setIsLoading(false);
            return;
        }

        if (checkOverlap(newStart, newEnd)) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "This period overlaps with an existing occupation",
            });
            setIsLoading(false);
            return;
        }

        try {
            if (selectedOccupation) {
                await onUpdateOccupation(selectedOccupation.id, { startDate: newStart.toISOString(), endDate: newEnd.toDateString() });
                toast({
                    title: "Success",
                    description: "Unavailability updated successfully",
                });
            } else {
                await onCreateOccupation({ propertyId: selectedProperty, startDate: newStart.toISOString(), endDate: newEnd.toISOString() });
                toast({
                    title: "Success",
                    description: "Unavailability created successfully",
                });
            }
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save occupation",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedOccupation) return;
        setIsLoading(true);
        try {
            await onDeleteOccupation(selectedOccupation.id);
            toast({
                title: "Success",
                description: "Unavailability deleted successfully",
            });
            setStartDate('');
            setEndDate('');
        } catch (err) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete occupation",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
                {selectedOccupation ? 'Edit Unavailability' : 'Add Unavailability'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                    <Input
                        type="datetime-local"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        className="mt-1"
                    />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                    <Input
                        type="datetime-local"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                        className="mt-1"
                    />
                </div>
                <div className="flex justify-between">
                    <Button type="submit" disabled={isLoading}>{selectedOccupation ? 'Update' : 'Create'}</Button>
                    {selectedOccupation && (
                        <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>Delete</Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default CalendarActionPanel;