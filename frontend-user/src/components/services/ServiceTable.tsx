"use client";
import React, {useState} from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { Service } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { CrudModal, Field } from "@/components/public/CrudModal";
import { useRouter } from 'next/navigation';

interface ServiceTableProps {
    services: Service[];
    onRefresh: () => void;
    personal?: boolean
}

const serviceFields: Field[] = [
    { name: 'name', label: 'Nom', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'basePrice', label: 'Prix de base', type: 'number', required: true },
];

export const ServiceTable = ({ services, onRefresh, personal = false }: ServiceTableProps) => {
    const [modalState, setModalState] = useState<{isOpen: boolean, mode: 'edit' | 'delete', service: Service | null}>({
        isOpen: false,
        mode: 'edit',
        service: null
    });
    const { toast } = useToast();
    const router = useRouter();

    const handleViewDetails = (serviceId: number) => {
        if (personal){
            router.push(`/my-services/${serviceId}`);
        }else{
            router.push(`/services/${serviceId}`);
        }
    };


    const handleEditClick = (service: Service) => {
        setModalState({ isOpen: true, mode: 'edit', service });
    };

    const handleDeleteClick = (service: Service) => {
        setModalState({ isOpen: true, mode: 'delete', service });
    };

    const handleModalClose = () => {
        setModalState({ isOpen: false, mode: 'edit', service: null });
    };



    const handleModalSubmit = async (data: Partial<Service>) => {
        try {
            if (modalState.mode === 'edit') {
                //await servicesService.updateService(data as Service);
                toast({ title: "Success", description: "Service updated successfully" });
            } else if (modalState.mode === 'delete') {
                //await servicesService.deleteService(modalState.service!.id!);
                toast({ title: "Success", description: "Service deleted successfully" });
            }
            onRefresh();
        } catch (error) {
            console.error(`Error ${modalState.mode === 'edit' ? 'updating' : 'deleting'} service:`, error);
            toast({
                title: "Error",
                description: `Failed to ${modalState.mode === 'edit' ? 'update' : 'delete'} service`,
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                    <tr key={service.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleViewDetails(service.id!)}>
                        <td className="px-6 py-4 whitespace-nowrap">{service.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{service.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{new Date(service.updatedAt!).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewDetails(service.id!); }}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        <span>View Details</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditClick(service); }}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        <span>Edit</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteClick(service); }}>
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

            <CrudModal<Service>
                isOpen={modalState.isOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                fields={serviceFields}
                title={modalState.mode === 'edit' ? 'Edit Service' : 'Delete Service'}
                initialData={modalState.service || {}}
                mode={modalState.mode}
            />
        </div>
    );
};