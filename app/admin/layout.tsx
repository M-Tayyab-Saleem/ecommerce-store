"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    FolderTree,
    ShoppingCart,
    CreditCard,
    Users,
    BarChart3,
    Settings,
    Menu,
    X,
    LogOut,
    ChevronRight,
    Warehouse,
    ExternalLink,
} from "lucide-react";
import { ToastProvider } from "@/components/Toast";

interface NavLink {
    name: string;
    href: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}

const navLinks: NavLink[] = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Inventory", href: "/admin/inventory", icon: Warehouse },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface SidebarProps {
    mobile?: boolean;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    pathname: string;
    handleLogout: () => Promise<void>;
}

const Sidebar = ({
    mobile = false,
    sidebarOpen,
    setSidebarOpen,
    pathname,
    handleLogout,
}: SidebarProps) => {
    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <aside
            className={`${mobile
                ? "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden"
                : "hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200"
                } ${mobile && !sidebarOpen ? "-translate-x-full" : "translate-x-0"}`}
        >
            <div className="flex flex-col h-full">
                {/* Logo/Brand */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
                    <Link
                        href="/admin"
                        className="text-xl font-bold text-primary"
                        onClick={() => mobile && setSidebarOpen(false)}
                    >
                        EpoxySista Admin
                    </Link>
                    {mobile && (
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 text-gray-500 hover:text-gray-700 lg:hidden"
                        >
                            <X size={24} />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-6 overflow-y-auto">
                    <ul className="space-y-1">
                        {navLinks.map((link) => {
                            const Icon = link.icon;
                            const active = isActive(link.href);
                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        onClick={() => mobile && setSidebarOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${active
                                            ? "bg-primary/10 text-primary"
                                            : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        <Icon size={20} />
                                        <span>{link.name}</span>
                                        {active && <ChevronRight size={16} className="ml-auto" />}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* View Website Link */}
                <div className="px-4 pb-2">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium border border-gray-200"
                    >
                        <ExternalLink size={20} />
                        <span>View Website</span>
                    </Link>
                </div>

                {/* Admin Profile & Logout */}
                <div className="p-4 border-t border-gray-200">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Call logout API
            await fetch("/api/auth/logout", { method: "POST" });
            // Redirect to home
            router.push("/");
        } catch (error) {
            console.error("Logout failed:", error);
            // Still redirect even if API fails
            router.push("/");
        }
    };

    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };



    return (
        <ToastProvider>
            <div className="min-h-screen bg-gray-50">
                {/* Desktop Sidebar */}
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    pathname={pathname}
                    handleLogout={handleLogout}
                />

                {/* Mobile Sidebar */}
                <Sidebar
                    mobile
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    pathname={pathname}
                    handleLogout={handleLogout}
                />

                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Main Content */}
                <div className="lg:pl-64">
                    {/* Mobile Menu Toggle */}
                    <div className="lg:hidden p-4 pb-0">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="p-2 text-gray-500 hover:text-gray-700 bg-white rounded-md shadow-sm border border-gray-200"
                        >
                            <Menu size={24} />
                        </button>
                    </div>

                    {/* Page Content */}
                    <main className="p-4 sm:p-6 lg:p-8">{children}</main>
                </div>
            </div>
        </ToastProvider>
    );
}
