import React from "react";
import {Button} from "@/components/ui/button";
import {ArrowRight} from "lucide-react";

export const SubscriptionTab = () => {

    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 text-center">
            <h4 className="text-2xl font-bold text-center pb-6 w-full">Subscription</h4>
            <div className="flex flex-col gap-2">
                <div className={"flex align-center justify-between"}>Changer d&apos;offre <ArrowRight></ArrowRight></div>
                <div className={"flex align-center justify-between"}>Gérer votre moyen de paiement <ArrowRight></ArrowRight></div>
                <Button className={"w-full mt-10"} variant={"destructive"}>Annuler L&apos;abonnement</Button>
            </div>
        </div>
    );
}
