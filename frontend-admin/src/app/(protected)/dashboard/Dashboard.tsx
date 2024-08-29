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
                    title="Propriétés en attente"
                    value={stats.pendingProperties}
                    href="/properties/pending"
                />
                <DashboardCard
                    title="Prestataires en attente"
                    value={stats.pendingServiceProviders}
                    href="/service-providers/pending"
                />
                <DashboardCard
                    title="Abonnements actifs"
                    value={stats.activeSubscriptions}
                    href="/subscriptions"
                />
                <DashboardCard
                    title="Revenus totaux"
                    value={`${stats.totalRevenue.toFixed(2)} €`}
                    href= "/"
                />
                <DashboardCard
                    title="Nouveaux abonnements"
                    value={stats.newSubscriptions}
                    href="/"
                />
                <DashboardCard
                    title="Abonnements annulés"
                    value={stats.canceledSubscriptions}
                    href="/"
                />
                <DashboardCard
                    title="Abonnements voyageurs"
                    value={stats.travelerSubscriptions}
                    href="/"
                />
                <DashboardCard
                    title="Abonnements propriétaires"
                    value={stats.landlordSubscriptions}
                    href="/"
                />
            </div>
        </div>
    );
};

interface DashboardCardProps {
    title: string;
    value: number | string;
    href: string | null;
}

const DashboardCard = ({ title, value, href }: DashboardCardProps) => (
    <Link href={href}>
        <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{value}</p>
            </CardContent>
        </Card>
    </Link>
);