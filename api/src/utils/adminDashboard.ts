import { prisma } from './prisma';
import {InterventionStatus, PropertyStatus, ReservationStatus, SubscriptionStatus, UserType} from '@prisma/client';

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

export async function getLandlordDashboardStats(landlordId: number) {
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
        totalRevenue,
        newReservations,
        canceledReservations,
        pendingProperties,
        activeProperties,
        upcomingInterventions,
        averageRating
    ] = await Promise.all([
        prisma.propertyReservation.aggregate({
            where: {
                status: ReservationStatus.CONFIRMED,
                occupation: { property: { landlordId } }
            },
            _sum: { totalPrice: true }
        }),
        prisma.propertyReservation.count({
            where: {
                createdAt: { gte: thirtyDaysAgo },
                occupation: { property: { landlordId } }
            }
        }),
        prisma.propertyReservation.count({
            where: {
                status: ReservationStatus.CANCELLED,
                updatedAt: { gte: thirtyDaysAgo },
                occupation: { property: { landlordId } }
            }
        }),
        prisma.property.count({ where: { status: PropertyStatus.PENDING, landlordId } }),
        prisma.property.count({ where: { status: PropertyStatus.APPROVED, landlordId } }),
        prisma.intervention.count({
            where: {
                status: InterventionStatus.PLANNED,
                propertyOccupation: { property: { landlordId } }
            }
        }),
        prisma.propertyReview.aggregate({
            where: { property: { landlordId } },
            _avg: { note: true }
        })
    ]);

    return {
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        newReservations,
        canceledReservations,
        pendingProperties,
        activeProperties,
        upcomingInterventions,
        averageRating: averageRating._avg.note || 0
    };
}

export async function getServiceProviderDashboardStats(providerId: number) {
    const currentDate = new Date();
    const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
        totalRevenue,
        completedInterventions,
        upcomingInterventions,
        canceledInterventions,
        activeServices,
        averageRating
    ] = await Promise.all([
        prisma.intervention.aggregate({
            where: {
                status: InterventionStatus.COMPLETED,
                service: { providerId }
            },
            _sum: { additionalPrice: true }
        }),
        prisma.intervention.count({
            where: {
                status: InterventionStatus.COMPLETED,
                updatedAt: { gte: thirtyDaysAgo },
                service: { providerId }
            }
        }),
        prisma.intervention.count({
            where: {
                status: InterventionStatus.PLANNED,
                service: { providerId }
            }
        }),
        prisma.intervention.count({
            where: {
                status: InterventionStatus.CANCELLED,
                updatedAt: { gte: thirtyDaysAgo },
                service: { providerId }
            }
        }),
        prisma.service.count({ where: { providerId } }),
        prisma.serviceReview.aggregate({
            where: { service: { providerId } },
            _avg: { note: true }
        })
    ]);

    return {
        totalRevenue: totalRevenue._sum.additionalPrice || 0,
        completedInterventions,
        upcomingInterventions,
        canceledInterventions,
        activeServices,
        averageRating: averageRating._avg.note || 0
    };
}
