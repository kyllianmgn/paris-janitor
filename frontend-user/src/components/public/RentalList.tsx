"use client";
import {useState, useEffect} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {propertiesService} from "@/api/services/properties";
import {Property} from "@/types";
import {useRouter} from "next/navigation";

export default function RentalList() {
    const router = useRouter();
    const [propertyList, setPropertyList] = useState<Property[]>([]);

    const loadProperties = async () => {
        const res = await propertiesService.getProperties();
        setPropertyList(res.data);
    }

    useEffect(() => {
        loadProperties().then()
    }, []);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-6">Rentals</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {propertyList.map((property) => (
                    <Card key={property.id}>
                        <CardHeader className="p-4">
                            <CardTitle className="flex justify-between items-center">
                                <span>{property.city}, {property.country}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                            <p className="text-sm text-gray-600">{property.address}</p>
                            <p className="mt-2 mb-2 text-sm line-clamp-3">{property.description}</p>
                            <Button onClick={() => router.push(`/properties/${property.id}`)} className="w-full ">
                                View Details</Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
