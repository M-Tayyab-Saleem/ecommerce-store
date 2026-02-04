"use client";

import React, { useState } from "react";
import {
    Search,
    User as UserIcon,
    Phone,
    Mail,
    ShieldCheck,
    Loader2,
    Calendar,
    ShoppingBag
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import AdminTable from "@/components/admin/AdminTable";
import Pagination from "@/components/admin/Pagination";
import { useAdminUsers, useUpdateUserRole } from "@/lib/api/admin/users";
import { useToast } from "@/components/Toast";
import { IUser } from "@/models/User";

export default function UsersPage() {
    // State
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");

    const { showToast } = useToast();
    const updateRoleMutation = useUpdateUserRole();

    // Fetch Users
    const { data, isLoading } = useAdminUsers({
        page,
        limit: 10,
        search: search || undefined,
        role: roleFilter !== "all" ? roleFilter : undefined,
    });

    const handleRoleToggle = async (user: IUser) => {
        const newRole = user.role === "admin" ? "user" : "admin";
        try {
            await updateRoleMutation.mutateAsync({
                userId: user._id.toString(),
                role: newRole,
            });
            showToast("success", `User role updated to ${newRole}`);
        } catch (error) {
            console.error(error);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const message = (error as any)?.response?.data?.message || "Failed to update user role";
            showToast("error", message);
        }
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString("en-PK", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Columns Configuration
    const columns = [
        {
            key: "user",
            header: "User",
            render: (user: IUser) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <span className="text-primary font-semibold text-lg">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar size={12} />
                            Joined {formatDate(user.createdAt)}
                        </p>
                    </div>
                </div>
            ),
        },
        {
            key: "email",
            header: "Contact",
            render: (user: IUser) => (
                <div className="space-y-1">
                    <p className="text-sm text-gray-700 flex items-center gap-1.5">
                        <Mail size={14} className="text-gray-400" />
                        {user.email}
                    </p>
                    <p className="text-sm text-gray-700 flex items-center gap-1.5">
                        <Phone size={14} className="text-gray-400" />
                        {user.phone}
                    </p>
                </div>
            ),
        },
        {
            key: "role",
            header: "Role",
            render: (user: IUser) => (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700"
                    }`}>
                    {user.role === "admin" && <ShieldCheck size={14} />}
                    {user.role === "admin" ? "Admin" : "Customer"}
                </span>
            ),
        },
        {
            key: "actions",
            header: "Role Toggle",
            align: "right" as const,
            render: (user: IUser) => (
                <button
                    onClick={() => handleRoleToggle(user)}
                    disabled={updateRoleMutation.isPending}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${user.role === "admin"
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-purple-100 text-purple-700 hover:bg-purple-200"
                        } disabled:opacity-50`}
                >
                    {updateRoleMutation.isPending ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <ShieldCheck size={14} />
                    )}
                    {user.role === "admin" ? "Revoke Admin" : "Make Admin"}
                </button>
            ),
        },
    ];

    // Stats counts
    const adminCount = data?.users.filter((u) => u.role === "admin").length || 0;
    const customerCount = data?.users.filter((u) => u.role === "user").length || 0;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                    <p className="text-gray-600">Manage platform users and roles</p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                        <UserIcon size={18} className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Total Users</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{data?.pagination.total || 0}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck size={18} className="text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">Admins</span>
                    </div>
                    <p className="text-2xl font-bold text-purple-800">{adminCount}</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                        <ShoppingBag size={18} className="text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Customers</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-800">{customerCount}</p>
                </div>
            </div>

            <AdminCard>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            className="pl-10 input-field w-full"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <select
                        className="input-field min-w-[130px]"
                        value={roleFilter}
                        onChange={(e) => {
                            setRoleFilter(e.target.value);
                            setPage(1);
                        }}
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admins</option>
                        <option value="user">Customers</option>
                    </select>
                </div>

                {/* Table */}
                <AdminTable
                    columns={columns}
                    data={data?.users || []}
                    loading={isLoading}
                    emptyMessage="No users found matching your filters."
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
