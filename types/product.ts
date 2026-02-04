// Types for the e-commerce application

// Category Type
export interface ICategory {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Product Variant Type (Design-based)
// Each design has its own images, optional price override, and stock
export interface IVariant {
    designName: string;      // e.g., "Ocean Blue", "Sunset Glow"
    images: string[];        // Design-specific images
    price?: number;          // Optional price override (uses product.price if not set)
    stock: number;           // Per-design stock
}

// Product Type
export interface IProduct {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    category: ICategory | string;
    customizable: boolean;
    customizationNote?: string;
    variants: IVariant[];
    stock: number;
    lowStockThreshold: number;
    isActive: boolean;
    isDeleted: boolean;
    isBestSeller: boolean;
    isLatest: boolean;
    handmadeDisclaimer: string;
    createdAt: string;
    updatedAt: string;
}

// Order Status
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Payment Status
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

// Payment Method
export type PaymentMethod = 'cod' | 'card' | 'bank_transfer';

// Order Item Type
export interface IOrderItem {
    product: IProduct | string;
    name: string;
    price: number;
    quantity: number;
    customization?: string;
    variant?: string;
}

// Shipping Address Type
export interface IShippingAddress {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode?: string;
    country: string;
}

// Order Type
export interface IOrder {
    _id: string;
    user: string;
    orderId: string;
    items: IOrderItem[];
    subtotal: number;
    shippingFee: number;
    total: number;
    shippingAddress: IShippingAddress;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    notes?: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
    statusHistory: Array<{
        status: OrderStatus;
        timestamp: string;
        note?: string;
    }>;
    createdAt: string;
    updatedAt: string;
}

// User Type
export interface IUser {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'customer' | 'admin';
    addresses: IShippingAddress[];
    createdAt: string;
    updatedAt: string;
}

// API Response Type
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
    metadata?: {
        page?: number;
        limit?: number;
        total?: number;
        totalPages?: number;
    };
}

// Products Query Params
export interface ProductsQueryParams {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    isBestSeller?: boolean;
    isLatest?: boolean;
}
