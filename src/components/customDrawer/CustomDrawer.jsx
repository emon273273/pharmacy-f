import React from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";

const CustomDrawer = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    side = "right", // top, right, bottom, left
    className,
    width, // 70 means 70% or 500px 
}) => {
    const isVertical = side === "top" || side === "bottom";
    const computeSize = (w) => {
        if (typeof w === 'number') return `${w}%`;
        if (typeof w === 'string') {
            // if string looks like a pure number (e.g. '10'), treat as percent
            if (/^\d+$/.test(w.trim())) return `${w.trim()}%`;
            return w;
        }
        return undefined;
    };

    const sizeValue = computeSize(width);
    const style = width ? {
        [isVertical ? 'height' : 'width']: sizeValue,
    } : {};

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent
                side={side}
                className={width ? `!max-w-none ${className || ''}` : className}
                style={style}
            >
                <SheetHeader>
                    {title && <SheetTitle>{title}</SheetTitle>}
                    {description && <SheetDescription>{description}</SheetDescription>}
                </SheetHeader>
                <div className="mt-4 h-full overflow-y-auto pb-4">
                    {children}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default CustomDrawer;
