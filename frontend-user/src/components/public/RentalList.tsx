"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Property } from "@/types";
import { useRouter } from "next/navigation";
import { propertiesService } from "@/api/services/properties";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function RentalList() {
    const router = useRouter();
    const [propertyList, setPropertyList] = useState<Property[]>([]);
    const apiLink = process.env.NEXT_PUBLIC_API_URL || "https://api.parisjanitor.fr/";

    const loadProperties = async () => {
        const res = await propertiesService.getPublicProperties();
        setPropertyList(res.data);
    }

    useEffect(() => {
        loadProperties().then()
    }, []);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {propertyList.map((property) => (
                    <Card key={property.id} className="overflow-hidden">
                        <Carousel className="w-full">
                            <CarouselContent>
                                {[1, 2, 3].map((imageIndex) => (
                                    
                                    <CarouselItem key={imageIndex}>
                                        <img
                                            src={`${apiLink}public/image/property/${property.id}/${imageIndex}.jpeg`}
                                            alt={`Property ${property.id} image ${imageIndex}`}
                                            className="w-full h-64 object-cover"
                                        />


                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious className="h-8 w-8" />
                            <CarouselNext className="h-8 w-8" />
                        </Carousel>
                        <CardContent className="p-4">
                            <h2 className="font-semibold text-lg mb-2">{property.city}, {property.country}</h2>
                            <p className="text-sm text-gray-800 mb-4 line-clamp-2">{property.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="font-bold">${property.pricePerNight} / night</span>
                                <Button onClick={() => router.push(`/${property.id}`)} variant="outline">
                                    View Details
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}