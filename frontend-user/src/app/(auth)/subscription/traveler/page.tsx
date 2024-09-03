'use client';

import React, { useEffect, useState } from 'react';
import { SubscriptionPlan } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import {getTravelerSubscriptionPlans, travelerSubscriptions} from "@/api/services/subscriptions";

export default function TravelerSubscriptionPage() {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await getTravelerSubscriptionPlans();
                setPlans(response.data);
            } catch (error) {
                console.error('Error fetching subscription plans:', error);
                toast({
                    title: 'Error',
                    description: 'Failed to load subscription plans. Please try again later.',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchPlans().then();
    }, [toast]);


    const handleSubscribe = async (plan: SubscriptionPlan, type: 'monthly' | 'annually') => {
        try {
            const res = await travelerSubscriptions(plan.name, type)
            if (res.sessionUrl){
                router.push(res.sessionUrl)
            }
            console.log(`Subscribing to ${plan.name} (${type})`);
        } catch (error) {
            console.error('Error subscribing:', error);
            toast({
                title: 'Error',
                description: 'Failed to initiate subscription. Please try again.',
                variant: 'destructive',
            });
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">Choose Your Travel Plan</h1>
            <div className="grid md:grid-cols-2 gap-8">
                {plans.map((plan) => (
                    <Card key={plan.id} className="flex flex-col">
                        <CardHeader>
                            <CardTitle>{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <ul className="list-disc list-inside space-y-2">
                                {Object.entries(plan.features as Record<string, string>).map(([key, value]) => (
                                    <li key={key}>{value}</li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Tabs defaultValue="monthly" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                                    <TabsTrigger value="annually">Annually</TabsTrigger>
                                </TabsList>
                                <TabsContent value="monthly" className="mt-4">
                                    <div className="text-2xl font-bold mb-4">€{plan.monthlyPrice} / month</div>
                                    <Button className="w-full" onClick={() => handleSubscribe(plan, 'monthly')}>
                                        Subscribe Monthly
                                    </Button>
                                </TabsContent>
                                <TabsContent value="annually" className="mt-4">
                                    <div className="text-2xl font-bold mb-4">€{plan.yearlyPrice} / year</div>
                                    <Button className="w-full" onClick={() => handleSubscribe(plan, 'annually')}>
                                        Subscribe Annually
                                    </Button>
                                </TabsContent>
                            </Tabs>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}