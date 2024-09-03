"use client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Confetti, {ConfettiRef} from "@/components/magicui/confetti";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {api, tokenUtils} from "@/api/config";
import {setCredentials} from "@/store/slices/authSlice";
import {AppDispatch} from "@/store";
import {useDispatch} from "react-redux";


export default function TravelerSubscriptionSuccess() {
    const router = useRouter();
    const confettiRef = useRef<ConfettiRef>(null);
    const { toast } = useToast();
    const dispatch = useDispatch()

    useEffect(() => {
        const sessionId = new URLSearchParams(window.location.search).get("session_id");
        if (sessionId) {
            completeSubscription(sessionId);
        }
        confettiRef.current?.fire({});
    }, []);

    const completeSubscription = async (sessionId: string) => {
        try {
            const response = await api.get(`subscriptions/traveler/success?session_id=${sessionId}`);
            if (response.ok) {
                const data: any = await response.json();

                // Mettez à jour le state global avec les nouveaux tokens si nécessaire
                tokenUtils.setTokens(data);
                dispatch(setCredentials(data));
                toast({
                    title: "Subscription Activated",
                    description: "Your subscription has been successfully activated!",
                });
            } else {
                throw new Error("Failed to complete subscription");
            }
        } catch (error) {
            console.error("Error completing subscription:", error);
            toast({
                title: "Error",
                description: "There was an error activating your subscription. Please contact support.",
                variant: "destructive",
            });
        }
    };

    const handleGoToDashboard = () => {
        router.push("/");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background relative">
            <div className="z-10">
                <h1 className="text-4xl font-bold mb-4">Welcome aboard!</h1>
                <p className="text-xl mb-8">Your subscription has been successfully activated.</p>
                <Button
                    onClick={handleGoToDashboard}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    Go to Dashboard
                </Button>
            </div>
            <Confetti
                ref={confettiRef}
                className="absolute left-0 top-0 z-0 size-full"
            />
        </div>
    );
}