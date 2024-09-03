'use client';
import React, { useEffect, useState } from "react";
import { Subscription } from "@/types";
import { getSubscription, updateSubscription, cancelSubscription } from "@/api/services/subscription-service";
import { EntityDetails } from "@/components/public/EntityDetails";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export const SubscriptionDetails: React.FC<{ id: number }> = ({ id }) => {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        loadSubscription();
    }, [id]);

    const loadSubscription = async () => {
        setLoading(true);
        try {
            const response = await getSubscription(id);
            setSubscription(response.data);
        } catch (error) {
            console.error("Error loading subscription:", error);
            toast({
                title: "Error",
                description: "Failed to load subscription details",
                variant: "destructive",
            });
        }
        setLoading(false);
    };

    const handleEdit = async (updatedData: Partial<Subscription>) => {
        if (!subscription) return;
        try {
            const response = await updateSubscription(subscription.id, updatedData);
            setSubscription(response.data);
            toast({
                title: "Success",
                description: "Subscription updated successfully",
            });
        } catch (error) {
            console.error("Error updating subscription:", error);
            toast({
                title: "Error",
                description: "Failed to update subscription",
                variant: "destructive",
            });
        }
    };

    const handleCancel = async () => {
        if (!subscription) return;
        try {
            await cancelSubscription(subscription.id);
            toast({
                title: "Success",
                description: "Subscription canceled successfully",
            });
            router.push('/subscriptions');
        } catch (error) {
            console.error("Error canceling subscription:", error);
            toast({
                title: "Error",
                description: "Failed to cancel subscription",
                variant: "destructive",
            });
        }
    };

    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!subscription) {
        return <div>Subscription not found</div>;
    }

    const sections = [
        {
            title: "Subscription Information",
            content: (subscription: Subscription) => (
                <div className="space-y-2">
                    <div><strong>User ID:</strong> {subscription.userId}</div>
                    <div><strong>Plan ID:</strong> {subscription.planId}</div>
                    <div><strong>Status:</strong> {subscription.status}</div>
                    <div><strong>Start Date:</strong> {new Date(subscription.startDate).toLocaleDateString()}</div>
                    {subscription.endDate && <div><strong>End Date:</strong> {new Date(subscription.endDate).toLocaleDateString()}</div>}
                </div>
            ),
        },
        {
            title: "Stripe Information",
            content: (subscription: Subscription) => (
                <div className="space-y-2">
                    <div><strong>Stripe Subscription ID:</strong> {subscription.stripeSubscriptionId}</div>
                </div>
            ),
        },
    ];

    const actions = (
        <div className="space-x-2">
            <Button onClick={handleBack}>Back</Button>
            <Button onClick={() => handleEdit(subscription)}>Edit</Button>
            <Button onClick={handleCancel} variant="destructive">Cancel Subscription</Button>
        </div>
    );

    return <EntityDetails entity={subscription} title={`Subscription Details: ${subscription.id}`} sections={sections} actions={actions} />;
};