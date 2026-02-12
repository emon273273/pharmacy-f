
import { DashboardRoutes } from './modules/DashboardRoutes';
import { UserRoutes } from './modules/UserRoutes';
import { RoleRoutes } from './modules/RoleRoutes';
import { MedicineRoutes } from './modules/MedicineRoutes';
import { CategoryRoutes } from './modules/CategoryRoutes';
import { SupplierRoutes } from './modules/SupplierRoutes';

export const useAdminRoutes = () => {
    const routes = [
        ...DashboardRoutes,
        ...UserRoutes,
        ...RoleRoutes,
        ...MedicineRoutes,
        ...CategoryRoutes,
        ...SupplierRoutes,
        {
            path: '*',
            element: <div className="p-4">404 - Not Found</div>
        }
    ];

    return routes;
};
