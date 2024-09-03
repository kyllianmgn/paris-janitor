'use client';
import React, { useState, useEffect } from 'react';
import { Subscription, ApiResponse, SubscriptionRequest } from '@/types';
import DataTable from '@/components/public/DataTable';
import CrudModal from '@/components/public/CrudModal';
import { getSubscriptions, createSubscription, updateSubscription, cancelSubscription } from '@/api/services/subscription-service';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";

const SubscriptionTable: React.FC = () => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'delete'>('create');
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);

    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        fetchSubscriptions().then();
    }, []);

    const fetchSubscriptions = async () => {
        setIsLoading(true);
        try {
            const response: ApiResponse<Subscription[]> = await getSubscriptions();
            setSubscriptions(response.data);
        } catch (error) {
            console.error('Error fetching subscriptions:', error);
            toast({
                title: "Error",
                description: "Failed to fetch subscriptions",
                variant: "destructive",
            });
        }
        setIsLoading(false);
    };

    const handleCreate = () => {
        setSelectedSubscription(null);
        setModalMode('create');
        setModalOpen(true);
    };

    const handleEdit = (id: number) => {
        const subscription = subscriptions.find(s => s.id === id);
        if (subscription) {
            setSelectedSubscription(subscription);
            setModalMode('edit');
            setModalOpen(true);
        }
    };

    const handleCancel = (id: number) => {
        const subscription = subscriptions.find(s => s.id === id);
        if (subscription) {
            setSelectedSubscription(subscription);
            setModalMode('delete');
            setModalOpen(true);
        }
    };

    const handleDetails = (id: number) => {
        router.push(`/subscriptions/${id}`);
    };

    const handleSubmit = async (data: SubscriptionRequest | Partial<Subscription>) => {
        try {
            if (modalMode === 'create') {
                await createSubscription(data as SubscriptionRequest);
                toast({
                    title: "Success",
                    description: "Subscription created successfully",
                });
            } else if (modalMode === 'edit' && selectedSubscription) {
                await updateSubscription(selectedSubscription.id, data);
                toast({
                    title: "Success",
                    description: "Subscription updated successfully",
                });
            } else if (modalMode === 'delete' && selectedSubscription) {
                await cancelSubscription(selectedSubscription.id);
                toast({
                    title: "Success",
                    description: "Subscription canceled successfully",
                });
            }
            fetchSubscriptions().then();
            setModalOpen(false);
        } catch (error) {
            console.error('Error submitting subscription:', error);
            toast({
                title: "Error",
                description: "Failed to submit subscription",
                variant: "destructive",
            });
        }
    };

    const columns: {key: keyof Subscription, header: string}[] = [
        { key: "userId", header: 'User ID' },
        { key: 'planId', header: 'Plan ID' },
        { key: 'status', header: 'Status' },
        { key: 'startDate', header: 'Start Date' },
        { key: 'endDate', header: 'End Date' },
    ];

    const modalFields = [
        { name: 'userId', label: 'User ID', type: 'number', required: true },
        { name: 'planId', label: 'Plan ID', type: 'number', required: true },
        { name: 'status', label: 'Status', type: 'select', options: ['ACTIVE', 'CANCELED', 'EXPIRED'], required: true },
        { name: 'startDate', label: 'Start Date', type: 'date', required: true },
        { name: 'endDate', label: 'End Date', type: 'date' },
    ];

    return (
        <div className="space-y-4">
            <Button onClick={() => router.push('/subscriptions/plans')}
                variant="outline"
                className="mr-2"
            >Manage Subscription Plans</Button>
            <Button onClick={handleCreate}>Create New Subscription</Button>
            <DataTable
                data={subscriptions}
                columns={columns}
                onUpdate={handleEdit}
                onDelete={handleCancel}
                onDetails={handleDetails}
                totalCount={subscriptions.length}
            />
            <CrudModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                fields={modalFields}
                title={`${modalMode.charAt(0).toUpperCase() + modalMode.slice(1)} Subscription`}
                initialData={selectedSubscription || {}}
                mode={modalMode}
            />
        </div>
    );
};

export default SubscriptionTable;