"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Rental {
  id: string;
  title: string;
  price: number;
  image: string;
}

export default function RentalList() {
  const [rentals, setRentals] = useState<Rental[]>([]);

  useEffect(() => {
    // Fetch rentals from your API
    // This is just mock data
    setRentals([
      {
        id: "1",
        title: "Cozy Apartment in Paris",
        price: 100,
        image: "/rentals/1.jpg",
      },
      {
        id: "2",
        title: "Luxury Villa in Nice",
        price: 250,
        image: "/rentals/2.jpg",
      },
      // Add more rental items...
    ]);
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Rentals</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {rentals.map((rental) => (
          <Card key={rental.id}>
            <CardHeader className="p-0">
              <img
                src={rental.image}
                alt={rental.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-lg mb-2">{rental.title}</CardTitle>
              <p className="text-gray-600 mb-4">${rental.price} / night</p>
              <Button className="w-full">View Details</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
