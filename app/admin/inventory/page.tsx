"use client";

import React, { useState } from "react";
import {
    Search,
    Package,
    AlertTriangle,
    XCircle,
    CheckCircle,
    TrendingDown,
    Edit
} from "lucide-react";
import Image from "next/image";
import AdminCard from "@/components/admin/AdminCard";
import AdminTable from "@/components/admin/AdminTable";
import Pagination from "@/components/admin/Pagination";
import { useAdminProducts } from "@/lib/api/admin/products";

const DEFAULT_LOW_STOCK_THRESHOLD = 5;

type StockFilter = "all" | "low" | "out" | "healthy";

export default function InventoryPage() {
    // State
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [stockFilter, setStockFilter] = useState<StockFilter>("all");

    // Fetch all products for inventory view
    const { data, isLoading } = useAdminProducts({
        page,
        limit: 20,
        search: search || undefined,
        isActive: "all", // Show all products including inactive
    });

    // Filter products based on stock status
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filteredProducts = (data?.products || []).filter((product: any) => {
        const threshold = product.lowStockThreshold || DEFAULT_LOW_STOCK_THRESHOLD;
        switch (stockFilter) {
            case "low":
                return product.stock > 0 && product.stock <= threshold;
            case "out":
                return product.stock === 0;
            case "healthy":
                return product.stock > threshold;
            default:
                return true;
        }
    });

    // Calculate stats
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allProducts: any[] = data?.products || [];
    const lowStockCount = allProducts.filter((p) => p.stock > 0 && p.stock <= (p.lowStockThreshold || DEFAULT_LOW_STOCK_THRESHOLD)).length;
    const outOfStockCount = allProducts.filter((p) => p.stock === 0).length;
    const healthyCount = allProducts.filter((p) => p.stock > (p.lowStockThreshold || DEFAULT_LOW_STOCK_THRESHOLD)).length;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getStockStatus = (product: any) => {
        const threshold = product.lowStockThreshold || DEFAULT_LOW_STOCK_THRESHOLD;
        if (product.stock === 0) {
            return { label: "Out of Stock", color: "bg-red-100 text-red-700", icon: <XCircle size={14} /> };
        }
        if (product.stock <= threshold) {
            return { label: "Low Stock", color: "bg-yellow-100 text-yellow-700", icon: <AlertTriangle size={14} /> };
        }
        return { label: "In Stock", color: "bg-green-100 text-green-700", icon: <CheckCircle size={14} /> };
    };

    const getStockBarColor = (stock: number, threshold: number) => {
        if (stock === 0) return "bg-red-500";
        if (stock <= threshold) return "bg-yellow-500";
        return "bg-green-500";
    };

    const getStockBarWidth = (stock: number) => {
        const maxStock = 100; // Assume 100 as max for visual representation
        return Math.min((stock / maxStock) * 100, 100);
    };

    const formatCurrency = (amount: number) => {
        return `PKR ${amount.toLocaleString()}`;
    };

    // Columns Configuration  
    const columns = [
        {
            key: "product",
            header: "Product",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (product: any) => (
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
                        {product.images?.[0] ? (
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package size={20} />
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{product.name}</p>
                        {product.category && (
                            <p className="text-xs text-gray-500">{product.category.name}</p>
                        )}
                    </div>
                </div>
            ),
        },
        {
            key: "price",
            header: "Price",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (product: any) => (
                <span className="font-medium text-gray-900">{formatCurrency(product.price)}</span>
            ),
        },
        {
            key: "stock",
            header: "Stock Level",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (product: any) => {
                const threshold = product.lowStockThreshold || DEFAULT_LOW_STOCK_THRESHOLD;
                return (
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-gray-900">{product.stock}</span>
                            <span className="text-gray-500">/ {threshold} min</span>
                        </div>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all ${getStockBarColor(product.stock, threshold)}`}
                                style={{ width: `${getStockBarWidth(product.stock)}%` }}
                            />
                        </div>
                    </div>
                );
            },
        },
        {
            key: "status",
            header: "Status",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (product: any) => {
                const stockStatus = getStockStatus(product);
                return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
                        {stockStatus.icon}
                        {stockStatus.label}
                    </span>
                );
            },
        },
        {
            key: "actions",
            header: "Actions",
            align: "right" as const,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            render: (product: any) => (
                <a
                    href={`/admin/products?edit=${product._id}`}
                    className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors inline-flex"
                    title="Edit Product"
                >
                    <Edit size={18} />
                </a>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
                    <p className="text-gray-600">Monitor and manage product stock levels</p>
                </div>
            </div>

            {/* Quick Stats - Clickable Filters */}
            <div className="grid grid-cols-4 gap-4">
                <button
                    onClick={() => { setStockFilter("all"); setPage(1); }}
                    className={`rounded-lg p-4 border transition-colors text-left ${stockFilter === "all" ? "bg-gray-100 border-gray-400" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <Package size={18} className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">All Products</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{allProducts.length}</p>
                </button>

                <button
                    onClick={() => { setStockFilter("healthy"); setPage(1); }}
                    className={`rounded-lg p-4 border transition-colors text-left ${stockFilter === "healthy" ? "bg-green-100 border-green-400" : "bg-green-50 border-green-200 hover:bg-green-100"
                        }`}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle size={18} className="text-green-600" />
                        <span className="text-sm font-medium text-green-700">Healthy Stock</span>
                    </div>
                    <p className="text-2xl font-bold text-green-800">{healthyCount}</p>
                </button>

                <button
                    onClick={() => { setStockFilter("low"); setPage(1); }}
                    className={`rounded-lg p-4 border transition-colors text-left ${stockFilter === "low" ? "bg-yellow-100 border-yellow-400" : "bg-yellow-50 border-yellow-200 hover:bg-yellow-100"
                        }`}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingDown size={18} className="text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-700">Low Stock</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-800">{lowStockCount}</p>
                </button>

                <button
                    onClick={() => { setStockFilter("out"); setPage(1); }}
                    className={`rounded-lg p-4 border transition-colors text-left ${stockFilter === "out" ? "bg-red-100 border-red-400" : "bg-red-50 border-red-200 hover:bg-red-100"
                        }`}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <XCircle size={18} className="text-red-600" />
                        <span className="text-sm font-medium text-red-700">Out of Stock</span>
                    </div>
                    <p className="text-2xl font-bold text-red-800">{outOfStockCount}</p>
                </button>
            </div>

            {/* Low Stock Alert Banner */}
            {lowStockCount > 0 && stockFilter === "all" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                    <AlertTriangle className="text-yellow-600 flex-shrink-0" size={24} />
                    <div>
                        <p className="font-medium text-yellow-800">
                            {lowStockCount} {lowStockCount === 1 ? "product is" : "products are"} running low on stock
                        </p>
                        <p className="text-sm text-yellow-600">
                            Consider restocking to avoid running out
                        </p>
                    </div>
                    <button
                        onClick={() => { setStockFilter("low"); setPage(1); }}
                        className="ml-auto px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                    >
                        View Low Stock
                    </button>
                </div>
            )}

            {/* Out of Stock Alert Banner */}
            {outOfStockCount > 0 && stockFilter === "all" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                    <XCircle className="text-red-600 flex-shrink-0" size={24} />
                    <div>
                        <p className="font-medium text-red-800">
                            {outOfStockCount} {outOfStockCount === 1 ? "product is" : "products are"} out of stock
                        </p>
                        <p className="text-sm text-red-600">
                            These products are unavailable for purchase
                        </p>
                    </div>
                    <button
                        onClick={() => { setStockFilter("out"); setPage(1); }}
                        className="ml-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                        View Out of Stock
                    </button>
                </div>
            )}

            <AdminCard>
                {/* Search */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="pl-10 input-field w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <AdminTable
                    columns={columns}
                    data={filteredProducts}
                    loading={isLoading}
                    emptyMessage={
                        stockFilter === "low"
                            ? "No products with low stock. Great job keeping inventory healthy!"
                            : stockFilter === "out"
                                ? "No products are out of stock. All products are available!"
                                : "No products found."
                    }
                />

                {/* Pagination */}
                {data && data.pagination.totalPages > 1 && (
                    <div className="mt-6 border-t border-gray-100 pt-4">
                        <Pagination
                            currentPage={page}
                            totalPages={data.pagination.totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </AdminCard>
        </div>
    );
}
