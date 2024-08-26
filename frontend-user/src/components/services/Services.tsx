"use client";
import { useState, useEffect } from "react";
import { servicesService } from "@/api/services/services";
import { ServiceList } from "@/components/services/ServiceList";
import { ServiceTable } from "@/components/services/ServiceTable";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle, List, Grid } from "lucide-react";
import { Service } from "@/types";
import Search from "@/components/ui/search";

export const Services = ({query, page}: {query?: string, page?: number}) => {
    const router = useRouter();
    const [serviceList, setServiceList] = useState<Service[]>([]);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true)
    }, []);


    const loadServices = async () => {
        try {
            const res = await servicesService.getServices(query, page);
            setServiceList(res.data);
        } catch (error) {
            console.error("Failed to load services:", error);
            alert("Failed to load services. Please try again later.");
        }
    };

    useEffect(() => {
        loadServices().then();
    }, [query, page]);

    const handleAddService = () => {
        router.push("/my-services/new");
    }

    const toggleViewMode = () => {
        setViewMode(prevMode => prevMode === 'table' ? 'grid' : 'table');
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Services</h1>
                <div className="flex space-x-2">
                    <Button onClick={toggleViewMode} variant="outline">
                        {viewMode === 'table' ? <Grid size={20} /> : <List size={20} />}
                    </Button>
                </div>
            </div>
            <Search placeholder={"Service"}></Search>
            {viewMode === 'table' ? (
                <ServiceTable services={serviceList} onRefresh={loadServices} />
            ) : (
                <ServiceList services={serviceList} />
            )}
        </div>
    );
}