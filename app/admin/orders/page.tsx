import React from "react";
import AdminCard from "@/components/admin/AdminCard";

export default function OrdersPage() {
    return (
        <div>
            <AdminCard title="Orders Management" description="View and manage customer orders">
                <p className="text-gray-600">
                    Orders management page - Coming soon with filtering, status updates, and order details
                </p>
            </AdminCard>
        </div>
    );
}
