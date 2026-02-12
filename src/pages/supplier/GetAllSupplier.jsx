import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import DynamicTable from '@/components/customTable/DynamicTable';
import { useGetSuppliersQuery, useCreateSupplierMutation } from '@/redux/features/supplier/supplierApi';
import Card from '@/components/card/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import CustomDrawer from '@/components/customDrawer/CustomDrawer';
import toast from 'react-hot-toast';

const GetAllSupplier = () => {
    const [pageConfig, setPageConfig] = useState({
        page: 1,
        count: 10,
    });
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { data, isLoading } = useGetSuppliersQuery({
        page: pageConfig.page,
        count: pageConfig.count,
        ...(pageConfig.key ? { query: 'search', key: pageConfig.key } : {}),
    });

    const [createSupplier, { isLoading: isCreating }] = useCreateSupplierMutation();

    const suppliers = Array.isArray(data) ? data : data?.getAllSupplier || [];
    const total = data?.totalSupplier || suppliers.length || 0;

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            address: '',
        },
    });

    const onSubmit = async (formData) => {
        try {
            // Remove empty optional fields
            const payload = {
                name: formData.name,
                ...(formData.email && { email: formData.email }),
                ...(formData.phone && { phone: formData.phone }),
                ...(formData.address && { address: formData.address }),
            };
            await createSupplier(payload).unwrap();
            toast.success('Supplier created successfully!');
            reset();
            setDrawerOpen(false);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to create supplier');
        }
    };

    const columns = [
        {
            key: 'id',
            title: 'ID',
            dataIndex: 'id',
        },
        {
            key: 'name',
            title: 'Supplier Name',
            dataIndex: 'name',
        },
        {
            key: 'email',
            title: 'Email',
            dataIndex: 'email',
            render: (row) => row.email || '-',
        },
        {
            key: 'phone',
            title: 'Phone',
            dataIndex: 'phone',
            render: (row) => row.phone || '-',
        },
        {
            key: 'address',
            title: 'Address',
            dataIndex: 'address',
            render: (row) => row.address || '-',
        },
    ];

    return (
        <div className="p-6">
            <Card
                title="All Suppliers"
                subtitle="Manage your medicine suppliers"
                action={
                    <Button onClick={() => setDrawerOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Supplier
                    </Button>
                }
            >
                <DynamicTable
                    title="Suppliers"
                    columns={columns}
                    list={suppliers}
                    total={total}
                    loading={isLoading}
                    pageConfig={pageConfig}
                    setPageConfig={setPageConfig}
                />
            </Card>

            {/* Create Supplier Drawer */}
            <CustomDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Create Supplier"
                description="Add a new supplier"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Supplier Name *</Label>
                        <Input
                            id="name"
                            {...register('name', { required: 'Name is required' })}
                            placeholder="e.g. PharmaCo Ltd."
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            {...register('email')}
                            placeholder="supplier@example.com"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            {...register('phone')}
                            placeholder="+880 1XXXXXXXXX"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                            id="address"
                            {...register('address')}
                            placeholder="Supplier address..."
                        />
                    </div>

                    <Button type="submit" disabled={isCreating} className="w-full gap-2">
                        {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Supplier'}
                    </Button>
                </form>
            </CustomDrawer>
        </div>
    );
};

export default GetAllSupplier;
