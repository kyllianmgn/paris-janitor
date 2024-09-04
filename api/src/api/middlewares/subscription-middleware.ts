import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../utils/prisma';
import {SubscriptionStatus, UserType} from '@prisma/client';

export const hasRequiredSubscription = (requiredUserType: UserType, requiredPlanName?: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user?.id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        try {
            const activeSubscription = await prisma.subscription.findFirst({
                where: {
                    userId: req.user.id,
                    status: SubscriptionStatus.ACTIVE,
                    endDate: {
                        gt: new Date(),
                    },
                },
                include: {
                    plan: true
                }
            });

            if (!activeSubscription) {
                return res.status(403).json({ error: "Active subscription required" });
            }

            // Verify the user type
            if (activeSubscription.plan.userType !== requiredUserType) {
                return res.status(403).json({ error: "Incorrect subscription type" });
            }

            // Verify the plan name if specified
            if (requiredPlanName && activeSubscription.plan.name !== requiredPlanName) {
                return res.status(403).json({ error: "Insufficient subscription level" });
            }

            next();
        } catch (error) {
            console.error('Error checking subscription:', error);
            res.status(500).json({ error: "An error occurred while checking subscription status" });
        }
    };
};