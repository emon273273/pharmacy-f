
import { lazy } from 'react';

// Lazy load components
const Dashboard = lazy(() => import('@/pages/Dashboard'));

export const DashboardRoutes = [
    {
        index: true,
        element: <Dashboard />,
    },
    {
        path: 'dashboard',
        element: <Dashboard />,
    },
];
