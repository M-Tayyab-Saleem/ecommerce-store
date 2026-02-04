"use client";

import React, { useState } from "react";
import {
    Store,
    Phone,
    CreditCard,
    Truck,
    Package,
    Save,
    Loader2,
    Info
} from "lucide-react";
import AdminCard from "@/components/admin/AdminCard";
import { useToast } from "@/components/Toast";

// Note: In a real app, these would be fetched from/saved to a settings API
// For now, we'll use local state with realistic defaults

interface StoreSettings {
    storeName: string;
    storeEmail: string;
    whatsappNumber: string;
    enableCOD: boolean;
    freeShippingThreshold: number;
    flatShippingRate: number;
    lowStockThreshold: number;
    autoDisableOutOfStock: boolean;
}

const defaultSettings: StoreSettings = {
    storeName: "Epoxy Sista",
    storeEmail: "epoxysista@gmail.com",
    whatsappNumber: "+923022828770",
    enableCOD: true,
    freeShippingThreshold: 3000,
    flatShippingRate: 200,
    lowStockThreshold: 5,
    autoDisableOutOfStock: true,
};

export default function SettingsPage() {
    const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
    const [isSaving, setIsSaving] = useState(false);
    const { showToast } = useToast();

    const handleChange = (key: keyof StoreSettings, value: string | number | boolean) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSaving(false);
        showToast("success", "Settings saved successfully");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-600">Configure your store preferences</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="btn-primary flex items-center gap-2"
                >
                    {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Save Changes
                </button>
            </div>

            {/* Info Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                    <p className="text-blue-800 font-medium">Settings Demo</p>
                    <p className="text-blue-600 text-sm mt-1">
                        This is a demonstration of the settings interface. In production, these settings would be persisted to a database and applied throughout the application.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Store Information */}
                <AdminCard
                    title="Store Information"
                    description="Basic store details and contact info"
                >
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Store size={16} />
                                Store Name
                            </label>
                            <input
                                type="text"
                                value={settings.storeName}
                                onChange={(e) => handleChange("storeName", e.target.value)}
                                className="input-field w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Store Email
                            </label>
                            <input
                                type="email"
                                value={settings.storeEmail}
                                onChange={(e) => handleChange("storeEmail", e.target.value)}
                                className="input-field w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Phone size={16} />
                                WhatsApp Number
                            </label>
                            <input
                                type="text"
                                value={settings.whatsappNumber}
                                onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                                className="input-field w-full"
                                placeholder="+92 300 1234567"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Customers will use this number for order inquiries
                            </p>
                        </div>
                    </div>
                </AdminCard>

                {/* Payment Settings */}
                <AdminCard
                    title="Payment Settings"
                    description="Configure payment options"
                >
                    <div className="space-y-4 mt-4">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <CreditCard className="text-blue-600" size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Cash on Delivery</p>
                                    <p className="text-sm text-gray-500">Allow customers to pay on delivery</p>
                                </div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.enableCOD}
                                    onChange={(e) => handleChange("enableCOD", e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </AdminCard>

                {/* Shipping Settings */}
                <AdminCard
                    title="Shipping Settings"
                    description="Configure shipping rates and thresholds"
                >
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Truck size={16} />
                                Free Shipping Threshold
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">PKR</span>
                                <input
                                    type="number"
                                    value={settings.freeShippingThreshold}
                                    onChange={(e) => handleChange("freeShippingThreshold", parseInt(e.target.value) || 0)}
                                    className="input-field w-full pl-12"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Orders above this amount qualify for free shipping
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Flat Shipping Rate
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">PKR</span>
                                <input
                                    type="number"
                                    value={settings.flatShippingRate}
                                    onChange={(e) => handleChange("flatShippingRate", parseInt(e.target.value) || 0)}
                                    className="input-field w-full pl-12"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Shipping fee for orders below the free shipping threshold
                            </p>
                        </div>
                    </div>
                </AdminCard>

                {/* Inventory Settings */}
                <AdminCard
                    title="Inventory Settings"
                    description="Stock management preferences"
                >
                    <div className="space-y-4 mt-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Package size={16} />
                                Low Stock Threshold
                            </label>
                            <input
                                type="number"
                                value={settings.lowStockThreshold}
                                onChange={(e) => handleChange("lowStockThreshold", parseInt(e.target.value) || 0)}
                                className="input-field w-full"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Products with stock at or below this level will be flagged as low stock
                            </p>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                            <div>
                                <p className="font-medium text-gray-900">Auto-disable Out of Stock</p>
                                <p className="text-sm text-gray-500">Automatically hide products when stock reaches 0</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.autoDisableOutOfStock}
                                    onChange={(e) => handleChange("autoDisableOutOfStock", e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    </div>
                </AdminCard>
            </div>
        </div>
    );
}
