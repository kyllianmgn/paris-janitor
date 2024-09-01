'use client';
import React, { useState, useEffect } from 'react';
import {SubscriptionPlan, ApiResponse, UserType} from '@/types';
import DataTable from '@/components/public/DataTable';
import CrudModal from '@/components/public/CrudModal';
import { getSubscriptionPlans, createSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan } from '@/api/services/subscription-service';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";

const STORAGE_KEY = 'subscription_plan_draft';

const saveDraftToLocalStorage = (data: Partial<SubscriptionPlan>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const loadDraftFromLocalStorage = (): Partial<SubscriptionPlan> | null => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
};

const clearDraftFromLocalStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
};

const SubscriptionPlanTable: React.FC = () => {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete'>('create');
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

    const router = useRouter();
    const { toast } = useToast();

    const fetchPlans = async () => {
        setIsLoading(true);
        try {
            const response: ApiResponse<SubscriptionPlan[]> = await getSubscriptionPlans();
            setPlans(response.data);
        } catch (error) {
            console.error('Error fetching subscription plans:', error);
            toast({
                title: "Error",
                description: "Failed to fetch subscription plans",
                variant: "destructive",
            });
        }
        setIsLoading(false);
    };

    const [draftPlan, setDraftPlan] = useState<Partial<SubscriptionPlan> | null>(null);

    useEffect(() => {
        fetchPlans().then();
        const savedDraft = loadDraftFromLocalStorage();
        if (savedDraft) {
            setDraftPlan(savedDraft);
        }
    }, []);

    const handleCreate = () => {
        setSelectedPlan(draftPlan || null);
        setModalMode('create');
        setModalOpen(true);
    };

    const handleEdit = (id: number) => {
        const plan = plans.find(p => p.id === id);
        if (plan) {
            setSelectedPlan(plan);
            setModalMode('edit');
            setModalOpen(true);
            clearDraftFromLocalStorage();
        }
    };

    const handleSubmit = async (data: Partial<SubscriptionPlan>) => {
        try {
            // Traiter le champ features
            if (typeof data.features === 'string') {
                try {
                    data.features = JSON.parse(data.features);
                } catch {
                    // Si ce n'est pas un JSON valide, on le traite comme un texte simple
                    data.features = { description: data.features };
                }
            }

            if (modalMode === 'create') {
                await createSubscriptionPlan(data);
                toast({
                    title: "Success",
                    description: "Subscription plan created successfully",
                });
                clearDraftFromLocalStorage();
            } else if (modalMode === 'edit' && selectedPlan) {
                console.log("je suis dans le handleSubmit");
                console.log("DATA", data);
                console.log("SELECTEDPLAN", selectedPlan);

                await updateSubscriptionPlan(selectedPlan.id, data);
                toast({
                    title: "Success",
                    description: "Subscription plan updated successfully",
                });
            } else if (modalMode === 'delete' && selectedPlan) {
                await deleteSubscriptionPlan(selectedPlan.id);
                toast({
                    title: "Success",
                    description: "Subscription plan deleted successfully",
                });
            }
            fetchPlans();
            setModalOpen(false);
            setDraftPlan(null);
        } catch (error) {
            console.error('Error submitting subscription plan:', error);
            toast({
                title: "Error",
                description: "Failed to submit subscription plan",
                variant: "destructive",
            });
        }
    };

    const handleModalClose = () => {
        if (modalMode === 'create') {
            saveDraftToLocalStorage(selectedPlan || {});
            setDraftPlan(selectedPlan || null);
        }
        setModalOpen(false);
    };
    const handleDelete = (id: number) => {
        const plan = plans.find(p => p.id === id);
        if (plan) {
            setSelectedPlan(plan);
            setModalMode('delete');
            setModalOpen(true);
        }
    };

    const handleDetails = (id: number) => {
        router.push(`/subscriptions/plans/${id}`);
    };


    const columns = [
        { key: 'name', header: 'Name' },
        { key: 'description', header: 'Description' },
        { key: 'monthlyPrice', header: 'Monthly Price' },
        { key: 'yearlyPrice', header: 'Yearly Price' },
        { key: 'userType', header: 'User Type' },
    ];

    const modalFields = [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'monthlyPrice', label: 'Monthly Price', type: 'number', required: true },
        { name: 'yearlyPrice', label: 'Yearly Price', type: 'number', required: true },
        { name: 'userType', label: 'User Type', type: 'select', options: Object.values(UserType), required: true },
        { name: 'features', label: 'Features', type: 'textarea', required: true },
    ];

    return (
        <div className="space-y-4">
            <Button onClick={handleCreate}>
                {draftPlan ? "Continue Draft" : "Create New Plan"}
            </Button>
            <DataTable
                data={plans}
                columns={columns}
                onUpdate={handleEdit}
                onDelete={handleDelete}
                onDetails={handleDetails}
                totalCount={plans.length}

            />
            <CrudModal
                isOpen={modalOpen}
                onClose={handleModalClose}
                onSubmit={handleSubmit}
                fields={modalFields}
                title={`${modalMode.charAt(0).toUpperCase() + modalMode.slice(1)} Subscription Plan`}
                initialData={selectedPlan || {}}
                mode={modalMode}
                additionalActions={
                    modalMode === 'create' && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                clearDraftFromLocalStorage();
                                setDraftPlan(null);
                                setSelectedPlan(null);
                            }}
                        >
                            Clear Draft
                        </Button>
                    )
                }
            />
        </div>
    );
};

export default SubscriptionPlanTable;