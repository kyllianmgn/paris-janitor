"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { propertiesService } from "@/api/services/properties";
import { Textarea } from "@/components/ui/textarea";
import { PropertyFormData } from "@/types";
import { ArrowLeft } from "lucide-react";
import { EmptyLittlePropertyFormImage, EmptyPropertyFormImage, PropertyFormImage } from "@/components/properties/PropertyFormImage";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {SelectIcon} from "@radix-ui/react-select";
import {Label} from "@/components/ui/label";

const steps = [
    "Property Information",
    "Description and Details",
    "Property Photos",
    "Confirmation"
];

const STORAGE_KEY = 'property_form_draft';

interface PropertyFormDataError extends Omit<PropertyFormData, "files" | "roomCount" | "pricePerNight" | "propertyType">{
    files: string;
    roomCount: string;
    pricePerNight: string;
    propertyType: string
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
            propertyType: "HOUSE",
            roomCount: 0,
            instruction: ''
        };
    });
    const [errors, setErrors] = useState<Partial<PropertyFormDataError>>({});
    const fileUploadInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const savedFormData = {...formData};
        savedFormData.files = [];
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
        fileUploadInputRef.current.click();
    };

    const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!e.target.files) return;
        setFormData(prevState => ({
            ...prevState,
            files: [...prevState.files, ...files],
        }));
        setErrors(prevState => ({...prevState, files: ''}));
    };

    const onFileDelete = (index: number) => {
        setFormData(prevState => ({
            ...prevState,
            files: prevState.files.filter((f, f_index) => f_index !== index),
        }));
    };

    const validateStep = () => {
        const newErrors: Partial<PropertyFormDataError> = {};
        switch (currentStep) {
            case 0:
                if (!formData.address) newErrors.address = 'Address required';
                if (!formData.postalCode) newErrors.postalCode = 'Postal code required';
                if (!formData.city) newErrors.city = 'City required';
                if (!formData.country) newErrors.country = 'Country required';
                if (!formData.pricePerNight) newErrors.pricePerNight = 'Price per night required';
                break;
            case 1:
                if (!formData.description) newErrors.description = 'Description required';
                if (!formData.roomCount || formData.roomCount < 1) newErrors.roomCount = 'Room count required';
                if (!formData.propertyType) newErrors.propertyType = 'Property type required';
                if (!formData.instruction) newErrors.instruction = 'Instruction required';
                break;
            case 2:
                if (!formData.files.length) newErrors.files = 'At least one image required';
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
                    title: "Success",
                    description: "Your property has been created successfully.",
                    variant: "default",
                });
                localStorage.removeItem(STORAGE_KEY);
                router.push('/my-properties');
            } catch (error) {
                console.error('Error creating property:', error);
                toast({
                    title: "Error",
                    description: "An error occurred while creating the property.",
                    variant: "destructive",
                });
            }
        }
    };

    const handleGoBack = () => {
        alert("You are about to leave the page. Your data will be saved locally.");
        router.back();
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid gap-4">
                                <div>
                                    <label htmlFor="address">Address</label>
                                    <Input id="address" name="address" value={formData.address} onChange={handleChange}/>
                                    {errors.address && <span className="text-red-500">{errors.address}</span>}
                                </div>
                                <div>
                                    <label htmlFor="postalCode">Postal Code</label>
                                    <Input id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleChange}/>
                                    {errors.postalCode && <span className="text-red-500">{errors.postalCode}</span>}
                                </div>
                                <div>
                                    <label htmlFor="city">City</label>
                                    <Input id="city" name="city" value={formData.city} onChange={handleChange}/>
                                    {errors.city && <span className="text-red-500">{errors.city}</span>}
                                </div>
                                <div>
                                    <label htmlFor="country">Country</label>
                                    <Input id="country" name="country" value={formData.country} onChange={handleChange}/>
                                    {errors.country && <span className="text-red-500">{errors.country}</span>}
                                </div>
                                <div>
                                    <label htmlFor="pricePerNight">Price per Night</label>
                                    <Input id="pricePerNight" name="pricePerNight" type="number" value={formData.pricePerNight} onChange={handleChange}/>
                                    {errors.pricePerNight && <span className="text-red-500">{errors.pricePerNight}</span>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            case 1:
                return (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid gap-4">
                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea id="description" name="description" value={formData.description} onChange={handleChange}/>
                                    {errors.description && <span className="text-red-500">{errors.description}</span>}
                                </div>
                                <div>
                                    <Label htmlFor="roomCount">Number of Rooms</Label>
                                    <Input type="number" id="roomCount" name="roomCount" value={formData.roomCount} onChange={handleChange}/>
                                    {errors.roomCount && <span className="text-red-500">{errors.roomCount}</span>}
                                </div>
                                <div>
                                    <Select name="propertyType" value={formData.propertyType} onValueChange={(value) => handleChange({ target: { name: 'propertyType', value } } as React.ChangeEvent<HTMLSelectElement>)}>
                                        <SelectGroup>
                                            <SelectLabel>Property Type</SelectLabel>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select your property type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="APARTMENT">Apartment</SelectItem>
                                                <SelectItem value="HOUSE">House</SelectItem>
                                            </SelectContent>
                                        </SelectGroup>

                                    </Select>

                                    {errors.propertyType && <span className="text-red-500">{errors.propertyType}</span>}
                                </div>
                                <div>
                                    <label htmlFor="instruction">Instructions</label>
                                    <Textarea id="instruction" name="instruction" value={formData.instruction} onChange={handleChange}/>
                                    {errors.instruction && <span className="text-red-500">{errors.instruction}</span>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            case 2:
                return (
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="text-lg font-semibold mb-4">Property Photos</h3>
                            <input className="hidden" ref={fileUploadInputRef} type="file" accept="image/*" onChange={onFileUpload} />
                            <Button variant="outline" className="w-full mb-4" onClick={onFileUploadButtonClick}>Upload a Photo</Button>
                            <div className="grid gap-4">
                                <div>
                                    {formData.files && formData.files.length > 0 ? (
                                        <PropertyFormImage onDelete={onFileDelete} index={0} file={formData.files[0]}/>
                                    ) : (
                                        <EmptyPropertyFormImage onUpload={onFileUploadButtonClick} />
                                    )}
                                </div>
                                <div className="grid grid-cols-5 gap-2">
                                    {formData.files.slice(1).map((file, index) => (
                                        <PropertyFormImage key={index} onDelete={onFileDelete} index={index + 1} file={file}/>
                                    ))}
                                    {Array.from({ length: Math.max(0, 5 - formData.files.slice(1).length) }).map((_, index) => (
                                        <EmptyLittlePropertyFormImage key={index} onUpload={onFileUploadButtonClick} />
                                    ))}
                                </div>
                            </div>
                            {errors.files && <span className="text-red-500 mt-2">{errors.files}</span>}
                        </CardContent>
                    </Card>
                );
            case 3:
                return (
                    <Card>
                        <CardContent className="pt-6">
                            <h3 className="text-xl font-semibold mb-4">Property Summary</h3>
                            <div className="grid gap-2">
                                <p><strong>Address:</strong> {formData.address}, {formData.postalCode} {formData.city}, {formData.country}</p>
                                <p><strong>Property Type:</strong> {formData.propertyType }</p>
                                <p><strong>Price per Night:</strong> €{formData.pricePerNight}</p>
                                <p><strong>Number of Rooms:</strong> {formData.roomCount}</p>
                                <p><strong>Description:</strong> {formData.description}</p>
                                <p><strong>Instructions:</strong> {formData.instruction}</p>
                                <p><strong>Number of Photos:</strong> {formData.files.length}</p>
                            </div>
                        </CardContent>
                    </Card>
                );
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <Button onClick={handleGoBack} variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h2 className="text-2xl font-bold mb-4">{steps[currentStep]}</h2>
            <Progress value={(currentStep + 1) / steps.length * 100} className="mb-6"/>
            <div>
                {renderStep()}
                <div className="flex justify-between mt-4">
                    {currentStep > 0 && (
                        <Button type="button" variant="outline" onClick={handlePrevious}>
                            Previous
                        </Button>
                    )}
                    {currentStep < steps.length - 1 ? (
                        <Button type="button" onClick={handleNext}>
                            Next
                        </Button>
                    ) : (
                        <Button type="button" onClick={handleSubmit}>
                            Submit
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};