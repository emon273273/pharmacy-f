import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Shield,
    Save,
    Info,
    ChevronDown,
    ChevronRight,
    CheckCheck,
    AlertCircle,
    Loader2
} from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils"; // Standard shadcn utility
import { useAddPermissionMutation, useGetAllPermissionQuery } from "@/redux/features/permissions/permissionsApi";
import { useGetSingleRoleQuery } from "@/redux/features/role/roleApi";

const DetailRole = () => {
    const { id } = useParams();

    // State
    const [selectedIds, setSelectedIds] = useState([]);
    const [isChanged, setIsChanged] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Manage open states for accordions (key: permission type)
    const [openSections, setOpenSections] = useState({});

    // API Hooks
    const { data: permissionsData, isLoading: isPermissionsLoading } = useGetAllPermissionQuery();
    const { data: roleData, isLoading: isRoleLoading, refetch: refetchRole } = useGetSingleRoleQuery(id);
    const [updateRolePermissions, { isLoading: isUpdating }] = useAddPermissionMutation();


    // Transform Data: Group raw permissions by Type -> Resource
    const groupedPermissions = useMemo(() => {
        if (!permissionsData) return {};
        return transformPermissionData(permissionsData);
        // Note: If permissionsData is { data: [...] }, change to permissionsData.data
    }, [permissionsData]);

    // Initial Data Sync
    useEffect(() => {
        if (roleData && roleData.rolePermission) {
            const initialIds = roleData.rolePermission.map((rp) => rp.permissionId);
            setSelectedIds(initialIds);
        }
    }, [roleData]);

    // Change Detection Logic
    useEffect(() => {
        if (roleData && roleData.rolePermission) {
            const initialIds = roleData.rolePermission.map((rp) => rp.permissionId).sort((a, b) => a - b);
            const currentIds = [...selectedIds].sort((a, b) => a - b);

            const isDifferent = JSON.stringify(initialIds) !== JSON.stringify(currentIds);
            setIsChanged(isDifferent);
        }
    }, [selectedIds, roleData]);

    // --- Handlers ---

    const handleCheckboxChange = (permissionId) => {
        setSelectedIds((prev) => {
            if (prev.includes(permissionId)) {
                return prev.filter((id) => id !== permissionId);
            }
            return [...prev, permissionId];
        });
    };

    const handleGroupToggle = (permissionIds, shouldSelect) => {
        setSelectedIds((prev) => {
            const currentSet = new Set(prev);
            permissionIds.forEach((id) => {
                if (shouldSelect) currentSet.add(id);
                else currentSet.delete(id);
            });
            return Array.from(currentSet);
        });
    };

    const handleSave = async () => {
        try {
            const res = await updateRolePermissions({
                roleId: id,
                permissionId: selectedIds, // Adjust payload key based on your backend requirement
            }).unwrap();

            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
            refetchRole(); // Refresh local data
        } catch (error) {
            console.error("Failed to update permissions", error);
        }
    };

    const toggleSection = (type) => {
        setOpenSections((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    // --- Loading State ---
    if (isPermissionsLoading || isRoleLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading role details...</span>
            </div>
        );
    }

    // Calculate totals for UI
    const totalPermissionsCount = permissionsData?.length || 0; // Or permissionsData.data.length

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-6">

            {/* Header Card */}
            <Card className="sticky top-0 z-50 border-l-4 border-l-primary shadow-sm mb-6 bg-card/95 backdrop-blur-sm">
                <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 pb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold">Role Permissions: {roleData?.name}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Manage access levels and functional scopes for this role.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col items-end min-w-[140px]">
                            <div className="flex items-baseline gap-1 mb-1.5">
                                <span className="text-2xl font-bold tracking-tight">
                                    {selectedIds.length}
                                    <span className="text-sm font-medium text-muted-foreground ml-1">/ {totalPermissionsCount}</span>
                                </span>
                            </div>

                            <div className="w-full space-y-1">
                                <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                                        style={{ width: `${Math.min(100, (selectedIds.length / (totalPermissionsCount || 1)) * 100)}%` }}
                                    />
                                </div>
                                <div className="text-[10px] font-medium text-muted-foreground text-right">
                                    {Math.round((selectedIds.length / (totalPermissionsCount || 1)) * 100)}% Access Level
                                </div>
                            </div>
                        </div>

                        <div className="h-10 w-px bg-border hidden md:block" />

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={handleSave}
                                        disabled={!isChanged || isUpdating}
                                        size="lg"
                                        className="shadow-sm"
                                    >
                                        {isUpdating ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Save className="mr-2 h-4 w-4" />
                                        )}
                                        Save Changes
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    <p>{!isChanged ? "No changes to save" : "Update role permissions"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </CardHeader>
            </Card>

            {/* Alerts */}
            {saveSuccess && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                    <CheckCheck className="h-4 w-4 text-green-600" />
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Permissions have been successfully updated.</AlertDescription>
                </Alert>
            )}

            {/* Info Block */}
            <Alert className="bg-blue-50/50 border-blue-100 text-blue-900">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-700">Managing Permissions</AlertTitle>
                <AlertDescription className="text-blue-600/90">
                    Use the checkboxes to grant or revoke permissions. Click on a category header to view specific actions.
                    Changes are not live until you click <strong>Update Permissions</strong>.
                </AlertDescription>
            </Alert>

            {/* Permissions Accordions */}
            <div className="grid gap-4">
                {Object.entries(groupedPermissions).map(([type, resources]) => {
                    // Flatten all permissions in this type to check "Select All" status for the header
                    const allPermissionsInType = Object.values(resources).flat();
                    const allIdsInType = allPermissionsInType.map(p => p.id);

                    const checkedCount = allIdsInType.filter(id => selectedIds.includes(id)).length;
                    const isAllChecked = allIdsInType.length > 0 && checkedCount === allIdsInType.length;
                    const isIndeterminate = checkedCount > 0 && checkedCount < allIdsInType.length;
                    const isOpen = openSections[type];

                    return (
                        <Collapsible
                            key={type}
                            open={isOpen}
                            onOpenChange={() => toggleSection(type)}
                            className={cn(
                                "border rounded-lg bg-card transition-all duration-200",
                                isOpen ? "border-primary/20 shadow-md" : "hover:border-primary/20"
                            )}
                        >
                            {/* Accordion Header */}
                            <div
                                onClick={() => toggleSection(type)}
                                className={cn(
                                    "flex items-center justify-between p-4 cursor-pointer select-none rounded-t-lg",
                                    isOpen ? "bg-muted/30" : "bg-card"
                                )}>
                                <div className="flex items-center gap-4 flex-1">
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
                                            {isOpen ? (
                                                <ChevronDown className="h-5 w-5 text-primary" />
                                            ) : (
                                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </CollapsibleTrigger>

                                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                        <Checkbox
                                            checked={isAllChecked ? true : isIndeterminate ? "indeterminate" : false}
                                            onCheckedChange={(checked) => handleGroupToggle(allIdsInType, !!checked)}
                                            className="data-[state=checked]:bg-primary data-[state=indeterminate]:bg-primary/70"
                                        />
                                        <span
                                            onClick={() => toggleSection(type)}
                                            className="font-semibold text-lg capitalize tracking-tight"
                                        >
                                            {formatText(type)}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Badge variant="outline" className={cn(
                                        "font-mono text-xs",
                                        checkedCount > 0 ? "bg-primary/10 text-primary border-primary/20" : "text-muted-foreground"
                                    )}>
                                        {checkedCount} / {allIdsInType.length}
                                    </Badge>
                                </div>
                            </div>

                            {/* Accordion Content */}
                            <CollapsibleContent>
                                <div className="p-6 pt-2 space-y-8">
                                    {Object.entries(resources).map(([resource, perms]) => {

                                        // Check logic for this specific resource sub-group
                                        const resourceIds = perms.map(p => p.id);
                                        const isResourceAllChecked = resourceIds.every(id => selectedIds.includes(id));

                                        return (
                                            <div key={resource} className="relative">
                                                {/* Resource Sub-Header */}
                                                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/60">
                                                    <Checkbox
                                                        id={`grp-${resource}`}
                                                        checked={isResourceAllChecked}
                                                        onCheckedChange={(checked) => handleGroupToggle(resourceIds, !!checked)}
                                                    />
                                                    <label
                                                        htmlFor={`grp-${resource}`}
                                                        className="text-sm font-semibold text-foreground/80 capitalize cursor-pointer"
                                                    >
                                                        {formatText(resource)} Module
                                                    </label>
                                                </div>

                                                {/* Grid of Permissions */}
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                                    {perms.map((perm) => {
                                                        const isChecked = selectedIds.includes(perm.id);
                                                        const actionName = perm.name.split("-")[0]; // e.g., 'create' from 'create-product'

                                                        return (
                                                            <div
                                                                key={perm.id}
                                                                className={cn(
                                                                    "flex items-start gap-3 p-3 rounded-md border transition-all duration-200 cursor-pointer hover:shadow-sm",
                                                                    isChecked
                                                                        ? "bg-primary/5 border-primary/30"
                                                                        : "bg-white border-border"
                                                                )}
                                                                onClick={() => handleCheckboxChange(perm.id)}
                                                            >
                                                                <Checkbox
                                                                    checked={isChecked}
                                                                    className="mt-0.5"
                                                                // No onChange here, parent div handles click for better UX
                                                                />
                                                                <div className="space-y-1">
                                                                    <p className={cn(
                                                                        "text-sm font-medium leading-none capitalize",
                                                                        isChecked ? "text-primary" : "text-foreground"
                                                                    )}>
                                                                        {formatText(actionName)}
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground leading-tight">
                                                                        {getPermissionDescription(actionName)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    );
                })}
            </div>
        </div>
    );
};

export default DetailRole;

/* --- Utility Functions --- */

/**
 * Transforms flat API data into a nested structure:
 * {
 * [type]: {
 * [resource]: [Permission Objects]
 * }
 * }
 */
function transformPermissionData(data) {
    if (!Array.isArray(data)) return {};

    const grouped = {};

    data.forEach((item) => {
        const type = item.type || "Other";
        const parts = item.name.split("-");
        // Usually name is "action-resource" (e.g., create-product)
        // If name is just "dashboard", resource is dashboard.
        const resource = parts.length > 1 ? parts[1] : parts[0];

        if (!grouped[type]) {
            grouped[type] = {};
        }

        if (!grouped[type][resource]) {
            grouped[type][resource] = [];
        }

        grouped[type][resource].push(item);
    });

    // Sort logic (optional): Ensure 'read' actions come first visually?
    // For now, we just return the structure.
    return grouped;
}

function formatText(str) {
    if (!str) return "";
    return str
        .replace(/([A-Z])/g, " $1") // Add space before capital letters (camelCase)
        .replace(/[_-]/g, " ")      // Replace underscores/dashes with space
        .trim();
}

function getPermissionDescription(action) {
    const map = {
        create: "Add new entries",
        readAll: "View full list",
        readSingle: "View details",
        update: "Modify existing",
        delete: "Remove entries",
        view: "Access only",
        manage: "Full control",
    };
    return map[action] || `Allow ${action}`;
}