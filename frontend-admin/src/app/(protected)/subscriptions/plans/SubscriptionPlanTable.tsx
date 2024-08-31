'use client';
import React, { useState, useEffect } from 'react';
import { SubscriptionPlan, ApiResponse } from '@/types';
import DataTable from '@/components/public/DataTable';
import CrudModal from '@/components/public/CrudModal';
import { getSubscriptionPlans, createSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan } from '@/api/services/subscription-service';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";

const SubscriptionPlanTable: React.FC = () => {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete'>('create');
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        fetchPlans();
    }, []);

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

    const handleCreate = () => {
        setSelectedPlan(null);
        setModalMode('create');
        setModalOpen(true);
    };

    const handleEdit = (id: number) => {
        const plan = plans.find(p => p.id === id);
        if (plan) {
            setSelectedPlan(plan);
            setModalMode('edit');
            setModalOpen(true);
        }
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

    const handleSubmit = async (data: Partial<SubscriptionPlan>) => {
        try {
            if (modalMode === 'create') {
                await createSubscriptionPlan(data);
                toast({
                    title: "Success",
                    description: "Subscription plan created successfully",
                });
            } else if (modalMode === 'edit' && selectedPlan) {
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
        } catch (error) {
            console.error('Error submitting subscription plan:', error);
            toast({
                title: "Error",
                description: "Failed to submit subscription plan",
                variant: "destructive",
            });
        }
    };

    const columns = [
        { key: 'name', header: 'Name' },
        { key: 'description', header: 'Description' },
        { key: 'monthlyPrice', header: 'Monthly Price' },
        { key: 'yearlyPrice', header: 'Yearly Price' },
    ];

    const modalFields = [
        { name: 'name', label: 'Name', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'monthlyPrice', label: 'Monthly Price', type: 'number', required: true },
        { name: 'yearlyPrice', label: 'Yearly Price', type: 'number', required: true },
    ];

    return (
        <div className="space-y-4">
            <Button onClick={handleCreate}>Create New Plan</Button>
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
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                fields={modalFields}
                title={`${modalMode.charAt(0).toUpperCase() + modalMode.slice(1)} Subscription Plan`}
                initialData={selectedPlan || {}}
                mode={modalMode}
            />
        </div>
    );
};

export default SubscriptionPlanTable;