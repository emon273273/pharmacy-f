// src/utils/permissionHelper.js

export const checkPermission = (userPermissions, requiredPermit) => {
    if (!requiredPermit) return true;

    const { permissions: needed, operator = "or" } = requiredPermit;

    if (!Array.isArray(userPermissions)) return false;

    if (operator === "or") {
        return needed.some((p) => userPermissions.includes(p));
    } else {
        // operator === 'and'
        return needed.every((p) => userPermissions.includes(p));
    }
};

// Tailwind class merger (Shadcn style)
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}