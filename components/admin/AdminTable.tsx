/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import LoadingSkeleton from "./LoadingSkeleton";

interface Column<T> {
    key: string;
    header: string;
    render?: (item: T) => React.ReactNode;
    sortable?: boolean;
    align?: "left" | "center" | "right";
    className?: string;
}

interface AdminTableProps<T> {
    columns: Column<T>[];
    data: T[];
    keyField?: string;
    loading?: boolean;
    emptyMessage?: string;
    onRowClick?: (item: T) => void;
    className?: string;
}

export default function AdminTable<T>({
    columns,
    data,
    keyField = "_id",
    loading = false,
    emptyMessage = "No data found",
    onRowClick,
    className = "",
}: AdminTableProps<T>) {
    const [sortConfig, setSortConfig] = useState<{
        key: string;
        direction: "asc" | "desc";
    } | null>(null);

    const handleSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedData = React.useMemo(() => {
        if (!sortConfig) return data;
        return [...data].sort((a, b) => {
            const aValue = (a as any)[sortConfig.key];
            const bValue = (b as any)[sortConfig.key];

            if (aValue < bValue) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    }, [data, sortConfig]);

    if (loading) {
        return <LoadingSkeleton type="table" rows={5} />;
    }

    if (!data || data.length === 0) {
        return (
            <div className={`p-8 text-center text-gray-500 bg-white rounded-lg border border-gray-200 ${className}`}>
                {emptyMessage}
            </div>
        );
    }

    return (
        <div className={`overflow-x-auto rounded-lg border border-gray-200 bg-white ${className}`}>
            <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-xs uppercase text-gray-700 font-semibold border-b border-gray-200">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                scope="col"
                                className={`px-6 py-3 cursor-pointer select-none whitespace-nowrap ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                                    } ${col.sortable ? "hover:bg-gray-100 transition-colors" : ""}`}
                                onClick={() => col.sortable && handleSort(col.key)}
                            >
                                <div
                                    className={`flex items-center gap-1 ${col.align === "right" ? "justify-end" : col.align === "center" ? "justify-center" : "justify-start"
                                        }`}
                                >
                                    {col.header}
                                    {col.sortable && (
                                        <span className="text-gray-400">
                                            {sortConfig?.key === col.key ? (
                                                sortConfig.direction === "asc" ? (
                                                    <ChevronUp size={14} className="text-primary" />
                                                ) : (
                                                    <ChevronDown size={14} className="text-primary" />
                                                )
                                            ) : (
                                                <ChevronsUpDown size={14} />
                                            )}
                                        </span>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {sortedData.map((item, index) => (
                        <tr
                            key={((item as any)[keyField] as string) || index}
                            className={`hover:bg-gray-50 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                            onClick={() => onRowClick && onRowClick(item)}
                        >
                            {columns.map((col) => (
                                <td
                                    key={`${(item as any)[keyField]}-${col.key}`}
                                    className={`px-6 py-4 whitespace-nowrap ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                                        } ${col.className || ""}`}
                                >
                                    {col.render ? col.render(item) : ((item as any)[col.key] as React.ReactNode)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
