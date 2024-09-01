"use client";
import { useState, useEffect } from "react";
import { propertiesService } from "@/api/services/properties";
import { PropertyList } from "@/components/properties/PropertyList";
import { PropertyTable } from "@/components/properties/PropertyTable";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle, List, Grid } from "lucide-react";
import { Property } from "@/types";

export const Properties = () => {
    const router = useRouter();
    const [propertyList, setPropertyList] = useState<Property[]>([]);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [isClient, setIsClient] = useState(false);

    const loadProperties = async () => {
        try {
            const res = await propertiesService.getPropertiesByUserId();
            setPropertyList(res.data);
        } catch (error) {
            console.error("Failed to load properties:", error);
            alert("Failed to load properties. Please try again later.");
        }
    };

    useEffect(() => {
        setIsClient(true);
        loadProperties().then();
    }, []);

    const handleAddProperty = () => {
        router.push("/my-properties/new");
    }

    const toggleViewMode = () => {
        setViewMode(prevMode => prevMode === 'table' ? 'grid' : 'table');
    }

    return (
        <>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">My Properties</h1>
                    <div className="flex space-x-2">
                        <Button onClick={toggleViewMode} variant="outline">
                            {viewMode === 'table' ? <Grid size={20}/> : <List size={20}/>}
                        </Button>
                        <Button onClick={handleAddProperty}>
                            <PlusCircle size={20} className="mr-2"/>
                            Add Property
                        </Button>
                    </div>
                </div>
                {viewMode === 'table' ? (
                    <PropertyTable properties={propertyList} onRefresh={loadProperties}/>
                ) : (
                    <PropertyList properties={propertyList}/>
                )}
            </div>
        </>

    );
}