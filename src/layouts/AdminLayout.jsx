import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentRoleId } from '@/redux/features/auth/authSlice';
import { useGetPermissionsQuery } from '@/redux/features/permissions/permissionsApi';
import Header from '@/layouts/Header';
import SideNav from '@/layouts/SideNav';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/permissionHelper';
import { Button } from '@/components/ui/button';

export default function AdminLayout() {
    const roleId = useSelector(selectCurrentRoleId);
    const [collapsed, setCollapsed] = useState(false);

    const { data: permissions, isLoading } = useGetPermissionsQuery(roleId, {
        skip: !roleId,
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex h-screen w-full bg-muted/40 overflow-hidden">
            <aside className={cn(
                "fixed inset-y-0 left-0 z-10 hidden flex-col border-r bg-background sm:flex transition-all duration-300",
                collapsed ? "w-20" : "w-64"
            )}>
                <div className={cn("flex h-16 items-center border-b px-4", collapsed ? "justify-center" : "justify-between")}>
                    <div className={cn("flex items-center gap-2 transition-all overflow-hidden", collapsed ? "opacity-0 w-0 hidden" : "opacity-100 w-auto")}>
                        <span className="font-bold text-lg truncate">
                            Pharmacy
                        </span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} className={cn("h-8 w-8", collapsed && "w-full h-full")}>
                        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                    </Button>
                </div>
                <SideNav permissions={permissions} collapsed={collapsed} setCollapsed={setCollapsed} />
            </aside>
            <div className={cn(
                "flex flex-col flex-1 min-w-0 transition-all duration-300 h-full",
                collapsed ? "sm:pl-20" : "sm:pl-64"
            )}>
                <Header />
                <main className="flex-1 min-w-0 overflow-auto p-4 sm:px-6 thin-scrollbar">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
