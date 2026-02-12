import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import DynamicTable from '@/components/customTable/DynamicTable';
import { useGetCategoriesQuery, useCreateCategoryMutation } from '@/redux/features/category/categoryApi';
import Card from '@/components/card/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import CustomDrawer from '@/components/customDrawer/CustomDrawer';
import toast from 'react-hot-toast';

const GetAllCategory = () => {
    const [pageConfig, setPageConfig] = useState({
        page: 1,
        count: 10,
    });
    const [drawerOpen, setDrawerOpen] = useState(false);

    const { data, isLoading } = useGetCategoriesQuery({
        page: pageConfig.page,
        count: pageConfig.count,
        ...(pageConfig.key ? { query: 'search', key: pageConfig.key } : {}),
    });

    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();

    const categories = Array.isArray(data) ? data : data?.getAllCategory || [];
    const total = data?.totalCategory || categories.length || 0;

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { name: '' },
    });

    const onSubmit = async (formData) => {
        try {
            await createCategory(formData).unwrap();
            toast.success('Category created successfully!');
            reset();
            setDrawerOpen(false);
        } catch (err) {
            toast.error(err?.data?.message || 'Failed to create category');
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
            title: 'Category Name',
            dataIndex: 'name',
        },
    ];

    return (
        <div className="p-6">
            <Card
                title="All Categories"
                subtitle="Manage medicine categories"
                action={
                    <Button onClick={() => setDrawerOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Category
                    </Button>
                }
            >
                <DynamicTable
                    title="Categories"
                    columns={columns}
                    list={categories}
                    total={total}
                    loading={isLoading}
                    pageConfig={pageConfig}
                    setPageConfig={setPageConfig}
                />
            </Card>

            {/* Create Category Drawer */}
            <CustomDrawer
                isOpen={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                title="Create Category"
                description="Add a new medicine category"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">Category Name *</Label>
                        <Input
                            id="name"
                            {...register('name', { required: 'Name is required' })}
                            placeholder="e.g. Antibiotics"
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                    </div>

                    <Button type="submit" disabled={isCreating} className="w-full gap-2">
                        {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Category'}
                    </Button>
                </form>
            </CustomDrawer>
        </div>
    );
};

export default GetAllCategory;
