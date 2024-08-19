"use client"
import { useEffect, useState } from "react";
import { Service } from "@/types";
import { servicesService } from "@/api/services/services";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Calendar, Settings } from "lucide-react";

export interface ServiceDetailProps {
    serviceId: number
}

export const ServiceDetail = ({ serviceId }: ServiceDetailProps) => {
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const loadService = async () => {
        if (serviceId) {
            const res = await servicesService.getServiceById(serviceId);
            setService(res.data);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadService().then();
    }, [serviceId]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!service) {
        return <div className="text-center mt-10">Service not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Service Details</h1>
                <div className="space-x-2">
                    <Button variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Service
                    </Button>
                    <Button variant="outline">
                        <Calendar className="mr-2 h-4 w-4" />
                        Manage Interventions
                    </Button>
                    <Button variant="outline">
                        <Settings className="mr-2 h-4 w-4" />
                        Service Services
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p><strong>Nom:</strong> {service.name}</p>
                        <p><strong>Description:</strong> {service.description}</p>
                        <p><strong>Prix:</strong> {service.basePrice}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{service.description}</p>
                    </CardContent>
                </Card>

                {/* Placeholder for future information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Additional Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Additional service information will be displayed here.</p>
                    </CardContent>
                </Card>

                {/* Placeholder for statistics or other relevant information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Service Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Service statistics and performance metrics will be shown here.</p>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6">
                <p className="text-sm text-gray-500">Last updated: {new Date(service.updatedAt!).toLocaleString()}</p>
            </div>
        </div>
    );
};