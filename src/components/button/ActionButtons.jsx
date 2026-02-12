import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, FilePenLine, Trash2 } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import PrivacyGuard from '../Guard/PrivacyGuard';

export const ViewButton = ({ to, title = "View Details", permission }) => {
    const content = (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link to={to}>
                        <button className="text-gray-600 hover:text-gray-900 transition-colors p-1">
                            <Eye size={18} />
                        </button>
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{title}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

    return permission ? <PrivacyGuard permission={permission}>{content}</PrivacyGuard> : content;
};

export const EditButton = ({ onClick, title = "Edit", permission }) => {
    const content = (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button onClick={onClick} className="text-blue-600 hover:text-blue-800 transition-colors p-1">
                        <FilePenLine size={18} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{title}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

    return permission ? <PrivacyGuard permission={permission}>{content}</PrivacyGuard> : content;
};

export const DeleteButton = ({ onClick, title = "Delete", permission }) => {
    const content = (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button onClick={onClick} className="text-red-600 hover:text-red-800 transition-colors p-1">
                        <Trash2 size={18} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{title}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );

    return permission ? <PrivacyGuard permission={permission}>{content}</PrivacyGuard> : content;
};
