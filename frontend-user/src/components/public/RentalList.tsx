"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import bien from "@/public/bien1.jpg";
import {propertiesService} from "@/api/services/properties";
import {Property} from "@/types";

export default function RentalList() {
  const [properties, setProperties] = useState<Property[]>([]);

  const loadProperties = async () => {
      const response = await propertiesService.getAvailableProperties()
      setProperties(response.data);
  }

  useEffect(() => {
    loadProperties().then()
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Rentals</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {properties.map((property) => (
          <Card key={property.id}>
            <CardHeader className="p-0">
              <Image
                src="https://picsum.photos/400/300"
                width={400}
                height={300}
                alt={property.address}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2">{property.address}</CardTitle>
              <p className="text-gray-600 mb-4">{property.description}</p>
              <Button className="w-full">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
