import React from "react";
import AdminCard from "@/components/admin/AdminCard";

export default function ProductsPage() {
    return (
        <div>
            <AdminCard title="Products Management" description="Manage your product catalog">
                <p className="text-gray-600">
                    Product management page - Coming soon with full CRUD functionality
                </p>
            </AdminCard>
        </div>
    );
}
