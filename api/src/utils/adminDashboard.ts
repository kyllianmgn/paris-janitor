import { prisma } from './prisma';
import { SubscriptionStatus, UserType } from '@prisma/client';

export async function getAdminDashboardStats() {
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
        activeSubscriptions,
        totalRevenue,
        newSubscriptions,
        canceledSubscriptions,
        pendingServiceProviders,
        pendingProperties,
        travelerSubscriptions,
        landlordSubscriptions
    ] = await Promise.all([
        prisma.subscription.count({ where: { status: SubscriptionStatus.ACTIVE } }),
        prisma.subscription.findMany({
            where: { status: SubscriptionStatus.ACTIVE },
            include: { plan: true }
        }),
        prisma.subscription.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
        prisma.subscription.count({ where: { status: SubscriptionStatus.CANCELED, updatedAt: { gte: thirtyDaysAgo } } }),
        prisma.serviceProvider.count({ where: { status: 'PENDING' } }),
        prisma.property.count({ where: { status: 'PENDING' } }),
        prisma.subscription.count({
            where: {
                status: SubscriptionStatus.ACTIVE,
                plan: { userType: UserType.TRAVELER }
            }
        }),
        prisma.subscription.count({
            where: {
                status: SubscriptionStatus.ACTIVE,
                plan: { userType: UserType.LANDLORD }
            }
        })
    ]);

    const calculatedTotalRevenue = totalRevenue.reduce((sum, sub) => sum + Number(sub.plan.monthlyPrice), 0);

    return {
        activeSubscriptions,
        totalRevenue: calculatedTotalRevenue,
        newSubscriptions,
        canceledSubscriptions,
        pendingServiceProviders,
        pendingProperties,
        travelerSubscriptions,
        landlordSubscriptions
    };
}

export async function updateAdminDashboard(
    subscription: { id: number },
    status: SubscriptionStatus,
    amount: number = 0
) {
    // Cette fonction est appelée après chaque changement d'abonnement
    // Nous n'avons pas besoin de stocker quoi que ce soit ici
    // car nous calculons toutes les statistiques en temps réel
    console.log(`Subscription ${subscription.id} updated to status ${status}`);
}