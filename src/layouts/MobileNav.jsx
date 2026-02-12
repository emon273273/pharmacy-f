import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import SideNav from "./SideNav";
import { useGetPermissionsQuery } from "@/redux/features/permissions/permissionsApi";
import { useSelector } from "react-redux";
import { selectCurrentRoleId } from "@/redux/features/auth/authSlice";
import { useState } from "react";

const MobileNav = () => {
    const [open, setOpen] = useState(false);
    const roleId = useSelector(selectCurrentRoleId);

    const { data: permissions } = useGetPermissionsQuery(roleId, {
        skip: !roleId,
    });

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
                <div className="flex h-16 items-center border-b px-6">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <span className="font-bold text-lg truncate">
                            Pharmacy
                        </span>
                    </div>
                </div>
                <div className="px-2 py-4">
                    <SideNav
                        permissions={permissions}
                        collapsed={false}
                        setCollapsed={() => { }}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default MobileNav;
