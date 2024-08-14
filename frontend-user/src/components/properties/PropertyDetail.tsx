"use client"
import { useEffect, useState } from "react";
import { Property, PropertyStatus } from "@/types";
import { propertiesService } from "@/api/services/properties";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Calendar, Settings } from "lucide-react";

export interface PropertyDetailProps {
    propertyId: number
}

export const PropertyDetail = ({ propertyId }: PropertyDetailProps) => {
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const loadProperty = async () => {
        if (propertyId) {
            const res = await propertiesService.getPropertyById(propertyId);
            setProperty(res.data);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProperty().then();
    }, [propertyId]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!property) {
        return <div className="text-center mt-10">Property not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Property Details</h1>
                <div className="space-x-2">
                    <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Property
                    </Button>
                    <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        Manage Reservations
                    </Button>
                    <Button variant="outline">
                        <Settings className="mr-2 h-4 w-4" />
                        Property Services
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><strong>Address:</strong> {property.address}</p>
                        <p><strong>City:</strong> {property.city}</p>
                        <p><strong>Country:</strong> {property.country}</p>
                        <p><strong>Postal Code:</strong> {property.postalCode}</p>
                        <p><strong>Status:</strong>
                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                property.status === PropertyStatus.APPROVED ? 'bg-green-100 text-green-800' :
                                    property.status === PropertyStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                            }`}>
                                {property.status}
                            </span>
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{property.description}</p>
                    </CardContent>
                </Card>

                {/* Placeholder for future information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Additional Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Additional property information will be displayed here.</p>
                    </CardContent>
                </Card>

                {/* Placeholder for statistics or other relevant information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Property Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Property statistics and performance metrics will be shown here.</p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6">
                <p className="text-sm text-gray-500">Last updated: {new Date(property.updatedAt!).toLocaleString()}</p>
            </div>
        </div>
    );
};