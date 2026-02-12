import React, { useState, useEffect, useRef } from "react";
import usePermissions from "../../hooks/usePermissions";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    Columns,
    X,
    Printer,
    Download,
    Database,
    Plus,
    Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";


const FilterSelect = ({ label, options = [], value, onChange, mode = 'multiple' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue) => {
        if (mode === 'single') {
            onChange(optionValue);
            setIsOpen(false);
        } else {
            // Handle multi-select logic
            let newValue;
            const currentValues = Array.isArray(value) ? value : [];

            if (currentValues.includes(optionValue)) {
                newValue = currentValues.filter(v => v !== optionValue);
            } else {
                newValue = [...currentValues, optionValue];
            }
            onChange(newValue);
        }
    };

    // Text to display inside the box
    const getDisplayText = () => {
        if (!value || (Array.isArray(value) && value.length === 0)) return <span className="text-slate-500 font-normal">{label}</span>;

        if (mode === 'single') {
            const selectedOption = options.find(o => o.value === value);
            return selectedOption ? selectedOption.label : value;
        }

        if (Array.isArray(value) && value.length === 1) {
            const selectedOption = options.find(o => o.value === value[0]);
            return selectedOption ? selectedOption.label : value[0];
        }
        return `${value.length} Selected`;
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-900 focus:outline-none"
            >
                <span className="truncate mr-2">{getDisplayText()}</span>
                <ChevronDown size={14} className="text-slate-400" />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 z-50 mt-1 w-[200px] bg-white border rounded-md shadow-xl py-1 max-h-60 overflow-y-auto">
                    {options.map((option) => {
                        const isSelected = mode === 'single'
                            ? value === option.value
                            : (Array.isArray(value) && value.includes(option.value));

                        return (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className="flex items-center px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer select-none text-slate-700"
                            >
                                <div className={cn(
                                    "w-4 h-4 mr-2 border rounded flex items-center justify-center transition-colors",
                                    isSelected ? "bg-slate-900 border-slate-900" : "border-slate-300",
                                    mode === 'single' && "rounded-full" // Radio style for single
                                )}>
                                    {isSelected && <Check size={10} className="text-white" />}
                                </div>
                                {option.label}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// --- 2. Filter Manager (Replaces old Filter component) ---
const FilterManager = ({ filterOptions, pageConfig, setPageConfig }) => {
    const [selectedFilterKeys, setSelectedFilterKeys] = useState([]);

    // Sync active filters if pageConfig has values (optional, keeps UI in sync with URL/State)
    useEffect(() => {
        const activeKeys = filterOptions
            .filter(f => {
                const val = pageConfig[f.key];
                if (Array.isArray(val)) return val.length > 0;
                return val !== undefined && val !== null && val !== '';
            })
            .map(f => f.key);

        // Merge with locally selected keys (to keep the tag visible even if empty)
        setSelectedFilterKeys(prev => [...new Set([...prev, ...activeKeys])]);
    }, []);

    const handleChange = (key, newValue) => {
        setPageConfig(prev => ({
            ...prev,
            [key]: newValue,
            page: 1 // Reset to page 1 on filter change
        }));
    };

    const handleRemove = (key) => {
        setSelectedFilterKeys(prev => prev.filter(k => k !== key));
        setPageConfig(prev => {
            const { [key]: _, ...rest } = prev; // Remove key from config
            return { ...rest, page: 1 };
        });
    };

    const handleAddFilter = (key) => {
        if (!selectedFilterKeys.includes(key)) {
            setSelectedFilterKeys([...selectedFilterKeys, key]);
        }
    };

    const activeFilters = filterOptions.filter(f => selectedFilterKeys.includes(f.key));
    const availableFilters = filterOptions.filter(f => !selectedFilterKeys.includes(f.key));

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* Active Filter Tags */}
            {activeFilters.map((filter) => (
                <div key={filter.key} className="flex items-center bg-[#e5e7eb] rounded-md pr-2 shadow-sm border border-slate-300/50">
                    <div className="min-w-[120px] max-w-[200px]">
                        <FilterSelect
                            label={filter.label}
                            options={filter.options}
                            value={pageConfig[filter.key]}
                            onChange={(val) => handleChange(filter.key, val)}
                            mode={filter.mode}
                        />
                    </div>
                    <button
                        onClick={() => handleRemove(filter.key)}
                        className="p-1 hover:bg-slate-300 rounded-full text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
            ))}

            {/* "Add Filter" Button (Only shows if there are filters left to add) */}
            {availableFilters.length > 0 && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 h-9 px-3 text-sm font-medium border rounded-md bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-sm border-dashed border-slate-300">
                            <Plus size={16} />
                            Filter
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[150px]">
                        {availableFilters.map((filter) => (
                            <DropdownMenuItem
                                key={filter.key}
                                onClick={() => handleAddFilter(filter.key)}
                                className="cursor-pointer"
                            >
                                {filter.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
};


// --- Sub-Component: Column Toggle ---
const ColumnToggle = ({ columns, visibleColumns, setVisibleColumns }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = (key) => {
        setVisibleColumns(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 h-9 px-3 text-sm font-medium border rounded-md bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-sm"
            >
                <Columns size={16} />
                Columns
                <ChevronDown size={14} className="text-slate-400" />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute left-0 z-20 mt-2 w-56 bg-white border rounded-md shadow-lg p-2 animate-in fade-in zoom-in-95">
                        <div className="text-xs font-semibold mb-2 text-slate-500 px-2 uppercase">Toggle Columns</div>
                        <div className="space-y-1 max-h-[300px] overflow-y-auto">
                            {columns.map((col) => (
                                <div
                                    key={col.key}
                                    onClick={() => toggle(col.key)}
                                    className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-slate-100 cursor-pointer select-none"
                                >
                                    <div className={cn(
                                        "w-4 h-4 border rounded flex items-center justify-center transition-colors",
                                        visibleColumns.includes(col.key) ? "bg-slate-900 border-slate-900" : "border-slate-300"
                                    )}>
                                        {visibleColumns.includes(col.key) && <span className="text-white text-[10px]">✓</span>}
                                    </div>
                                    {col.title}
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// --- Sub-Component: Toolbar ---
const TableToolbar = ({
    setPageConfig,
    pageConfig,
    columns,
    visibleColumns,
    setVisibleColumns,
    title,
    filterOptions,
    onFilterClick,
    activeFilters,
    setActiveFilters,
    handleExportPDF,
    handleExportCSV
}) => {
    const [searchValue, setSearchValue] = useState("");

    const handleSearch = (val) => {
        setSearchValue(val);
        if (!val) {
            setPageConfig((prev) => ({ ...prev, page: 1 }));
        }
    };

    const executeSearch = () => {
        if (searchValue) {
            setPageConfig((prev) => ({ ...prev, key: searchValue, page: 1 }));
        }
    };

    const removeFilter = (index) => {
        const newFilters = activeFilters.filter((_, i) => i !== index);
        setActiveFilters(newFilters);
    };

    return (
        <div className="space-y-4 mb-4">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
                <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
                    <div className="relative w-full sm:w-[300px]">
                        <input
                            type="text"
                            placeholder={`Search ${title}...`}
                            value={searchValue}
                            onChange={(e) => handleSearch(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && executeSearch()}
                            className="w-full h-9 pl-3 pr-10 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white shadow-sm"
                        />
                        <button
                            onClick={executeSearch}
                            className="absolute right-0 top-0 h-9 w-9 flex items-center justify-center bg-slate-900 text-white rounded-r-md hover:bg-slate-800 transition-colors"
                        >
                            <Search size={16} />
                        </button>
                    </div>

                    {/* New Filter Manager System */}
                    {filterOptions && filterOptions.length > 0 && (
                        <FilterManager
                            filterOptions={filterOptions}
                            pageConfig={pageConfig}
                            setPageConfig={setPageConfig}
                        />
                    )}

                    <ColumnToggle
                        columns={columns}
                        visibleColumns={visibleColumns}
                        setVisibleColumns={setVisibleColumns}
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <button
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 h-9 px-3 text-sm font-medium border rounded-md bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-sm"
                    >
                        <Printer size={16} />
                        Print PDF
                    </button>

                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 h-9 px-3 text-sm font-medium border rounded-md bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-sm"
                    >
                        <Download size={16} />
                        Download CSV
                    </button>
                </div>
            </div>

            {activeFilters.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {activeFilters.map((f, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full border border-blue-100"
                        >
                            {f.label}
                            <button
                                onClick={() => removeFilter(i)}
                                className="hover:text-blue-900 focus:outline-none"
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- Sub-Component: Pagination ---
const TablePagination = ({ total, pageConfig, setPageConfig }) => {
    const { page, count } = pageConfig;
    const totalPages = Math.ceil(total / count);
    const maxVisible = 3;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(startPage + maxVisible - 1, totalPages);
    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    const handlePageChange = (newPage) => setPageConfig((prev) => ({ ...prev, page: newPage }));
    const handleCountChange = (e) => setPageConfig((prev) => ({ ...prev, count: Number(e.target.value), page: 1 }));
    if (total === 0) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t mt-4">
            <div className="text-sm text-slate-500">
                Showing {((page - 1) * count) + 1} to {Math.min(page * count, total)} of {total} entries
            </div>
            <div className="flex items-center gap-2">
                <div className="flex items-center space-x-1">
                    <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1} className="p-2 rounded-md border bg-white disabled:opacity-50 hover:bg-slate-100 transition-colors"><ChevronLeft size={16} /></button>
                    {pages.map((p) => (
                        <button key={p} onClick={() => handlePageChange(p)} className={cn("h-9 w-9 rounded-md text-sm font-medium transition-colors", page === p ? "bg-slate-900 text-white" : "bg-white border hover:bg-slate-100 text-slate-700")}>{p}</button>
                    ))}
                    <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages} className="p-2 rounded-md border bg-white disabled:opacity-50 hover:bg-slate-100 transition-colors"><ChevronRight size={16} /></button>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 h-9 px-3 text-sm font-medium border rounded-md bg-white hover:bg-slate-50 text-slate-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-400">
                            {count} / page
                            <ChevronDown size={14} className="text-slate-400" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {[10, 20, 50, 100].map((c) => (
                            <DropdownMenuItem
                                key={c}
                                onClick={() => setPageConfig((prev) => ({ ...prev, count: c, page: 1 }))}
                                className={cn("cursor-pointer", count === c && "bg-slate-100 font-medium")}
                            >
                                {c} / page
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

const getRawData = (item, col) => {
    if (col.render) {
        const result = col.render(item);
        if (typeof result === 'string' || typeof result === 'number') {
            return result;
        }
        return "";
    }
    return item[col.dataIndex] || "";
};

export default function DynamicTable({
    columns,
    list = [],
    total = 0,
    loading = false,
    pageConfig,
    setPageConfig,
    title = "Data Table",
    filterOptions = [],
    onFilterClick,
    actionPermission = [],
}) {
    const [visibleColumns, setVisibleColumns] = useState([]);
    const [activeFilters, setActiveFilters] = useState([]);
    const { permissions } = usePermissions();

    useEffect(() => {
        if (columns?.length) {
            setVisibleColumns(columns.map(c => c.key));
        }
    }, [columns]);

    const displayedColumns = columns.filter(col => {
        if (!visibleColumns.includes(col.key)) return false;

        if (col.key === 'actions' && actionPermission.length > 0) {
            return actionPermission.some(p => permissions?.includes(p));
        }

        return true;
    });

    const renderCell = (item, column) => {
        if (column.render) {
            return column.render(item);
        }
        const value = item[column.dataIndex];

        // Check if key suggests a date field
        const key = (column.dataIndex || column.key || "").toLowerCase();
        const isDateKey = key.includes("createdat") ||
            key.includes("updatedat") ||
            key.includes("createat") ||
            key.includes("updateat") ||
            key.includes("date");

        if (value && isDateKey) {
            try {
                const date = new Date(value);
                if (!isNaN(date.getTime())) {
                    // Format: "Dec 13, 2025, 12:40 PM"
                    return date.toLocaleDateString("en-US", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                }
            } catch (error) {
                console.warn("Date parsing failed provided value:", value);
            }
        }

        return value !== undefined && value !== null ? value : "-";
    };


    const getExportableColumns = () => {
        return columns.filter(col =>
            visibleColumns.includes(col.key) &&
            col.key.toLowerCase() !== 'actions' &&
            col.key.toLowerCase() !== 'action'
        );
    };

    const getFormattedDate = () => {
        const date = new Date();
        return date.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getFilenameDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    const handleExportCSV = () => {
        if (!list || list.length === 0) return;

        const exportColumns = getExportableColumns();
        const dateStr = getFilenameDate();

        const headers = exportColumns.map(col => col.title).join(",");

        const rows = list.map(item => {
            return exportColumns.map(col => {
                let val = getRawData(item, col);
                return `"${String(val).replace(/"/g, '""')}"`;
            }).join(",");
        });

        const csvContent = [headers, ...rows].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `${title.replace(/\s+/g, "_")}_${dateStr}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        if (!list || list.length === 0) return;

        const doc = new jsPDF();
        const exportColumns = getExportableColumns();
        const dateStr = getFormattedDate();
        const filenameDate = getFilenameDate();

        doc.setFontSize(16);
        doc.text(title, 14, 15);

        doc.setFontSize(10);
        doc.text(`Date: ${dateStr}`, 14, 22);

        const tableColumn = exportColumns.map(col => col.title);
        const tableRows = list.map(item => {
            return exportColumns.map(col => getRawData(item, col));
        });
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 26, // Started lower to make room for Title and Date
            theme: 'grid',
            styles: { fontSize: 8 },
            headStyles: { fillColor: [30, 41, 59] } // slate-800
        });

        doc.save(`${title.replace(/\s+/g, "_")}_${filenameDate}.pdf`);
    };

    return (
        <div className="w-full">
            <TableToolbar
                setPageConfig={setPageConfig}
                pageConfig={pageConfig}
                columns={columns}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
                title={title}
                filterOptions={filterOptions}
                activeFilters={activeFilters}
                setActiveFilters={setActiveFilters}
                onFilterClick={onFilterClick}
                handleExportPDF={handleExportPDF}
                handleExportCSV={handleExportCSV}
            />

            <div className="rounded-md border bg-white shadow-sm overflow-hidden">
                <div className="relative w-full overflow-auto thin-scrollbar" style={{ maxHeight: 'calc(100vh - 280px)' }}>
                    <table className="w-full caption-bottom text-sm text-left">
                        <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                            <tr className="border-b transition-colors">
                                {displayedColumns.map((col) => (
                                    <th
                                        key={col.key}
                                        className={cn(
                                            "h-12 px-4 text-left align-middle font-medium text-slate-500 whitespace-nowrap",
                                            col.thClass
                                        )}
                                    >
                                        {col.title}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="border-b">
                                        {displayedColumns.map((_, j) => (
                                            <td key={j} className="p-4">
                                                <div className="h-4 w-full bg-slate-100 animate-pulse rounded" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : list?.length > 0 ? (
                                list?.map((row, rowIndex) => (
                                    <tr
                                        key={row.id || rowIndex}
                                        className="border-b transition-colors hover:bg-slate-50/50"
                                    >
                                        {displayedColumns.map((col) => (
                                            <td
                                                key={`${row.id}-${col.key}`}
                                                className={cn("p-4 align-middle", col.tdClass)}
                                            >
                                                {renderCell(row, col)}
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={displayedColumns.length} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-500">
                                            <Database size={48} className="mb-4 text-slate-300" />
                                            <p>No results found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <TablePagination
                total={total}
                pageConfig={pageConfig}
                setPageConfig={setPageConfig}
            />
        </div>
    );
}