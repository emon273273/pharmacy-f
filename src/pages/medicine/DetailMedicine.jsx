import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetMedicineByIdQuery } from '@/redux/features/medicine/medicineApi';
import Card from '@/components/card/Card';
import DynamicTable from '@/components/customTable/DynamicTable';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Package, Tag, Calendar, AlertCircle, Factory, Beaker, Droplet } from 'lucide-react';
import { format } from 'date-fns';

// Helper to format date safely
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return format(new Date(dateString), 'PPP');
    } catch {
        return dateString;
    }
};

// Calculate total stock from batches
const calculateTotalStock = (batches) => {
    if (!batches || !batches.length) return 0;
    return batches.reduce((sum, batch) => sum + batch.quantity, 0);
};

// Get expiry status for badge
const getExpiryStatus = (batches) => {
    if (!batches || !batches.length) return null;
    const now = new Date();
    const soon = new Date();
    soon.setMonth(soon.getMonth() + 3); // 3 months from now

    const expired = batches.some(b => new Date(b.expiryDate) < now);
    const expiringSoon = batches.some(b => {
        const expiry = new Date(b.expiryDate);
        return expiry >= now && expiry <= soon;
    });

    if (expired) return { label: 'Expired', variant: 'destructive' };
    if (expiringSoon) return { label: 'Expiring Soon', variant: 'warning' };
    return { label: 'Valid', variant: 'success' };
};

const DetailMedicine = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: medicine, isLoading, error } = useGetMedicineByIdQuery(id);

    // Loading state
    if (isLoading) {
        return (
            <div className="p-6">
                <Card title="Loading...">
                    <div className="p-8 text-center text-slate-500">Loading medicine details...</div>
                </Card>
            </div>
        );
    }

    // Error or no data
    if (error || !medicine) {
        return (
            <div className="p-6">
                <Card title="Error">
                    <div className="p-8 text-center text-red-500">
                        {error?.data?.message || 'Medicine not found'}
                    </div>
                </Card>
            </div>
        );
    }

    const totalStock = calculateTotalStock(medicine.batches);
    const expiryStatus = getExpiryStatus(medicine.batches);

    // Columns for batches table
    const batchColumns = [
        {
            key: 'batchNumber',
            title: 'Batch #',
            dataIndex: 'batchNumber',
        },
        {
            key: 'quantity',
            title: 'Quantity',
            dataIndex: 'quantity',
        },
        {
            key: 'manufacturingDate',
            title: 'Mfg Date',
            render: (row) => formatDate(row.manufacturingDate),
        },
        {
            key: 'expiryDate',
            title: 'Expiry Date',
            render: (row) => {
                const isExpired = new Date(row.expiryDate) < new Date();
                return (
                    <span className={isExpired ? 'text-red-600 font-semibold' : ''}>
                        {formatDate(row.expiryDate)}
                        {isExpired && ' (Expired)'}
                    </span>
                );
            },
        },
        {
            key: 'purchasePrice',
            title: 'Purchase Price',
            render: (row) => `$${row.purchasePrice?.toFixed(2)}`,
        },
        {
            key: 'sellingPrice',
            title: 'Selling Price',
            render: (row) => `$${row.sellingPrice?.toFixed(2)}`,
        },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header with back button, title, badges, and edit button */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">ID: {medicine.id}</Badge>
                            {expiryStatus && (
                                <Badge variant={expiryStatus.variant}>{expiryStatus.label}</Badge>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">{medicine.medicineName}</h1>
                        <p className="text-slate-500 text-sm">{medicine.genericName} | {medicine.brandName}</p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                    onClick={() => navigate(`/admin/medicine/${id}/edit`)}
                >
                    <Edit className="h-4 w-4" />
                    Edit Medicine
                </Button>
            </div>

            {/* Main grid: left column (2/3) for batches table, right column (1/3) for cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column: Batches */}
                <div className="lg:col-span-2">
                    <Card title="Batches">
                        <DynamicTable
                            columns={batchColumns}
                            list={medicine.batches || []}
                            total={medicine.batches?.length || 0}
                            loading={false}
                            pageConfig={{ page: 1, count: 10 }}
                            setPageConfig={() => { }} // disable pagination if not needed
                            hidePagination={medicine.batches?.length <= 10} // optional
                        />
                    </Card>
                </div>

                {/* Right column: Overview and Details cards */}
                <div className="space-y-6">
                    {/* Overview Card */}
                    <Card title="Overview">
                        <div className="p-4 space-y-4">
                            <div className="flex gap-3">
                                <Package className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="text-xs font-medium text-blue-600/70 uppercase">Generic Name</p>
                                    <p className="font-medium">{medicine.genericName}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Tag className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="text-xs font-medium text-blue-600/70 uppercase">Brand Name</p>
                                    <p className="font-medium">{medicine.brandName}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Beaker className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="text-xs font-medium text-blue-600/70 uppercase">Dosage Type</p>
                                    <p className="font-medium">{medicine.dosageType}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Droplet className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="text-xs font-medium text-blue-600/70 uppercase">Unit Type</p>
                                    <p className="font-medium">{medicine.unitType}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Factory className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="text-xs font-medium text-blue-600/70 uppercase">Category</p>
                                    <p className="font-medium">{medicine.category?.name || 'N/A'}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Factory className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="text-xs font-medium text-blue-600/70 uppercase">Supplier</p>
                                    <p className="font-medium">{medicine.supplier?.name || 'N/A'}</p>
                                    {medicine.supplier?.email && (
                                        <p className="text-sm text-slate-500">{medicine.supplier.email}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Details Card */}
                    <Card title="Details">
                        <div className="p-4 space-y-4">
                            <div className="flex gap-3">
                                <Package className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="text-xs font-medium text-blue-600/70 uppercase">Total Stock</p>
                                    <p className="font-medium">{totalStock} units</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <AlertCircle className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="text-xs font-medium text-blue-600/70 uppercase">Reorder Level</p>
                                    <p className="font-medium">{medicine.reorderLevel ?? 0} units</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="text-xs font-medium text-blue-600/70 uppercase">Created At</p>
                                    <p className="font-medium">{formatDate(medicine.createdAt)}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="text-xs font-medium text-blue-600/70 uppercase">Last Updated</p>
                                    <p className="font-medium">{formatDate(medicine.updatedAt)}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Description Card (if any) */}
                    {medicine.description && (
                        <Card title="Description">
                            <div className="p-4">
                                <p className="text-slate-700">{medicine.description}</p>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetailMedicine;