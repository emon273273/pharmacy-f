import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import toast from 'react-hot-toast';

import Card from '@/components/card/Card';
import { Button } from '@/components/ui/button';
import { CustomSubmitButton } from '@/components/CustomUI/CustomSubmitButton';
import { GenericFormFields } from '@/components/commonUi/GenericFormFields';

import { useCreateMedicineMutation } from '@/redux/features/medicine/medicineApi';
import { useGetAllCategoriesQuery } from '@/redux/features/category/categoryApi';
import { useGetAllSuppliersQuery } from '@/redux/features/supplier/supplierApi';

import { Plus, Trash2, ArrowLeft } from 'lucide-react';


const defaultBatch = {
    batchNumber: '',
    quantity: 1,
    manufacturingDate: '',
    expiryDate: '',
    purchasePrice: 0,
    sellingPrice: 0,
};

// createMedicineFormConfig.js
export const createMedicineFormConfig = (categoryOptions = [], supplierOptions = []) => [
    {
        name: 'medicineName',
        label: 'Medicine Name',
        type: 'text',
        placeholder: 'e.g. Paracetamol 500mg',
        rules: { required: 'Medicine name is required' },
        gridCols: '2',
    },
    {
        name: 'genericName',
        label: 'Generic Name',
        type: 'text',
        placeholder: 'e.g. Acetaminophen',
        rules: { required: 'Generic name is required' },
        gridCols: '2',
    },
    {
        name: 'brandName',
        label: 'Brand Name',
        type: 'text',
        placeholder: 'e.g. Napa',
        rules: { required: 'Brand name is required' },
        gridCols: '2',
    },
    {
        name: 'dosageType',
        label: 'Dosage Type',
        type: 'select',
        placeholder: 'Select dosage type',
        options: [
            { id: 'tablet', name: 'Tablet' },
            { id: 'capsule', name: 'Capsule' },
            { id: 'syrup', name: 'Syrup' },
            { id: 'injection', name: 'Injection' },
            { id: 'cream', name: 'Cream' },
            { id: 'ointment', name: 'Ointment' },
            { id: 'drops', name: 'Drops' },
            { id: 'inhaler', name: 'Inhaler' },
            { id: 'powder', name: 'Powder' },
            { id: 'gel', name: 'Gel' },
        ],
        rules: { required: 'Dosage type is required' },
        gridCols: '2',
    },
    {
        name: 'unitType',
        label: 'Unit Type',
        type: 'select',
        placeholder: 'Select unit type',
        options: [
            { id: 'tablet', name: 'Tablet' },
            { id: 'strip', name: 'Strip' },
            { id: 'bottle', name: 'Bottle' },
            { id: 'vial', name: 'Vial' },
            { id: 'ml', name: 'ml' },
            { id: 'mg', name: 'mg' },
            { id: 'piece', name: 'Piece' },
            { id: 'box', name: 'Box' },
            { id: 'sachet', name: 'Sachet' },
            { id: 'tube', name: 'Tube' },
        ],
        rules: { required: 'Unit type is required' },
        gridCols: '2',
    },
    {
        name: 'reorderLevel',
        label: 'Reorder Level',
        type: 'number',
        placeholder: '0',
        rules: { min: { value: 0, message: 'Must be >= 0' } },
        gridCols: '2',
    },
    {
        name: 'categoryId',
        label: 'Category',
        type: 'select',
        placeholder: 'Select category',
        options: categoryOptions,
        rules: { required: 'Category is required' },
        gridCols: '2',
    },
    {
        name: 'supplierId',
        label: 'Supplier',
        type: 'select',
        placeholder: 'Select supplier',
        options: supplierOptions,
        gridCols: '2',
    },
    {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Optional description...',
        gridCols: '1',
    },
];


// batchFormConfig.js
export const batchFormConfig = (index) => [
    {
        name: `batches.${index}.batchNumber`,
        label: 'Batch Number',
        type: 'text',
        placeholder: 'BTH-001',
        rules: { required: 'Required' },
        gridCols: '2',
    },
    {
        name: `batches.${index}.quantity`,
        label: 'Quantity',
        type: 'number',
        placeholder: '1',
        rules: { required: 'Required', min: { value: 1, message: 'Min 1' } },
        gridCols: '2',
    },
    {
        name: `batches.${index}.manufacturingDate`,
        label: 'Manufacturing Date',
        type: 'date',
        gridCols: '2',
    },
    {
        name: `batches.${index}.expiryDate`,
        label: 'Expiry Date',
        type: 'date',
        rules: { required: 'Required' },
        gridCols: '2',
    },
    {
        name: `batches.${index}.purchasePrice`,
        label: 'Purchase Price',
        type: 'number',
        placeholder: '0',
        rules: { required: 'Required', min: { value: 0, message: 'Min 0' } },
        gridCols: '2',
    },
    {
        name: `batches.${index}.sellingPrice`,
        label: 'Selling Price',
        type: 'number',
        placeholder: '0',
        rules: { required: 'Required', min: { value: 0, message: 'Min 0' } },
        gridCols: '2',
    },
];

export default function CreateMedicine({ onClose }) {
    const navigate = useNavigate();

    const [createMedicine, { isLoading }] = useCreateMedicineMutation();
    const { data: categoriesData = [] } = useGetAllCategoriesQuery();
    const { data: suppliersData = [] } = useGetAllSuppliersQuery();


    const categoryOptions = (categoriesData?.categories || []).map((c) => ({
        id: String(c.id),
        name: c.name,
    }));

    const supplierOptions = (suppliersData?.supplier || []).map((s) => ({
        id: String(s.id),
        name: s.name,
    }));

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
        watch,
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
            batches: [defaultBatch],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'batches',
    });

    const formConfig = createMedicineFormConfig(categoryOptions, supplierOptions);

    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                categoryId: Number(data.categoryId),
                supplierId: data.supplierId ? Number(data.supplierId) : undefined,
                reorderLevel: Number(data.reorderLevel) || 0,
                batches: (data.batches || []).map((b) => ({
                    ...b,
                    batchNumber: (b.batchNumber || '').trim(),
                    quantity: Number(b.quantity),
                    purchasePrice: Number(b.purchasePrice),
                    sellingPrice: Number(b.sellingPrice),
                })),
            };

            await createMedicine(payload).unwrap();
            toast.success('Medicine created');
            reset();
            onClose?.();
            navigate('/admin/medicine');
        } catch (error) {
            console.error('Create medicine failed', error);
            toast.error(error?.data?.message || 'Failed to create medicine');
        }
    };

    return (
        <div className="p-6 max-w-8xl mx-auto">


            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Card title="Medicine Information" subtitle="Enter the medicine details">
                    <GenericFormFields control={control} errors={errors} config={formConfig} />
                </Card>

                <Card
                    title="Batch Information"
                    subtitle="Add batch details for this medicine"
                    action={
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append(defaultBatch)}
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

                                <GenericFormFields
                                    control={control}
                                    errors={errors}
                                    config={batchFormConfig(index)}
                                />
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="flex justify-end gap-3 pt-2">
                    <Button variant="outline" type="button" onClick={() => (onClose ? onClose() : navigate('/admin/medicine'))}>
                        Cancel
                    </Button>

                    <CustomSubmitButton
                        isLoading={isLoading}
                        type="submit"
                        disabled={isLoading}
                        label="Create Medicine"
                        loadingLabel="Creating..."
                    />
                </div>
            </form>
        </div>
    );
}
