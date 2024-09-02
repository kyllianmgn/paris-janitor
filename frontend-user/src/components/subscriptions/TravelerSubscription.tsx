"use client";
import {Button} from "@/components/ui/button";
import {travelerSubscriptions} from "@/api/services/subscriptions";
import {useRouter} from "next/navigation";

export default function TravelerSubscription(){
    const router = useRouter()

    const beginSubscription = async (plan: string, type: string) => {
        const res = await travelerSubscriptions(plan, type)
        if (res.sessionUrl){
            router.push(res.sessionUrl)
        }
    }

    return (
        <>
            <h1>Abonnement</h1>
            <Button onClick={() => beginSubscription("bag-packer","monthly")}>Test abonnement</Button>
        </>
    )
}