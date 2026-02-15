import DetailMedicine from '@/pages/medicine/DetailMedicine';
import { lazy } from 'react';

const GetAllMedicine = lazy(() => import('@/pages/medicine/GetAllMedicine'));
const CreateMedicine = lazy(() => import('@/pages/medicine/CreateMedicine'));

export const MedicineRoutes = [
    {
        path: 'medicine',
        element: <GetAllMedicine />,
    },
    {
        path: 'medicine/create',
        element: <CreateMedicine />,
    },
    {
        path: 'medicine/:id',
        element: <DetailMedicine />,
    }
];
