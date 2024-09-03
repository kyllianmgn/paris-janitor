import React from "react";
import {SubscriptionPlanDetails} from "@/app/(protected)/subscriptions/plans/[id]/SubscriptionPlanDetails";



export default function SubscriptionPlanDetailsPage({params, searchParams}: {params: {id: string}, searchParams: {query?: string, page?: number}}){
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    return <SubscriptionPlanDetails id={+params.id} />;
}