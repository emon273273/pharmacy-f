import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';
import {
    Pill,
    AlertTriangle,
    Clock,
    Layers,
    TrendingUp,
    Package,
} from 'lucide-react';

// Demo data
const monthlyData = [
    { name: "Jan", sales: 4200, purchases: 3800 },
    { name: "Feb", sales: 3800, purchases: 3200 },
    { name: "Mar", sales: 5100, purchases: 4500 },
    { name: "Apr", sales: 4600, purchases: 4100 },
    { name: "May", sales: 5400, purchases: 4800 },
    { name: "Jun", sales: 4900, purchases: 4200 },
    { name: "Jul", sales: 6200, purchases: 5600 },
    { name: "Aug", sales: 5800, purchases: 5100 },
    { name: "Sep", sales: 6500, purchases: 5900 },
    { name: "Oct", sales: 7100, purchases: 6400 },
    { name: "Nov", sales: 6800, purchases: 6100 },
    { name: "Dec", sales: 7500, purchases: 6800 },
];

const categoryDistribution = [
    { name: "Tablets", value: 35, color: "#6366f1" },
    { name: "Capsules", value: 25, color: "#8b5cf6" },
    { name: "Syrups", value: 15, color: "#a78bfa" },
    { name: "Injections", value: 12, color: "#c4b5fd" },
    { name: "Others", value: 13, color: "#ddd6fe" },
];

const expiringBatches = [
    { medicine: "Paracetamol 500mg", batch: "BTH-2024-001", expiry: "2026-03-15", stock: 450, status: "critical" },
    { medicine: "Amoxicillin 250mg", batch: "BTH-2024-012", expiry: "2026-03-28", stock: 200, status: "critical" },
    { medicine: "Omeprazole 20mg", batch: "BTH-2024-045", expiry: "2026-04-10", stock: 320, status: "warning" },
    { medicine: "Cetirizine 10mg", batch: "BTH-2024-078", expiry: "2026-04-22", stock: 180, status: "warning" },
    { medicine: "Metformin 500mg", batch: "BTH-2024-099", expiry: "2026-05-05", stock: 600, status: "normal" },
];

const lowStockItems = [
    { medicine: "Azithromycin 500mg", stock: 12, reorderLevel: 50 },
    { medicine: "Ibuprofen 400mg", stock: 8, reorderLevel: 30 },
    { medicine: "Ciprofloxacin 500mg", stock: 15, reorderLevel: 40 },
    { medicine: "Salbutamol Inhaler", stock: 5, reorderLevel: 20 },
];

const StatCard = ({ title, value, subtitle, icon: Icon, iconBg, iconColor }) => (
    <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
            <div className={`p-2 rounded-lg ${iconBg}`}>
                <Icon className={`h-4 w-4 ${iconColor}`} />
            </div>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </CardContent>
    </Card>
);

const Dashboard = () => {
    return (
        <div className="flex-1 space-y-6 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
                    <p className="text-slate-500 mt-1">Pharmacy overview and analytics</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Medicines"
                    value="1,284"
                    subtitle="+24 added this month"
                    icon={Pill}
                    iconBg="bg-indigo-50"
                    iconColor="text-indigo-600"
                />
                <StatCard
                    title="Low Stock Alerts"
                    value="18"
                    subtitle="Below reorder level"
                    icon={AlertTriangle}
                    iconBg="bg-amber-50"
                    iconColor="text-amber-600"
                />
                <StatCard
                    title="Expiring Soon"
                    value="32"
                    subtitle="Within 90 days"
                    icon={Clock}
                    iconBg="bg-red-50"
                    iconColor="text-red-600"
                />
                <StatCard
                    title="Categories"
                    value="42"
                    subtitle="Active categories"
                    icon={Layers}
                    iconBg="bg-emerald-50"
                    iconColor="text-emerald-600"
                />
            </div>

            {/* Charts Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle className="text-lg">Monthly Overview</CardTitle>
                        <CardDescription>Sales vs Purchases (demo data)</CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={monthlyData} barGap={4}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `৳${v}`} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                        }}
                                    />
                                    <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} name="Sales" />
                                    <Bar dataKey="purchases" fill="#a5b4fc" radius={[4, 4, 0, 0]} name="Purchases" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle className="text-lg">Category Distribution</CardTitle>
                        <CardDescription>Medicine types breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={categoryDistribution}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={4}
                                        dataKey="value"
                                    >
                                        {categoryDistribution.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 mt-2">
                            {categoryDistribution.map((item) => (
                                <div key={item.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    {item.name} ({item.value}%)
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tables Row */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Expiring Batches */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Clock className="h-5 w-5 text-red-500" />
                            Expiring Batches
                        </CardTitle>
                        <CardDescription>Medicines expiring soon</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {expiringBatches.map((batch, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-900">{batch.medicine}</p>
                                        <p className="text-xs text-slate-500">Batch: {batch.batch}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-slate-600">{batch.stock} units</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${batch.status === 'critical'
                                            ? 'bg-red-100 text-red-700'
                                            : batch.status === 'warning'
                                                ? 'bg-amber-100 text-amber-700'
                                                : 'bg-green-100 text-green-700'
                                            }`}>
                                            {batch.expiry}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Low Stock */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            Low Stock Alerts
                        </CardTitle>
                        <CardDescription>Below reorder level</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {lowStockItems.map((item, i) => {
                                const percent = Math.round((item.stock / item.reorderLevel) * 100);
                                return (
                                    <div key={i} className="p-3 rounded-lg bg-slate-50">
                                        <div className="flex justify-between items-center mb-2">
                                            <p className="text-sm font-medium text-slate-900">{item.medicine}</p>
                                            <span className="text-xs font-bold text-red-600">{item.stock} left</span>
                                        </div>
                                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all ${percent < 30 ? 'bg-red-500' : percent < 60 ? 'bg-amber-500' : 'bg-green-500'}`}
                                                style={{ width: `${Math.min(percent, 100)}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Reorder at: {item.reorderLevel} units</p>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
