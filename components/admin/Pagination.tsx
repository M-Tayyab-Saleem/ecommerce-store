import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className = "",
}: PaginationProps) {
    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className={`flex items-center justify-between ${className}`}>
            <div className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!canGoPrevious}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft size={16} />
                    Previous
                </button>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!canGoNext}
                    className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}
