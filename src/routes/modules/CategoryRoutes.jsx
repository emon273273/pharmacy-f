import { lazy } from 'react';

const GetAllCategory = lazy(() => import('@/pages/category/GetAllCategory'));

export const CategoryRoutes = [
    {
        path: 'category',
        element: <GetAllCategory />,
    },
];
