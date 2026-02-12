import React, { useState, useRef, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    Settings,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import { cn, checkPermission } from "../utils/permissionHelper";
import usePermissions from "../hooks/usePermissions";
import { mainMenuItems, settingMenuItems } from "../config/menuItems";

const MenuItem = ({ item, collapsed, setCollapsed, permissions, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    if (!checkPermission(permissions, item.permit)) return null;

    const hasChildren = item.children && item.children.length > 0;
    const isActive = item.path ? location.pathname === item.path : false;

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (collapsed) setCollapsed(false);
    };

    const itemClasses = cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer group",
        "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        isActive && "bg-primary/10 text-primary font-medium hover:bg-primary/15",
        collapsed && level === 0 ? "justify-center px-2" : "justify-between"
    );

    const iconClasses = cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-gray-500 group-hover:text-gray-700");


    if (hasChildren) {
        return (
            <li className="mb-1">
                <div onClick={handleToggle} className={itemClasses}>
                    <div className="flex items-center gap-3 overflow-hidden">
                        {item.icon && <item.icon className={iconClasses} />}
                        {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>

                    {!collapsed && (
                        <span className="text-gray-400">
                            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                    )}
                </div>

                {isOpen && !collapsed && (
                    <ul className="pl-4 mt-1 border-l border-gray-200 ml-5 space-y-1">
                        {item.children.map((child) => (
                            <MenuItem
                                key={child.key}
                                item={child}
                                collapsed={collapsed}
                                setCollapsed={setCollapsed}
                                permissions={permissions}
                                level={level + 1}
                            />
                        ))}
                    </ul>
                )}
            </li>
        );
    }
    return (
        <li className="mb-1">
            <NavLink
                to={item.path || "#"}
                className={({ isActive }) =>
                    cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                        "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                        isActive && "bg-primary/10 text-primary font-medium",
                        collapsed ? "justify-center px-2" : ""
                    )
                }
            >
                {item.icon && <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-gray-500 group-hover:text-gray-700")} />}
                {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
        </li>
    );
};

const SideNav = ({ collapsed, setCollapsed }) => {
    const { permissions, loading } = usePermissions();
    const [isSettingMode, setIsSettingMode] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        if (menuRef.current) menuRef.current.scrollTop = 0;
    }, [isSettingMode]);

    return (
        <div
            ref={menuRef}
            className="h-[calc(100vh-100px)] overflow-y-auto overflow-x-hidden bg-white border-r border-gray-100 pb-4 no-scrollbar"
        >
            {loading ? (
                "Side Nav Loader.........."
            ) : (
                <div className="relative w-full">
                    <div
                        className={cn(
                            "absolute top-0 w-full transition-transform duration-300 ease-in-out px-3 py-2",
                            isSettingMode ? "-translate-x-full opacity-0 invisible" : "translate-x-0 opacity-100 visible"
                        )}
                    >
                        <ul className="space-y-1">
                            {mainMenuItems.map((item) => (
                                <MenuItem
                                    key={item.key}
                                    item={item}
                                    collapsed={collapsed}
                                    setCollapsed={setCollapsed}
                                    permissions={permissions}
                                />
                            ))}
                        </ul>

                        {!loading && permissions.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div
                                    onClick={() => setIsSettingMode(true)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-gray-600 hover:bg-gray-100 transition-all",
                                        collapsed ? "justify-center" : "justify-between"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <Settings className="h-5 w-5 text-gray-500" />
                                        {!collapsed && <span>Settings</span>}
                                    </div>
                                    {!collapsed && <ChevronRight size={16} className="text-gray-400" />}
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        className={cn(
                            "absolute top-0 w-full transition-transform duration-300 ease-in-out px-3 py-2",
                            isSettingMode ? "translate-x-0 opacity-100 visible" : "translate-x-full opacity-0 invisible"
                        )}
                    >

                        <div
                            onClick={() => setIsSettingMode(false)}
                            className={cn(
                                "flex items-center gap-2 mb-2 px-3 py-2.5 rounded-lg cursor-pointer text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all font-medium",
                                collapsed && "justify-center"
                            )}
                        >
                            <ChevronLeft size={18} />
                            {!collapsed && <span>Back to Menu</span>}
                        </div>

                        <ul className="space-y-1 pt-2">
                            {settingMenuItems.map((item) => (
                                <MenuItem
                                    key={item.key}
                                    item={item}
                                    collapsed={collapsed}
                                    setCollapsed={setCollapsed}
                                    permissions={permissions}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SideNav;