import React from "react";
import { cn } from "@/lib/utils";

export default function Card({ title, action, children, className }) {
    return (
        <div className={cn("bg-white border rounded-lg shadow-sm w-full p-4", className)}>
            {/* Card Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center  gap-4">
                {title && <h2 className="text-xl font-semibold text-slate-800">{title}</h2>}
                {action && <div className="flex items-center gap-2">{action}</div>}
            </div>

            {/* Card Body */}
            <div className="pt-4">
                {children}
            </div>
        </div>
    );
}