// components/dashboards/UserDashboard.tsx
"use client"

import React, { useEffect, useState } from "react";
import { User } from "@/types";
import {landlordsService, serviceProviderService} from "@/api/services/landlords";

interface DashboardStats {
    totalRevenue: number;
    newReservations?: number;
    completedInterventions?: number;
    upcomingInterventions: number;
    canceledReservations?: number;
    canceledInterventions?: number;
    pendingProperties?: number;
    activeProperties?: number;
    activeServices?: number;
    averageRating: number;
}

interface UserDashboardProps {
    user: User;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ user }) => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                let dashboardStats:any;
                if (user.Landlord) {
                    dashboardStats = await landlordsService.getDashboardStats();
                } else if (user.ServiceProvider) {
                    dashboardStats = await serviceProviderService.getDashboardStats();
                }
                console.log('Fetched dashboard stats:', dashboardStats);
                setStats(dashboardStats.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
                setError("Failed to load dashboard data. Please try again later.");
            }
        };

        fetchStats();
    }, [user]);

    if (error) return <div className="text-red-500">{error}</div>;
    if (!stats) return <div>Loading...</div>;

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                <DashboardCard title="Total Revenue" value={stats.totalRevenue+"€"} />
                <DashboardCard title="Average Rating" value={stats.averageRating} />
                {user.Landlord && (
                    <>
                        <DashboardCard title="New Reservations" value={stats.newReservations} />
                        <DashboardCard title="Canceled Reservations" value={stats.canceledReservations} />
                        <DashboardCard title="Pending Properties" value={stats.pendingProperties} />
                        <DashboardCard title="Active Properties" value={stats.activeProperties} />
                    </>
                )}
                {user.ServiceProvider && (
                    <>
                        <DashboardCard title="Completed Interventions" value={stats.completedInterventions} />
                        <DashboardCard title="Canceled Interventions" value={stats.canceledInterventions} />
                        <DashboardCard title="Active Services" value={stats.activeServices} />
                    </>
                )}
                <DashboardCard title="Upcoming Interventions" value={stats.upcomingInterventions} />
            </div>
        </div>
    );
};

const DashboardCard: React.FC<{ title: string; value: string | number | undefined }> = ({ title, value }) => (
    <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
);