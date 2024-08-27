import express from 'express';
import { getAdminDashboardStats } from '../../utils/adminDashboard';
import { isAuthenticated, isSuperAdmin } from '../middlewares/auth-middleware';

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
};