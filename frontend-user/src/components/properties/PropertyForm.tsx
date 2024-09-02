"use client"

import React, {useState, useEffect, useRef} from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { propertiesService } from "@/api/services/properties";
import { Textarea } from "@/components/ui/textarea";
import {PropertyFormData, ServiceFormData} from "@/types";
import { ArrowLeft } from "lucide-react";
import {
    EmptyLittlePropertyFormImage,
    EmptyPropertyFormImage,
    PropertyFormImage
} from "@/components/properties/PropertyFormImage";
import {Select} from "react-day-picker";

const steps = [
    "Informations du bien",
    "Description",
    "Photo de votre bien",
    "Confirmation"
];

const STORAGE_KEY = 'property_form_draft';

interface PropertyFormDataError extends Omit<PropertyFormData, "files" | "roomCount">{
    files: string;
    roomCount: string;
}

export const PropertyForm = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<PropertyFormData>(() => {
        if (typeof window !== 'undefined') {
            const savedData = localStorage.getItem(STORAGE_KEY);
            return savedData ? JSON.parse(savedData) : {
                address: '',
                postalCode: '',
                city: '',
                country: '',
                description: '',
                files: [],
                pricePerNight: 0,
                roomCount: 0,
                instruction: '',
                propertyType: "HOUSE"
            };
        }
        return {
            address: '',
            postalCode: '',
            city: '',
            country: '',
            description: '',
            pricePerNight: 0,
            files: [],
            propertyType: "HOUSE"
        };
    });
    const [errors, setErrors] = useState<Partial<PropertyFormDataError>>({});
    const fileUploadInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // Sauvegarde automatique des données du formulaire
        const savedFormData = {...formData}
        savedFormData.files = []
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedFormData));
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };

    const onFileUploadButtonClick = () => {
        if (!fileUploadInputRef.current) return;
        fileUploadInputRef.current.click()
    }

    const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);

        if (!e.target.files) return;
        setFormData(prevState => ({
            ...prevState,
            files: [...prevState.files, ...files],

        }))
        setErrors(prevState => ({...prevState, files: ''}))
    }

    const onFileDelete = (index: number) => {
        setFormData(prevState => ({
            ...prevState,
            files: prevState.files.filter((f, f_index) => f_index !== index),
        }))
    }

    const validateStep = () => {
        const newErrors: Partial<PropertyFormDataError> = {};
        switch (currentStep) {
            case 0:
                if (!formData.address) newErrors.address = 'Adresse requise';
                if (!formData.postalCode) newErrors.postalCode = 'Code postal requis';
                if (!formData.city) newErrors.city = 'Ville requise';
                if (!formData.country) newErrors.country = 'Pays requis';
                break;
            case 1:
                if (!formData.description) newErrors.description = 'Description requise';
                if (!formData.roomCount) newErrors.roomCount = 'Description requise';
                if (!formData.instruction) newErrors.instruction = 'Description requise';
                break;
            case 2:
                if (!formData.files.length) newErrors.files = 'Photo requise';
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
        if (validateStep()) {
            try {
                await propertiesService.createProperty(formData);
                toast({
                    title: "Succès",
                    description: "Votre bien a été créé avec succès.",
                    variant: "default",
                });
                localStorage.removeItem(STORAGE_KEY); // Supprime le brouillon après soumission réussie
                router.push('/my-properties');
            } catch (error) {
                console.error('Error creating property:', error);
                toast({
                    title: "Erreur",
                    description: "Une erreur est survenue lors de la création du bien.",
                    variant: "destructive",
                });
            }
        }
    };

    const handleGoBack = () => {
        const confirmLeave = window.confirm("Êtes-vous sûr de vouloir quitter ? Vos données seront sauvegardées localement.");
        if (confirmLeave) {
            router.push('/properties');
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="grid gap-4">
                        <div>
                            <label htmlFor="address">Adresse</label>
                            <Input id="address" name="address" value={formData.address} onChange={handleChange}/>
                            {errors.address && <span className="text-red-500">{errors.address}</span>}
                        </div>
                        <div>
                            <label htmlFor="postalCode">Code postal</label>
                            <Input id="postalCode" name="postalCode" value={formData.postalCode}
                                   onChange={handleChange}/>
                            {errors.postalCode && <span className="text-red-500">{errors.postalCode}</span>}
                        </div>
                        <div>
                            <label htmlFor="city">Ville</label>
                            <Input id="city" name="city" value={formData.city} onChange={handleChange}/>
                            {errors.city && <span className="text-red-500">{errors.city}</span>}
                        </div>
                        <div>
                            <label htmlFor="country">Pays</label>
                            <Input id="country" name="country" value={formData.country} onChange={handleChange}/>
                            {errors.country && <span className="text-red-500">{errors.country}</span>}
                        </div>
                        <div>
                            <label htmlFor="pricePerNight">Prix par nuit</label>
                            <Input id="pricePerNight" name="pricePerNight" type="number" value={formData.pricePerNight} onChange={handleChange}/>
                            {errors.pricePerNight && <span className="text-red-500">{errors.pricePerNight}</span>}
                        </div>
                    </div>
                );
            case 1:
                return (
                    <div>
                        <label htmlFor="description">Description</label>
                        <Textarea id="description" name="description" value={formData.description}
                                  onChange={handleChange}/>
                        {errors.description && <span className="text-red-500">{errors.description}</span>}
                        <label htmlFor="roomCount">Nombre de chambre</label>
                        <Input type={"number"} id="roomCount" name="roomCount" value={formData.roomCount} onChange={handleChange}/>
                        {errors.roomCount && <span className="text-red-500">{errors.roomCount}</span>}
                        <label htmlFor="propertyType">Type de bien</label>
                        <Select id="propertyType" name="propertyType" value={formData.propertyType} onChange={handleChange}>
                            <option value={"HOUSE"}>Maison</option>
                            <option value={"APPARTEMENT"}>Appartement</option>
                        </Select>
                        <label htmlFor="instruction">Instruction</label>
                        <Textarea id="instruction" name="instruction" value={formData.instruction} onChange={handleChange}/>
                        {errors.instruction && <span className="text-red-500">{errors.instruction}</span>}
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h3>Photo de votre bien</h3>
                        <input className={"hidden"} ref={fileUploadInputRef} type={"file"} accept="image/*" onChange={onFileUpload} />
                        <div className={"w-full cursor-pointer bg-gray-100 hover:bg-gray-300 border-2 border-gray-300 text-center h-7 rounded-lg mb-2"} onClick={onFileUploadButtonClick}>Uploadez une photo</div>
                        <div className={"flex flex-col gap-2"}>
                            <div>
                                {
                                    formData.files && formData.files.length > 0 &&
                                    <PropertyFormImage onDelete={onFileDelete} index={0} file={formData.files[0]}/>
                                }
                                {
                                    formData.files && formData.files.length <= 0 && <EmptyPropertyFormImage onUpload={onFileUploadButtonClick}></EmptyPropertyFormImage>
                                }
                            </div>
                            <div className={"flex flex-row gap-2"}>
                                {
                                    formData.files.map((file: File, index: number) =>
                                        {
                                            if (index < 1) return null;
                                            return (
                                                <PropertyFormImage onDelete={onFileDelete} index={index} file={file}/>
                                            )
                                        }
                                    )
                                }
                                {
                                    Array.from(Array(5 - formData.files.slice(1,formData.files.length).length).keys()).map((_, index) => (
                                        <EmptyLittlePropertyFormImage onUpload={onFileUploadButtonClick}></EmptyLittlePropertyFormImage>
                                    ))
                                }
                            </div>
                        </div>
                        {errors.files && <span className="text-red-500">{errors.files}</span>}
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h3>Résumé de votre bien</h3>
                        <p>Adresse: {formData.address}, {formData.postalCode} {formData.city}, {formData.country}</p>
                        <p>Prix par nuit: {formData.pricePerNight}€</p>
                        <p>Description: {formData.description}</p>
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