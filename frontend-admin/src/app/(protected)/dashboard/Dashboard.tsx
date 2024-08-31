"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {getDashboardStats} from "@/api/services/admin-service";


export const Dashboard = () => {
    const [stats, setStats] = useState({
        activeSubscriptions: 0,
        totalRevenue: 0,
        newSubscriptions: 0,
        canceledSubscriptions: 0,
        pendingServiceProviders: 0,
        pendingProperties: 0,
        travelerSubscriptions: 0,
        landlordSubscriptions: 0
    });

    const loadDashboardStats = async () => {
        const response = await getDashboardStats();
        if (response.data) {
            setStats(response.data);
        }
    };

    useEffect(() => {
        loadDashboardStats().then();
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Dashboard Administrateur</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard
                    title="Service Providers waiting"
                    value={stats.pendingServiceProviders}
                    href="/service-providers/pending"
                />
                <DashboardCard
                    title="Properties waiting"
                    value={stats.pendingProperties}
                    href="/properties/pending"
                />
                <DashboardCard
                    title="Active subscriptions"
                    value={stats.activeSubscriptions}
                />
                <DashboardCard
                    title="New subscriptions"
                    value={stats.newSubscriptions}
                />
                <DashboardCard
                    title="Canceled subscriptions"
                    value={stats.canceledSubscriptions}
                />
                <DashboardCard
                    title="Traveler subscriptions"
                    value={stats.travelerSubscriptions}
                />
                <DashboardCard
                    title="Landlord subscriptions"
                    value={stats.landlordSubscriptions}
                />
                <DashboardCard
                    title="Total revenue"
                    value={`${stats.totalRevenue.toFixed(2)} €`}
                />
            </div>
        </div>
    );
};

interface DashboardCardProps {
    title: string;
    value: number | string;
    href?: string;
}

const DashboardCard = ({ title, value, href }: DashboardCardProps) => {
    const CardComponent = href ? Link : Card;
    const cardProps = href ? { href } : {};

    return (
        <CardComponent {...cardProps}>
            <Card className={`h-full ${href ? 'hover:shadow-lg transition-shadow cursor-pointer' : ''}`}>
                <CardHeader>
                    <CardTitle className="text-lg">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{value}</p>
                </CardContent>
            </Card>
        </CardComponent>
    );
};