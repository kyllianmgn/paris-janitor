// components/subscription/SubscriptionDialog.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/api/config";
import { useToast } from "@/components/ui/use-toast";
import {ApiResponse} from "@/types";

interface SubscriptionDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SubscriptionDialog({ isOpen, onClose }: SubscriptionDialogProps) {
    const router = useRouter();
    const { user } = useAuth();
    const { toast } = useToast();

    const handleSubscribe = async () => {
        try {
            // Appel à l'API pour initier le processus de souscription
            const response = await api.post('subscriptions/landlord', { json: { userId: user?.id, planId: 6 } });

            if (response.ok) {
                const data: ApiResponse<any> = await response.json();
                if (data.sessionUrl){
                    router.push(data.sessionUrl);
                }
            } else {
                console.error('Failed to initiate subscription');
                toast({
                    title: "Error",
                    description: "Failed to initiate subscription",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error('Error initiating subscription:', error);
            toast({
                title: "Error",
                description: "An error occurred while initiating the subscription",
                variant: "destructive",
            });
        } finally {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Landlord Subscription</DialogTitle>
                </DialogHeader>
                <div>
                    <h3>Benefits of subscribing:</h3>
                    <ul>
                        <li>Full access to property management features</li>
                        <li>Listing optimization</li>
                        <li>24/7 customer support</li>
                        <li>Advanced analytics and reporting</li>
                    </ul>
                    <p>Price: €100/year</p>
                </div>
                <DialogFooter>
                    <Button onClick={onClose} variant="outline">Cancel</Button>
                    <Button onClick={handleSubscribe}>Subscribe Now</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}