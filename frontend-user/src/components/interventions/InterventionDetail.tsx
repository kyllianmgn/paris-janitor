"use client"
import React, {useEffect, useRef, useState} from "react";
import {Intervention, InterventionStatus} from "@/types";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {ArrowLeft, Calendar, Edit, Settings} from "lucide-react";
import {useRouter} from "next/navigation";
import {InterventionForm, serviceInterventionsService} from "@/api/services/service-interventions";
import {Textarea} from "@/components/ui/textarea";

export interface InterventionDetailProps {
    interventionId: number
}

export const InterventionDetails = ({ interventionId }: InterventionDetailProps) => {
    const [intervention, setIntervention] = useState<Intervention | null>(null);
    const [interventionForm, setInterventionForm] = useState<InterventionForm | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter()
    const interventionTextAreaRef = useRef<HTMLTextAreaElement>(null);

    const loadService = async () => {
        if (interventionId) {
            const res = await serviceInterventionsService.getIntervention(interventionId);
            setIntervention(res.data);
            setLoading(false);
        }
    };

    const loadInterventionForm = async () => {
        const res = await serviceInterventionsService.getInterventionForm(interventionId);
        setInterventionForm(res.data)
        if (res.data.comment && interventionTextAreaRef.current){
            interventionTextAreaRef.current.value = res.data.comment
        }
    }

    const uploadInterventionForm = async () => {
        if (interventionTextAreaRef.current && interventionTextAreaRef.current.value) {
            const res = await serviceInterventionsService.createInterventionForm(interventionId, interventionTextAreaRef.current.value);
            setInterventionForm(res.data);
            if (res.data.comment){
                interventionTextAreaRef.current.value = res.data.comment
            }
        }
    }

    const cancelIntervention = async () => {
        if (!intervention?.serviceId) return;
        const res = await serviceInterventionsService.updateIntervention(interventionId, {serviceId: intervention?.serviceId, propertyOccupationId: intervention?.propertyOccupationId, providerOccupationId: intervention?.providerOccupationId, additionalPrice: intervention?.additionalPrice,status: InterventionStatus.CANCELLED} as Intervention)
        setIntervention(res.data)
    }

    const completeIntervention = async () => {
        if (!intervention?.serviceId || !intervention?.providerOccupationId || !intervention?.additionalPrice) return;
        const res = await serviceInterventionsService.updateIntervention(interventionId, {
            serviceId: intervention?.serviceId,
            propertyOccupationId: intervention?.propertyOccupationId,
            providerOccupationId: intervention?.providerOccupationId,
            additionalPrice: intervention?.additionalPrice,
            status: InterventionStatus.COMPLETED
        } as Intervention)
        setIntervention(res.data)
    }

    useEffect(() => {
        loadInterventionForm().then();
    }, [intervention]);

    useEffect(() => {
        loadService().then();
    }, [interventionId]);

    const handleGoBack = () => {
        router.push('/interventions');
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!intervention) {
        return <div className="text-center mt-10">Service not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Service Details</h1>
                <div className="space-x-2">
                    <Button
                        onClick={handleGoBack}
                        variant="ghost"
                        className="mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
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
                        <p><strong>Nom:</strong> {intervention.service?.name}</p>
                        {
                            intervention.service?.type == "INTERVENTION" &&
                            <>
                                <p><strong>Client
                                    :</strong> {intervention.propertyOccupation?.property?.landlord?.user?.firstName} {intervention.propertyOccupation?.property?.landlord?.user?.lastName}
                                </p>
                                <p><strong>Propriétés :</strong> {intervention.propertyOccupation?.property?.address} - {intervention.propertyOccupation?.property?.city}, {intervention.propertyOccupation?.property?.country}</p>
                            </>
                        }
                        <h1>Status : {intervention.status}</h1>
                        {intervention.status === "PLANNED" && <Button onClick={cancelIntervention}>Annulez l&apos;intervention</Button>}
                        {intervention.status === "IN_PROGRESS" && <Button onClick={completeIntervention}>Complété l&apos;intervention</Button>}
                    </CardContent>
                </Card>
                {/* Placeholder for future information */}
                <Card>
                    <CardHeader>
                    <CardTitle>Formulaire d&apos;intervention</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {
                            intervention.status === "COMPLETED" &&
                            <>
                                <p>Veuillez rentrer le récapitulatif de votre intervention</p>
                                <Textarea ref={interventionTextAreaRef}/>
                                <p className={"text-sm text-gray-500"}>Dernière mise à jour
                                    : {interventionForm?.updatedAt ? `${String(interventionForm?.updatedAt).split('T')[0]} à ${String(interventionForm?.updatedAt).split('T')[1].split('.')[0]} ` : "Aucune"}</p>
                                <Button
                                    onClick={uploadInterventionForm}>{!interventionForm ? "Envoyer votre compte rendu" : "Mettre a jour votre compte rendu"}</Button>
                            </>
                        }
                        {
                            intervention.status !== "COMPLETED" &&
                            <h1>Intervention non finie, veuillez terminer l&apos;intervention avant de remplir le formulaire</h1>
                        }
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
        </div>
    );
};