import express from 'express';
import {
    getAdminDashboardStats,
    getLandlordDashboardStats,
    getServiceProviderDashboardStats
} from '../../utils/adminDashboard';
import {isAuthenticated, isRole, isSuperAdmin, UserRole} from '../middlewares/auth-middleware';

export const initAdminRoutes = (app: express.Express) => {
    app.get('/admin/dashboard', isAuthenticated, isSuperAdmin, async (req, res) => {
        try {
            const stats = await getAdminDashboardStats();
            res.status(200).json({ data: stats });
        } catch (error) {
            console.error('Error fetching admin dashboard stats:', error);
            res.status(500).json({ error: 'An error occurred while fetching dashboard stats.' });
        }
    });

    // Vous pouvez ajouter d'autres routes admin ici si nécessaire

    app.get('/dashboard/landlord', isAuthenticated, isRole(UserRole.LANDLORD), async (req, res) => {
        try {
            if (!req.user?.landlordId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const stats = await getLandlordDashboardStats(Number(req.user.landlordId));
            res.status(200).json({ data: stats });
        } catch (error) {
            console.error('Error fetching landlord dashboard stats:', error);
            res.status(500).json({ error: 'An error occurred while fetching dashboard stats.' });
        }
    });

    app.get('/dashboard/service-provider', isAuthenticated, isRole(UserRole.SERVICE_PROVIDER), async (req, res) => {
        try {
            if (!req.user?.serviceProviderId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const stats = await getServiceProviderDashboardStats(Number(req.user.serviceProviderId));
            res.status(200).json({ data: stats });
        } catch (error) {
            console.error('Error fetching service provider dashboard stats:', error);
            res.status(500).json({ error: 'An error occurred while fetching dashboard stats.' });
        }
    });
};