"use client";
import { useState, useEffect } from "react";
import { servicesService } from "@/api/services/services";
import { ServiceList } from "@/components/services/ServiceList";
import { ServiceTable } from "@/components/services/ServiceTable";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle, List, Grid } from "lucide-react";
import {Service, ServiceProviderStatus} from "@/types";
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {authService} from "@/api/services/authService";

export const MyServices = () => {
    const router = useRouter();
    const [serviceList, setServiceList] = useState<Service[]>([]);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [isClient, setIsClient] = useState(false);
    const SPStatus = useSelector((root: RootState) => root.auth.serviceProviderStatus);

    const loadServices = async () => {
        try {
            const res = await servicesService.getMyServices();
            setServiceList(res.data);
        } catch (error) {
            console.error("Failed to load services:", error);
            alert("Failed to load services. Please try again later.");
        }
    };

    useEffect(() => {
        setIsClient(true)
        loadServices().then();
    }, []);

    const handleAddService = () => {
        router.push("/my-services/new");
    }

    const toggleViewMode = () => {
        setViewMode(prevMode => prevMode === 'table' ? 'grid' : 'table');
    }



    return (
            <>{isClient &&
                <div className="container mx-auto px-4 py-8">
                    {SPStatus === "PENDING" &&
                        <div
                            className="bg-red-200 w-full mb-2 rounded-sm p-3 border-dashed border-red-500 text-red-500 border-2">
                            Your account is currently pending validation. Your services cannot be seen by users.
                        </div>
                    }
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">My Services</h1>
                        <div className="flex space-x-2">
                            <Button onClick={toggleViewMode} variant="outline">
                                {viewMode === 'table' ? <Grid size={20}/> : <List size={20}/>}
                            </Button>
                            <Button onClick={handleAddService}>
                                <PlusCircle size={20} className="mr-2"/>
                                Add Service
                            </Button>
                        </div>
                    </div>
                    {viewMode === 'table' ? (
                        <ServiceTable services={serviceList} onRefresh={loadServices}/>
                    ) : (
                        <ServiceList services={serviceList} personal={true}/>
                    )}
                </div>
            }
            </>
    );
}