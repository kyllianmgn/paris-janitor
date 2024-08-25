import { Property, PropertyStatus } from "@/types";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Eye, MoreHorizontal, X } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CrudModal, Field } from "@/components/public/CrudModal";
import { propertiesService } from "@/api/services/properties";

export interface PropertyCardProps {
    property: Property;
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

export const PropertyCard = ({ property, onRefresh }: PropertyCardProps) => {
    const router = useRouter();

    const onClickCard = () => {
        router.push(`/my-properties/${property.id}`);
    };
    const { toast } = useToast();
    const [modalState, setModalState] = useState<{ isOpen: boolean, mode: 'edit' | 'delete', property: Property | null }>({
        isOpen: false,
        mode: 'edit',
        property: null
    });

    const getBadgeVariant = (status: PropertyStatus): BadgeProps['variant'] => {
        switch (status) {
            case PropertyStatus.APPROVED:
                return "secondary";
            case PropertyStatus.PENDING:
                return "default";
            case PropertyStatus.REJECTED:
                return "destructive";
            default:
                return "default";
        }
    }

    const handleViewDetails = (propertyId: number) => {
        router.push(`/properties/${propertyId}`);
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
                //await propertiesService.updateProperty(data as Property);
                toast({ title: "Success", description: "Property updated successfully" });
            }
            if (modalState.mode === 'delete') {
                await propertiesService.disableProperty(modalState.property!.id!);
                onRefresh();
                toast({ title: "Success", description: "Property deleted successfully" });
            }
            onRefresh();
        } catch (error) {
            console.error(`Error updating property:`, error);
            toast({
                title: "Error",
                description: "Failed to update property",
                variant: "destructive",
            });
        }
        handleModalClose();
    };



    return (
        <Card className="hover:shadow-lg transition-shadow duration-300" onClick={onClickCard} >
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>{property.city}, {property.country}</span>
                    <Badge variant={getBadgeVariant(property.status!)}>
                        {property.status}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-600">{property.address}</p>
                <p className="mt-2 text-sm line-clamp-3">{property.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
                <p className="text-xs text-gray-500">Last updated: {new Date(property.updatedAt!).toLocaleDateString()}</p>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(property.id!)}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditClick(property)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(property)}>
                            <X className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardFooter>

            <CrudModal<Property>
                isOpen={modalState.isOpen}
                onClose={handleModalClose}
                onSubmit={handleModalSubmit}
                fields={propertyFields}
                title={modalState.mode === 'edit' ? 'Edit Property' : 'Delete Property'}
                initialData={modalState.property || {}}
                mode={modalState.mode}
            />
        </Card>
    )
}