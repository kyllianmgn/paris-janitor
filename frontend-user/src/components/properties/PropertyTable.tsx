"use client";
import React, {useState} from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { Property, PropertyStatus } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { CrudModal, Field } from "@/components/public/CrudModal";
import { useRouter } from 'next/navigation';
import {propertiesService} from "@/api/services/properties";

interface PropertyTableProps {
    properties: Property[];
    onRefresh: () => void;
}

const propertyFields: Field[] = [
    { name: 'address', label: 'Address', type: 'text', required: true },
    { name: 'postalCode', label: 'Postal Code', type: 'text', required: true },
    { name: 'city', label: 'City', type: 'text', required: true },
    { name: 'country', label: 'Country', type: 'text', required: true },
    { name: 'pricePerNight', label: 'Price per night', type: 'number', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
];

export const PropertyTable = ({ properties, onRefresh }: PropertyTableProps) => {
    const [modalState, setModalState] = useState<{isOpen: boolean, mode: 'edit' | 'delete', property: Property | null}>({
        isOpen: false,
        mode: 'edit',
        property: null
    });
    const { toast } = useToast();
    const router = useRouter();

    const handleViewDetails = (propertyId: number) => {
        router.push(`/my-properties/${propertyId}`);
    };

    const handleEditClick = (property: Property) => {
        setModalState({ isOpen: true, mode: 'edit', property });
    };

    const handleDeleteClick = (property: Property) => {
        setModalState({ isOpen: true, mode: 'delete', property });
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
                    await propertiesService.updateProperty(propertyId ,data as Property);
                    toast({ title: "Success", description: "Property updated successfully" });
                } else {
                    toast({
                        title: "Error",
                        description: `Failed to ${modalState.mode === 'edit' ? 'update' : 'delete'} property`,
                        variant: "destructive",
                    });
                }
            } else if (modalState.mode === 'delete') {
                await propertiesService.disableProperty(modalState.property!.id!);
                onRefresh();
                toast({ title: "Success", description: "Property deleted successfully" });
            }
            onRefresh();
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


    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewDetails(property.id!)}>
                        <td className="px-6 py-4 whitespace-nowrap">{property.address}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{property.city}, {property.country}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    property.status === PropertyStatus.APPROVED ? 'bg-green-100 text-green-800' :
                                        property.status === PropertyStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                }`}>
                                    {property.status}
                                </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(property.updatedAt!).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="h-8 w-8 p-0"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56">
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewDetails(property.id!);
                                        }}
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        <span>View Details</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEditClick(property);
                                        }}
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        <span>Edit</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteClick(property);
                                        }}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Delete</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <CrudModal<Property>
                isOpen={modalState.isOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                fields={propertyFields}
                title={modalState.mode === 'edit' ? 'Edit Property' : 'Delete Property'}
                initialData={modalState.property || {}}
                mode={modalState.mode}
            />
        </div>
    );
};