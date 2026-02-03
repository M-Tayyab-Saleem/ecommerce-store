import React from "react";
import AdminCard from "@/components/admin/AdminCard";

export default function InventoryPage() {
    return (
        <div>
            <AdminCard title="Inventory & Stock" description="Monitor product stock levels">
                <p className="text-gray-600">
                    Inventory management page - Coming soon with low stock alerts and stock tracking
                </p>
            </AdminCard>
        </div>
    );
}
