"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle, List, Grid } from "lucide-react";
import {Intervention, InterventionStatus, Service} from "@/types";
import {useSelector} from "react-redux";
import {RootState} from "@/store";
import {serviceInterventionsService} from "@/api/services/service-interventions";
import {InterventionList} from "@/components/interventions/InterventionList";
import {Select} from "@/components/ui/select";

export const MyInterventions = () => {
    const router = useRouter();
    const [interventionList, setInterventionList] = useState<Intervention[]>([]);
    const [serviceList, setServiceList] = useState<Service[]>([]);
    const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
    const [isClient, setIsClient] = useState(false);

    const loadInterventions = async () => {
        try {
            const res = await serviceInterventionsService.getMyInterventions();
            setInterventionList(res.data);
        } catch (error) {
            console.error("Failed to load interventions:", error);
            alert("Failed to load interventions. Please try again later.");
        }
    };


    useEffect(() => {
        setIsClient(true)
        loadInterventions().then();
    }, []);

    const handleAddIntervention = () => {
        router.push("/my-interventions/new");
    }

    const toggleViewMode = () => {
        setViewMode(prevMode => prevMode === 'table' ? 'grid' : 'table');
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">My Interventions</h1>
                <div className="flex space-x-2">
                </div>
            </div>
                <Select>

                </Select>
                <InterventionList interventions={interventionList} personal={true} />
        </div>
    );
}