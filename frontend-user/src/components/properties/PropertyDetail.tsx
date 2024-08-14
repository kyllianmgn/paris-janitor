"use client"
import {useEffect, useState} from "react";
import {Property, PropertyStatus} from "@/types";
import {propertiesService} from "@/api/services/properties";
import {
    Details,
    DetailsContent,
    DetailsField,
    DetailsFieldName,
    DetailsFooter,
    DetailsHeader,
    DetailsTitle
} from "@/components/ui/details";
import {Badge, BadgeProps} from "@/components/ui/badge";

export interface PropertyDetailProps {
    propertyId: number
}

export const PropertyDetail = ({propertyId}: PropertyDetailProps) => {
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const loadProperty = async () => {
        if (propertyId) {
            const res = await propertiesService.getPropertyById(propertyId);
            setProperty(res.data);
            setLoading(false);
        }
    };

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
    };

    useEffect(() => {
        loadProperty().then();
    }, [loadProperty, propertyId]);

    if (loading) {
        return <h1 className="text-2xl font-semibold text-center mt-10">Loading...</h1>;
    }

    return (
        <>
            {property ? (
                <Details>
                    <DetailsHeader>
                        <DetailsTitle>
                            <span>{property.city}, {property.country}</span>
                            <Badge variant={getBadgeVariant(property.status!)}>
                                {property.status}
                            </Badge>
                        </DetailsTitle>
                    </DetailsHeader>
                    <DetailsContent>
                        <DetailsFieldName>Address</DetailsFieldName>
                        <DetailsField>{property.address}</DetailsField>
                        <DetailsFieldName>City</DetailsFieldName>
                        <DetailsField>{property.city}</DetailsField>
                        <DetailsFieldName>Country</DetailsFieldName>
                        <DetailsField>{property.country}</DetailsField>
                        <DetailsFieldName>Postal Code</DetailsFieldName>
                        <DetailsField>{property.postalCode}</DetailsField>
                        <DetailsFieldName>Description</DetailsFieldName>
                        <textarea
                            readOnly
                            value={property.description}
                            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </DetailsContent>
                    <DetailsFooter>
                        <p className="text-sm text-gray-500">Last
                            updated: {new Date(property.updatedAt!).toLocaleDateString()}</p>
                    </DetailsFooter>
                </Details>
            ) : (
                <div className="text-2xl font-semibold text-center mt-10">Property not Found</div>
            )}
        </>
    );
}
