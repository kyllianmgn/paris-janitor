'use client';
import React, { useEffect, useState } from "react";
import { SubscriptionPlan } from "@/types";
import { getSubscriptionPlan, updateSubscriptionPlan, deleteSubscriptionPlan } from "@/api/services/subscription-service";
import { EntityDetails } from "@/components/public/EntityDetails";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export const SubscriptionPlanDetails: React.FC<{ id: number }> = ({ id }) => {
    const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        loadPlan().then();
    }, [id]);

    const loadPlan = async () => {
        setLoading(true);
        try {
            const response = await getSubscriptionPlan(id);
            setPlan(response.data);
        } catch (error) {
            console.error("Error loading subscription plan:", error);
            toast({
                title: "Error",
                description: "Failed to load subscription plan details",
                variant: "destructive",
            });
        }
        setLoading(false);
    };

    const handleEdit = async (updatedData: Partial<SubscriptionPlan>) => {
        if (!plan) return;
        try {
            const response = await updateSubscriptionPlan(plan.id, updatedData);
            setPlan(response.data);
            toast({
                title: "Success",
                description: "Subscription plan updated successfully",
            });
        } catch (error) {
            console.error("Error updating subscription plan:", error);
            toast({
                title: "Error",
                description: "Failed to update subscription plan",
                variant: "destructive",
            });
        }
    };

    const handleDelete = async () => {
        if (!plan) return;
        try {
            await deleteSubscriptionPlan(plan.id);
            toast({
                title: "Success",
                description: "Subscription plan deleted successfully",
            });
            router.push('/subscription-plans');
        } catch (error) {
            console.error("Error deleting subscription plan:", error);
            toast({
                title: "Error",
                description: "Failed to delete subscription plan",
                variant: "destructive",
            });
        }
    };

    const handleBack = () => {
        router.push('/subscriptions/plans');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!plan) {
        return <div>Subscription plan not found</div>;
    }

    const sections = [
        {
            title: "Plan Information",
            content: (plan: SubscriptionPlan) => (
                <div className="space-y-2">
                    <div><strong>Name:</strong> {plan.name}</div>
                    <div><strong>Description:</strong> {plan.description}</div>
                    <div><strong>Monthly Price:</strong> €{plan.monthlyPrice}</div>
                    <div><strong>Yearly Price:</strong> €{plan.yearlyPrice}</div>
                </div>
            ),
        },
        {
            title: "Stripe Information",
            content: (plan: SubscriptionPlan) => (
                <div className="space-y-2">
                    <div><strong>Stripe Product ID:</strong> {plan.stripeProductId}</div>
                    <div><strong>Stripe Monthly Price ID:</strong> {plan.stripePriceIdMonthly}</div>
                    <div><strong>Stripe Yearly Price ID:</strong> {plan.stripePriceIdYearly}</div>
                </div>
            ),
        },
    ];

    const actions = (
        <div className="space-x-2">
            <Button onClick={handleBack}>Back</Button>
            <Button onClick={() => handleEdit(plan)}>Edit</Button>
            <Button onClick={handleDelete} variant="destructive">Delete</Button>
        </div>
    );

    return <EntityDetails entity={plan} title={`Subscription Plan Details: ${plan.name}`} sections={sections} actions={actions} />;
};