"use client";

import React, { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, Package } from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import Pagination from "@/components/admin/Pagination";
import { useAdminProducts, useDeleteProduct } from "@/lib/api/admin/products";
import { useQuery } from "@tanstack/react-query";
import adminClient from "@/lib/api/admin/axios-instance";
import Image from "next/image";
import { useToast } from "@/components/Toast";
import ConfirmModal from "@/components/ConfirmModal";
import Link from "next/link";
import { IProduct } from "@/models/Product";
import ProductModal from "@/components/admin/ProductModal";

export default function ProductsPage() {
    // State
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [stockStatus, setStockStatus] = useState("all");
    const [isActive, setIsActive] = useState("all");
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

    const { showToast } = useToast();
    const deleteMutation = useDeleteProduct();

    // Fetch Categories for filter
    const { data: categories } = useQuery({
        queryKey: ["categories"],
        queryFn: async () => {
            const { data } = await adminClient.get("/categories"); // Assuming this endpoint exists and allows fetching
            return data.data; // Adjust based on actual response
        },
    });

    // Fetch Products
    const { data, isLoading } = useAdminProducts({
        page,
        limit: 10,
        search: search || undefined,
        category: category || undefined,
        stockStatus: stockStatus === "all" ? undefined : stockStatus,
        isActive: isActive === "all" ? undefined : isActive, // Map "all" to undefined (show all via includeInactive=true equivalent)
    });

    // Handle Delete
    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteMutation.mutateAsync(deleteId);
            showToast("success", "Product deleted successfully");
            setDeleteId(null);
        } catch (error) {
            console.error(error);
            showToast("error", "Failed to delete product");
        }
    };

    const handleEdit = (product: IProduct) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
    };

    // Columns Configuration
    const columns = [
        {
            key: "image",
            header: "Product",
            render: (product: IProduct) => (
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
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
                        {/* Need to ensure category is populated or handled if ID */}
                        <p className="text-xs text-gray-500">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {(product.category as any)?.name || "Uncategorized"}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "price",
            header: "Price",
            render: (product: IProduct) => (
                <span className="font-medium">
                    PKR {product.price.toLocaleString()}
                </span>
            ),
            sortable: true,
        },
        {
            key: "stock",
            header: "Stock",
            render: (product: IProduct) => (
                <div>
                    {product.stock <= (product.lowStockThreshold || 5) && product.stock > 0 && (
                        <span className="text-xs text-yellow-600 font-medium block">Low Stock</span>
                    )}
                    {product.stock === 0 ? (
                        <span className="text-xs text-red-600 font-medium block">Out of Stock</span>
                    ) : (
                        <span className="text-sm text-gray-700">{product.stock} units</span>
                    )}
                </div>
            ),
            sortable: true,
        },
        {
            key: "status",
            header: "Status",
            render: (product: IProduct) => (
                <StatusBadge
                    status={product.isActive ? "Active" : "Inactive"}
                    type="active"
                />
            ),
        },
        {
            key: "actions",
            header: "Actions",
            align: "right" as const,
            render: (product: IProduct) => (
                <div className="flex items-center justify-end gap-2">
                    <Link
                        href={`/products/${product.slug}`}
                        target="_blank"
                        className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Live"
                    >
                        <Eye size={18} />
                    </Link>
                    <button
                        onClick={() => handleEdit(product)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => setDeleteId(product._id.toString())}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                    <p className="text-gray-600">Manage your product catalog</p>
                </div>
                <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
                    <Plus size={20} />
                    Add Product
                </button>
            </div>

            <AdminCard className="overflow-visible">
                {/* Filters */}
                <div className="flex flex-col lg:flex-row gap-4 mb-6">
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
                    <div className="flex flex-wrap gap-3">
                        <select
                            className="input-field min-w-[140px]"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {// eslint-disable-next-line @typescript-eslint/no-explicit-any
                                categories?.map((cat: any) => (
                                    <option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </option>
                                ))}
                        </select>
                        <select
                            className="input-field min-w-[140px]"
                            value={stockStatus}
                            onChange={(e) => setStockStatus(e.target.value)}
                        >
                            <option value="all">Stock Status</option>
                            <option value="in_stock">In Stock</option>
                            <option value="low_stock">Low Stock</option>
                            <option value="out_of_stock">Out of Stock</option>
                        </select>
                        <select
                            className="input-field min-w-[120px]"
                            value={isActive}
                            onChange={(e) => setIsActive(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <AdminTable
                    columns={columns}
                    data={data?.products || []}
                    loading={isLoading}
                    emptyMessage="No products found matching your filters."
                />

                {/* Pagination */}
                {data && (
                    <div className="mt-6 border-t border-gray-100 pt-4">
                        <Pagination
                            currentPage={page}
                            totalPages={data.pagination.totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </AdminCard>

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={!!deleteId}
                title="Delete Product"
                message="Are you sure you want to delete this product? This action cannot be undone."
                variant="danger"
                confirmText="Delete"
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />

            {/* Product Modal */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                categories={categories || []}
            />
        </div>
    );
}
