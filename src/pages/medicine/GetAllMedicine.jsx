import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DynamicTable from '@/components/customTable/DynamicTable';
import { useGetMedicinesQuery } from '@/redux/features/medicine/medicineApi';
import Card from '@/components/card/Card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CustomDrawer from '@/components/customDrawer/CustomDrawer';
import CreateMedicine from './CreateMedicine';
import { Eye } from 'lucide-react';
import { Edit } from 'lucide-react';
import { Trash } from 'lucide-react';
import { DeleteButton, EditButton, ViewButton } from '@/components/button/ActionButtons';

const GetAllMedicine = () => {
    const navigate = useNavigate();
    const [pageConfig, setPageConfig] = useState({
        page: 1,
        count: 10,
    });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const { data, isLoading } = useGetMedicinesQuery({
        page: pageConfig.page,
        count: pageConfig.count,
        ...(pageConfig.key ? { query: 'search', key: pageConfig.key } : {}),
    });

    const medicines = data?.getAllMedicine || [];
    const total = data?.totalMedicine || 0;

    const columns = [
        {
            key: 'id',
            title: 'ID',
            dataIndex: 'id',
        },
        {
            key: 'medicineName',
            title: 'Medicine Name',
            dataIndex: 'medicineName',
        },
        {
            key: 'genericName',
            title: 'Generic Name',
            dataIndex: 'genericName',
        },
        {
            key: 'brandName',
            title: 'Brand',
            dataIndex: 'brandName',
        },
        {
            key: 'dosageType',
            title: 'Dosage Type',
            dataIndex: 'dosageType',
        },
        {
            key: 'unitType',
            title: 'Unit',
            dataIndex: 'unitType',
        },
        {
            key: 'category',
            title: 'Category',
            render: (row) => row.category?.name || '-',
        },
        {
            key: 'supplier',
            title: 'Supplier',
            render: (row) => row.supplier?.name || '-',
        },
        {
            key: 'totalStock',
            title: 'Total Stock',
            render: (row) => {
                const total = row.batches?.reduce((sum, b) => sum + b.quantity, 0) || 0;
                return (
                    <span className={`font-medium ${total <= (row.reorderLevel || 0) ? 'text-red-600' : 'text-slate-900'}`}>
                        {total}
                    </span>
                );
            },
        },
        {
            key: 'reorderLevel',
            title: 'Reorder Level',
            dataIndex: 'reorderLevel',
        },
        {
            key: 'createdAt',
            title: 'Created At',
            dataIndex: 'createdAt',
        },
        {
            title: "Actions",
            key: 'actions',
            render: (record) => (
                <div className="flex items-center gap-2">
                    <ViewButton to={`${record.id}`}>
                        <Eye />
                    </ViewButton>
                    <EditButton onClick={() => navigate(`/medicine/${record.id}/edit`)}>
                        <Edit />
                    </EditButton>
                    <DeleteButton onClick={() => navigate(`/medicine/${record.id}/delete`)}>
                        <Trash />
                    </DeleteButton>
                </div>
            )
        }
    ];

    return (
        <div className="p-6">
            <Card title={"Medicine List"} action={<Button onClick={() => setIsDrawerOpen(true)}>Create Medicine</Button>}>
                <CustomDrawer
                    isOpen={isDrawerOpen}
                    onClose={() => setIsDrawerOpen(false)}
                    title="Create New Medicine"
                    description="Fill in the details below to create a new medicine."
                    width="80"
                >
                    <CreateMedicine onClose={() => setIsDrawerOpen(false)} />
                </CustomDrawer>
                <DynamicTable
                    title="Medicines"
                    columns={columns}
                    list={medicines}
                    total={total}
                    loading={isLoading}
                    pageConfig={pageConfig}
                    setPageConfig={setPageConfig}
                />
            </Card>
        </div>
    );
};

export default GetAllMedicine;
