"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { propertiesService } from "@/api/services/properties";
import { Textarea } from "@/components/ui/textarea";
import {ServiceFormData} from "@/types";
import { ArrowLeft } from "lucide-react";
import {servicesService} from "@/api/services/services";
import {Select} from "react-day-picker";

const steps = [
    "Informations du service",
    "Confirmation"
];

interface ServiceFromDataError extends Omit<ServiceFormData, "basePrice">{
    basePrice: string;
}

const STORAGE_KEY = 'service_form_draft';

export const ServiceForm = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<ServiceFormData>(() => {
        if (typeof window !== 'undefined') {
            const savedData = localStorage.getItem(STORAGE_KEY);
            return savedData ? JSON.parse(savedData) : {
                name: '',
                description: '',
                basePrice: '',
            };
        }
        return {
            name: '',
            description: '',
            basePrice: '',
        };
    });
    const [errors, setErrors] = useState<Partial<ServiceFromDataError>>({});

    useEffect(() => {
        // Sauvegarde automatique des données du formulaire
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };

    const validateStep = () => {
        const newErrors: Partial<ServiceFromDataError> = {};
        switch (currentStep) {
            case 0:
                if (!formData.name) newErrors.name = 'Nom requise';
                if (!formData.description) newErrors.description = 'Code postal requis';
                if (!formData.basePrice) newErrors.basePrice = 'Ville requise';
                break;
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validateStep() && currentStep === steps.length-1) {
            try {
                await servicesService.createService(formData);
                toast({
                    title: "Succès",
                    description: "Votre service a été ajouté avec succès. Votre compte est maintenant en attente de revalidation.",
                    variant: "default",
                });
                localStorage.removeItem(STORAGE_KEY); // Supprime le brouillon après soumission réussie
                router.push('/my-services');
            } catch (error) {
                console.error('Error creating service:', error);
                toast({
                    title: "Erreur",
                    description: "Une erreur est survenue lors de la création du service.",
                    variant: "destructive",
                });
            }
        }
    };

    const handleGoBack = () => {
        const confirmLeave = window.confirm("Êtes-vous sûr de vouloir quitter ? Vos données seront sauvegardées localement.");
        if (confirmLeave) {
            router.push('/my-services');
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <>
                        <div className="grid gap-4">
                            <div>
                                <label htmlFor="name">Nom</label>
                                <Input id="name" name="name" value={formData.name} onChange={handleChange} />
                                {errors.name && <span className="text-red-500">{errors.name}</span>}
                            </div>
                            <div>
                                <label htmlFor="description">Description</label>
                                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} />
                                {errors.description && <span className="text-red-500">{errors.description}</span>}
                            </div>
                            <div>
                                <label htmlFor="basePrice">Prix de base</label>
                                <Input id="basePrice" type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} />
                                {errors.basePrice && <span className="text-red-500">{errors.basePrice}</span>}
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="type">Type de service</label>
                                <Select style={{borderWidth: "1px"}} className="p-2 bg-white border-gray-200 rounded-lg" id="type" name="type" value={formData.type} onChange={handleChange}>
                                    <option value={"INTERVENTION"}>Intervention (Nécéssite une intervention dans le logement)</option>
                                    <option value={"MISSION"}>Mission (S&apos;éffectue en dehors du logement)</option>
                                </Select>
                            </div>
                        </div>
                    </>
                );
            case 1:
                return (
                    <div>
                        <h3>Résumé de votre service</h3>
                        <p>Nom: {formData.name}</p>
                        <p>Description: {formData.description}</p>
                        <p>Prix de base: {formData.basePrice}</p>
                    </div>
                );
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <Button
                onClick={handleGoBack}
                variant="ghost"
                className="mb-4"
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Retour
            </Button>
            <h2 className="text-2xl font-bold mb-4">{steps[currentStep]}</h2>
            <Progress value={(currentStep + 1) / steps.length * 100} className="mb-6"/>
            <form onSubmit={handleSubmit}>
                {renderStep()}
                <div className="flex justify-between mt-4">
                    {currentStep > 0 && (
                        <Button type="button" variant="outline" onClick={handlePrevious}>
                            Précédent
                        </Button>
                    )}

                    {currentStep < steps.length - 1 && (
                        <Button type="button" onClick={handleNext}>
                            Suivant
                        </Button>
                    )}
                    {currentStep >= steps.length - 1 &&
                        <Button type="submit">
                            Soumettre
                        </Button>
                    }
                </div>
            </form>
        </div>
    );
};