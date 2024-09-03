"use client";
import {useEffect, useRef, useState} from "react";
import { useRouter } from "next/navigation";
import Confetti, {ConfettiRef} from "@/components/magicui/confetti";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {api, tokenUtils} from "@/api/config";
import {setCredentials} from "@/store/slices/authSlice";
import {AppDispatch} from "@/store";
import {useDispatch} from "react-redux";


export default function PaymentSuccess() {
    const router = useRouter();
    const confettiRef = useRef<ConfettiRef>(null);
    const { toast } = useToast();
    const dispatch = useDispatch()
    const [reservationId, setReservationId] = useState<number | null>(null);

    useEffect(() => {
        const reservationId = new URLSearchParams(window.location.search).get("reservation_id");
        if (reservationId) {
            setReservationId(+reservationId);
        }
        confettiRef.current?.fire({});
    }, []);

    const handleGoToDashboard = () => {
        router.push(`/my-reservations/${reservationId}`);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background relative">
            <div className="z-10">
                <h1 className="text-4xl font-bold mb-4">Votre réservation à bien pris en compte!</h1>
                <p className="text-xl mb-8">Vous pouvez retrouvez votre réservation ici.</p>
                <Button
                    onClick={handleGoToDashboard}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                    Voir ma reservation
                </Button>
            </div>
            <Confetti
                ref={confettiRef}
                className="absolute left-0 top-0 z-0 size-full"
            />
        </div>
    );
}