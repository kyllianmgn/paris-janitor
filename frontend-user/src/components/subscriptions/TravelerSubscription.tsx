'use client';

import React, { useEffect, useState } from 'react';
import { SubscriptionPlan } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { getTravelerSubscriptionPlans, travelerSubscriptions } from "@/api/services/subscriptions";
import { Check } from 'lucide-react';

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

        fetchPlans();
    }, [toast]);

    const handleSubscribe = async (plan: SubscriptionPlan, type: 'monthly' | 'annually') => {
        try {
            const res = await travelerSubscriptions(plan.name.toLowerCase(), type);
            if (res.sessionUrl) {
                router.push(res.sessionUrl);
            }
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
        <div>
            <div className="container mx-auto px-4 max-w-5xl p-4">
                <h1 className="text-4xl font-bold text-center mb-4 text-red-500">Upgrade Your Travel Experience</h1>
                <p className="text-center mb-12 text-gray-600 max-w-2xl mx-auto">Choose the perfect plan to enhance your journeys with Paris Janitor. Unlock exclusive benefits and make your travels unforgettable.</p>
                <div className="grid md:grid-cols-2 gap-8">
                    {plans.map((plan) => (
                        <Card key={plan.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                            <CardHeader className="bg-red-500 text-white p-6">
                                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                <CardDescription className="text-gray-100">{plan.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow p-6 bg-white">
                                <ul className="space-y-3">
                                    {Object.entries(plan.features as Record<string, any>).map(([key, value]) => (
                                        <li key={key} className="flex items-center">
                                            <Check className="h-5 w-5 text-red-500 mr-2" />
                                            {key === 'hasAds' ? 'Ad-free experience' :
                                                key === 'freeServices' ? `${value} free service${value > 1 ? 's' : ''} per ${plan.name === 'Explorator' ? 'semester' : 'year'}` :
                                                    key === 'priorityAccess' ? 'Priority access to services' :
                                                        key === 'renewalDiscount' ? `${value}% renewal discount` :
                                                            key === 'freeServiceLimit' ? (value ? `Up to €${value} free service` : 'Unlimited free service value') :
                                                                key === 'discountPercentage' ? `${value}% discount on all services` :
                                                                    key === 'canCommentAndReview' ? 'Comment and review services' :
                                                                        key}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter className="bg-gray-50 p-6">
                                <Tabs defaultValue="monthly" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2 mb-4">
                                        <TabsTrigger value="monthly">Monthly</TabsTrigger>
                                        <TabsTrigger value="annually">Annually</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="monthly">
                                        <div className="text-3xl font-bold mb-4 text-center">€{plan.monthlyPrice} <span className="text-lg font-normal">/ month</span></div>
                                        <Button className="w-full bg-red-500 hover:bg-red-600 text-white" onClick={() => handleSubscribe(plan, 'monthly')}>
                                            Subscribe Monthly
                                        </Button>
                                    </TabsContent>
                                    <TabsContent value="annually">
                                        <div className="text-3xl font-bold mb-4 text-center">€{plan.yearlyPrice} <span className="text-lg font-normal">/ year</span></div>
                                        <Button className="w-full bg-red-500 hover:bg-red-600 text-white" onClick={() => handleSubscribe(plan, 'annually')}>
                                            Subscribe Annually
                                        </Button>
                                    </TabsContent>
                                </Tabs>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

            </div>
        </div>
    );
}