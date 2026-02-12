import { lazy } from 'react';

const GetAllUsers = lazy(() => import('../../pages/users/GetAllUsers'));

export const UserRoutes = [
    {
        path: 'users',
        element: <GetAllUsers />,
    },
];
