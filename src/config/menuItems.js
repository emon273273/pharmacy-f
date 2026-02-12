// src/config/menuItems.js
import {
    LayoutDashboard,
    Users,
    ShieldCheck,
    Pill,
    Layers,
    Truck,
    Plus,
    List,
} from "lucide-react";

// Main Menu Items
export const mainMenuItems = [
    {
        key: "dashboard",
        label: "DASHBOARD",
        path: "/admin/dashboard",
        icon: LayoutDashboard,
        permit: {
            permissions: ["readAll-user", "create-user"],
            operator: "or",
        },
    },
    {
        key: "medicine",
        label: "MEDICINE",
        icon: Pill,
        permit: {
            permissions: ["readAll-user", "create-user"],
            operator: "or",
        },
        children: [
            {
                key: "all-medicines",
                label: "All Medicines",
                icon: List,
                path: "/admin/medicine",
                permit: {
                    permissions: ["readAll-user", "create-user"],
                    operator: "or",
                },
            },
            {
                key: "add-medicine",
                label: "Add Medicine",
                icon: Plus,
                path: "/admin/medicine/create",
                permit: {
                    permissions: ["create-user"],
                    operator: "or",
                },
            },
        ],
    },
    {
        key: "category",
        label: "CATEGORY",
        path: "/admin/category",
        icon: Layers,
        permit: {
            permissions: ["readAll-user", "create-user"],
            operator: "or",
        },
    },
    {
        key: "supplier",
        label: "SUPPLIER",
        path: "/admin/supplier",
        icon: Truck,
        permit: {
            permissions: ["readAll-user", "create-user"],
            operator: "or",
        },
    },
    {
        key: "hr",
        label: "HR",
        icon: Users,
        permit: {
            permissions: ["create-role", "readAll-role", "create-rolePermission", "readAll-rolePermission"],
            operator: "or",
        },
        children: [
            {
                key: "role",
                label: "Role & Permissions",
                path: "/admin/role",
                icon: ShieldCheck,
                permit: {
                    permissions: ["create-role", "readAll-role", "readSingle-role", "update-role", "delete-role"],
                    operator: "or",
                },
            },
        ],
    },
    {
        key: "users",
        label: "Users",
        path: "/admin/users",
        icon: Users,
        permit: {
            permissions: ["create-user", "readAll-user", "readSingle-user", "update-user", "delete-user"],
            operator: "or",
        },
    },
];

// Settings Menu Items
export const settingMenuItems = [];