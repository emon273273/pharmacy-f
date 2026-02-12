import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useCreateMedicineMutation } from '@/redux/features/medicine/medicineApi';
import { useGetAllCategoriesQuery } from '@/redux/features/category/categoryApi';
import { useGetAllSuppliersQuery } from '@/redux/features/supplier/supplierApi';
import Card from '@/components/card/Card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowLeft, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const dosageTypes = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Cream', 'Ointment', 'Drops', 'Inhaler', 'Powder', 'Gel'];
const unitTypes = ['Tablet', 'Strip', 'Bottle', 'Vial', 'ml', 'mg', 'Piece', 'Box', 'Sachet', 'Tube'];

const CreateMedicine = () => {
    const navigate = useNavigate();
    const [createMedicine, { isLoading }] = useCreateMedicineMutation();
    const { data: categories = [] } = useGetAllCategoriesQuery();
    const { data: suppliers = [] } = useGetAllSuppliersQuery();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            medicineName: '',
            genericName: '',
            brandName: '',
            description: '',
            dosageType: '',
            unitType: '',
            reorderLevel: 0,
            categoryId: '',
            supplierId: '',
            batches: [
                {
                    batchNumber: '',
                    quantity: 1,
                    manufacturingDate: '',
                    expiryDate: '',
                    purchasePrice: 0,
                    sellingPrice: 0,
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'batches',
    });

    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                categoryId: parseInt(data.categoryId),
                supplierId: data.supplierId ? parseInt(data.supplierId) : undefined,
                reorderLevel: parseInt(data.reorderLevel) || 0,
                batches: data.batches.map((b) => ({
                    ...b,
                    quantity: parseInt(b.quantity),
                    purchasePrice: parseFloat(b.purchasePrice),
                    sellingPrice: parseFloat(b.sellingPrice),
                })),
            };

            await createMedicine(payload).unwrap();
            toast.success('Medicine created successfully!');
            navigate('/admin/medicine');
        } catch (err) {
            console.error('Create medicine error:', err);
            toast.error(err?.data?.message || 'Failed to create medicine');
        }
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-6">
                <Button variant="ghost" onClick={() => navigate('/admin/medicine')} className="gap-2 text-slate-600 hover:text-slate-900">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Medicines
                </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Medicine Info */}
                <Card title="Medicine Information" subtitle="Enter the medicine details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="medicineName">Medicine Name *</Label>
                            <Input
                                id="medicineName"
                                {...register('medicineName', { required: 'Medicine name is required' })}
                                placeholder="e.g. Paracetamol 500mg"
                            />
                            {errors.medicineName && <p className="text-sm text-red-500">{errors.medicineName.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="genericName">Generic Name *</Label>
                            <Input
                                id="genericName"
                                {...register('genericName', { required: 'Generic name is required' })}
                                placeholder="e.g. Acetaminophen"
                            />
                            {errors.genericName && <p className="text-sm text-red-500">{errors.genericName.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="brandName">Brand Name *</Label>
                            <Input
                                id="brandName"
                                {...register('brandName', { required: 'Brand name is required' })}
                                placeholder="e.g. Napa"
                            />
                            {errors.brandName && <p className="text-sm text-red-500">{errors.brandName.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Dosage Type *</Label>
                            <Select onValueChange={(val) => setValue('dosageType', val)} value={watch('dosageType')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select dosage type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {dosageTypes.map((type) => (
                                        <SelectItem key={type} value={type.toLowerCase()}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.dosageType && <p className="text-sm text-red-500">{errors.dosageType.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label>Unit Type *</Label>
                            <Select onValueChange={(val) => setValue('unitType', val)} value={watch('unitType')}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select unit type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {unitTypes.map((type) => (
                                        <SelectItem key={type} value={type.toLowerCase()}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.unitType && <p className="text-sm text-red-500">{errors.unitType.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reorderLevel">Reorder Level</Label>
                            <Input
                                id="reorderLevel"
                                type="number"
                                min="0"
                                {...register('reorderLevel')}
                                placeholder="0"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Category *</Label>
                            <Select onValueChange={(val) => setValue('categoryId', val)} value={watch('categoryId')?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(Array.isArray(categories) ? categories : []).map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Supplier</Label>
                            <Select onValueChange={(val) => setValue('supplierId', val)} value={watch('supplierId')?.toString()}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select supplier" />
                                </SelectTrigger>
                                <SelectContent>
                                    {(Array.isArray(suppliers) ? suppliers : []).map((sup) => (
                                        <SelectItem key={sup.id} value={sup.id.toString()}>
                                            {sup.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                {...register('description')}
                                placeholder="Optional description..."
                                className="min-h-[80px]"
                            />
                        </div>
                    </div>
                </Card>

                {/* Batches */}
                <div className="mt-6">
                    <Card
                        title="Batch Information"
                        subtitle="Add batch details for this medicine"
                        action={
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    append({
                                        batchNumber: '',
                                        quantity: 1,
                                        manufacturingDate: '',
                                        expiryDate: '',
                                        purchasePrice: 0,
                                        sellingPrice: 0,
                                    })
                                }
                                className="gap-1"
                            >
                                <Plus className="h-4 w-4" />
                                Add Batch
                            </Button>
                        }
                    >
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <div key={field.id} className="p-4 border rounded-lg bg-slate-50 relative">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-sm font-semibold text-slate-700">Batch #{index + 1}</h4>
                                        {fields.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => remove(index)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Batch Number *</Label>
                                            <Input
                                                {...register(`batches.${index}.batchNumber`, { required: 'Required' })}
                                                placeholder="BTH-001"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Quantity *</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                {...register(`batches.${index}.quantity`, { required: 'Required' })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Manufacturing Date</Label>
                                            <Input
                                                type="date"
                                                {...register(`batches.${index}.manufacturingDate`)}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Expiry Date *</Label>
                                            <Input
                                                type="date"
                                                {...register(`batches.${index}.expiryDate`, { required: 'Required' })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Purchase Price *</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                {...register(`batches.${index}.purchasePrice`, { required: 'Required' })}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">Selling Price *</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                {...register(`batches.${index}.sellingPrice`, { required: 'Required' })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Submit */}
                <div className="mt-6 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => navigate('/admin/medicine')}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading} className="gap-2 min-w-[140px]">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Medicine'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateMedicine;
