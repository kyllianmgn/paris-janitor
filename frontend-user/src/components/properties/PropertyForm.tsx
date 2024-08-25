"use client"

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { propertiesService } from "@/api/services/properties";
import { Textarea } from "@/components/ui/textarea";
import {PropertyFormData, ServiceFormData} from "@/types";
import { ArrowLeft } from "lucide-react";

const steps = [
    "Informations du bien",
    "Description",
    "Photo de votre bien",
    "Confirmation"
];

const STORAGE_KEY = 'property_form_draft';

interface PropertyFormDataError extends Omit<PropertyFormData, "files">{
    files: string;
}

const PropertyFormImage = ({file, onDelete, index}: {file: File, onDelete: (index: number) => void, index: number}) => {
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        const loadImage = async () => {
            if (file) {
                const imageDataUrl = await readFileImage(file);
                setImageSrc(imageDataUrl);
            }
        };
        loadImage().then();
    }, [file]);

    const promiseReadFile = (file: File) => {
        const fr = new FileReader();

        return new Promise<string>((resolve, reject) => {
            fr.onerror = () => {
                fr.abort()
                reject(new DOMException("Could not read file"));
            }

            fr.onloadend = () => {
                if (fr.result !== null){
                    resolve(String(fr.result))
                }
            }
            fr.readAsDataURL(file);
        })
    }

    const readFileImage = async (file: File) => {
        return await promiseReadFile(file)
    }

    const handleFileDelete = () => {
        onDelete(index)
    }

    return <img src={imageSrc} alt="Uploaded" onClick={handleFileDelete}/>;
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
                files: []
                pricePerNight: 0,
            };
        }
        return {
            address: '',
            postalCode: '',
            city: '',
            country: '',
            description: '',
            pricePerNight: 0,
            files: []
        };
    });
    const [errors, setErrors] = useState<Partial<PropertyFormDataError>>({});

    useEffect(() => {
        // Sauvegarde automatique des données du formulaire
        const savedFormData = {...formData}
        savedFormData.files = []
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedFormData));
    }, [formData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };

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
                router.push('/properties');
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
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h3>Photo de votre bien</h3>
                        <input type={"file"} accept="image/*" onChange={onFileUpload} />
                        {
                            formData.files.map((file: File, index: number) =>
                                (<div>
                                    {file.name}
                                    <PropertyFormImage onDelete={onFileDelete} index={index} key={index} file={file}/>
                                </div>)
                            )
                        }
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