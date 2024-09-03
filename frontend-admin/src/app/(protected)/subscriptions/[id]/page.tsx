import React from "react";
import {SubscriptionDetails} from "@/app/(protected)/subscriptions/[id]/SubscriptionDetails";



export default function SubscriptionDetailsPage({params, searchParams}: {params: {id: string}, searchParams: {query?: string, page?: number}}){
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;

    return <SubscriptionDetails id={+params.id} />;
}