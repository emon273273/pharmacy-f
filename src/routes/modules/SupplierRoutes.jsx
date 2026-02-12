import { lazy } from 'react';

const GetAllSupplier = lazy(() => import('@/pages/supplier/GetAllSupplier'));

export const SupplierRoutes = [
    {
        path: 'supplier',
        element: <GetAllSupplier />,
    },
];
