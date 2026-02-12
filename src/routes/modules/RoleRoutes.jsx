import { lazy } from 'react';

const GetAllRole = lazy(() => import('../../pages/roles/GetAllRole'));
const DetailRole = lazy(() => import('../../pages/roles/DetailRole'));

export const RoleRoutes = [
    {
        exact: true,
        path: 'role',
        element: <GetAllRole />,
    },
    {
        exact: true,
        path: 'role/:id',
        element: <DetailRole />,
    },
];
