"use client";

import React, { useState } from "react";
import { Plus, Search, Edit, Trash2, FolderTree, Image as ImageIcon } from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminTable from "@/components/admin/AdminTable";
import StatusBadge from "@/components/admin/StatusBadge";
import { useAdminCategories, useDeleteCategory } from "@/lib/api/admin/categories";
import { useQuery } from "@tanstack/react-query";
import adminClient from "@/lib/api/admin/axios-instance";
import Image from "next/image";
import { useToast } from "@/components/admin/Toast";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { ICategory } from "@/models/Category";
import CategoryModal from "@/components/admin/CategoryModal";

// Extended category with product count
interface CategoryWithCount extends ICategory {
    productCount?: number;
}

export default function CategoriesPage() {
    // State
    const [search, setSearch] = useState("");
    const [showInactive, setShowInactive] = useState(true);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);

    const { showToast } = useToast();
    const deleteMutation = useDeleteCategory();

    // Fetch Categories with includeInactive for admins
    const { data: categories, isLoading } = useAdminCategories({
        includeInactive: showInactive,
    });

    // Fetch product counts per category
    const { data: productCounts } = useQuery({
        queryKey: ["admin", "category-product-counts"],
        queryFn: async () => {
            // Get all products and count by category
            const { data } = await adminClient.get("/products?limit=1000");
            const products = data.data || [];
            const counts: Record<string, number> = {};

            products.forEach((product: { category?: { _id?: string } | string }) => {
                const catId = typeof product.category === "object"
                    ? product.category?._id?.toString()
                    : product.category?.toString();
                if (catId) {
                    counts[catId] = (counts[catId] || 0) + 1;
                }
            });

            return counts;
        },
    });

    // Filter categories by search
    const filteredCategories = (categories || []).filter((cat) =>
        cat.name.toLowerCase().includes(search.toLowerCase()) ||
        cat.slug?.toLowerCase().includes(search.toLowerCase())
    );

    // Handle Delete
    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            await deleteMutation.mutateAsync(deleteId);
            showToast("success", "Category deleted successfully");
            setDeleteId(null);
        } catch (error) {
            console.error(error);
            showToast("error", "Failed to delete category. Make sure no products are using it.");
        }
    };

    const handleEdit = (category: ICategory) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedCategory(null);
        setIsModalOpen(true);
    };

    // Columns Configuration
    const columns = [
        {
            key: "image",
            header: "Category",
            render: (category: CategoryWithCount) => (
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                        {category.image ? (
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FolderTree size={20} />
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{category.name}</p>
                        <p className="text-xs text-gray-500 font-mono">/{category.slug}</p>
                    </div>
                </div>
            ),
        },
        {
            key: "description",
            header: "Description",
            render: (category: CategoryWithCount) => (
                <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">
                    {category.description || <span className="text-gray-400 italic">No description</span>}
                </p>
            ),
        },
        {
            key: "productCount",
            header: "Products",
            render: (category: CategoryWithCount) => {
                const count = productCounts?.[category._id.toString()] || 0;
                return (
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${count > 0 ? "text-gray-900" : "text-gray-400"}`}>
                            {count}
                        </span>
                        <span className="text-xs text-gray-500">products</span>
                    </div>
                );
            },
            sortable: true,
        },
        {
            key: "status",
            header: "Status",
            render: (category: CategoryWithCount) => (
                <StatusBadge
                    status={category.isActive ? "Active" : "Inactive"}
                    type="active"
                />
            ),
        },
        {
            key: "actions",
            header: "Actions",
            align: "right" as const,
            render: (category: CategoryWithCount) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => setDeleteId(category._id.toString())}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                        disabled={(productCounts?.[category._id.toString()] || 0) > 0}
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
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-gray-600">Manage product categories</p>
                </div>
                <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
                    <Plus size={20} />
                    Add Category
                </button>
            </div>

            <AdminCard className="overflow-visible">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="pl-10 input-field w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showInactive}
                            onChange={(e) => setShowInactive(e.target.checked)}
                            className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                        />
                        <span className="text-sm text-gray-600">Show inactive</span>
                    </label>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p className="text-2xl font-bold text-gray-900">{categories?.length || 0}</p>
                        <p className="text-sm text-gray-500">Total Categories</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <p className="text-2xl font-bold text-green-700">
                            {categories?.filter((c) => c.isActive).length || 0}
                        </p>
                        <p className="text-sm text-green-600">Active</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <p className="text-2xl font-bold text-yellow-700">
                            {categories?.filter((c) => !c.isActive).length || 0}
                        </p>
                        <p className="text-sm text-yellow-600">Inactive</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-2xl font-bold text-blue-700">
                            {categories?.filter((c) =>
                                productCounts?.[c._id.toString()] === 0 ||
                                productCounts?.[c._id.toString()] === undefined
                            ).length || 0}
                        </p>
                        <p className="text-sm text-blue-600">Empty Categories</p>
                    </div>
                </div>

                {/* Table */}
                <AdminTable
                    columns={columns}
                    data={filteredCategories}
                    loading={isLoading}
                    emptyMessage="No categories found. Create your first category to get started."
                />
            </AdminCard>

            {/* Delete Confirmation */}
            <ConfirmModal
                isOpen={!!deleteId}
                title="Delete Category"
                message="Are you sure you want to delete this category? Products using this category will become uncategorized."
                variant="danger"
                confirmText="Delete"
                onConfirm={handleDelete}
                onCancel={() => setDeleteId(null)}
            />

            {/* Category Modal */}
            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                category={selectedCategory}
            />
        </div>
    );
}
