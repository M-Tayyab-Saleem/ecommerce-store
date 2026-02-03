import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    selectedVariant?: string;
    customText?: string;
    price: number;
}

export interface IShippingAddress {
    name: string;
    phone: string;
    address: string;
    city: string;
    postalCode?: string;
}

export type PaymentMethod = 'COD' | 'BANK_TRANSFER' | 'JAZZCASH' | 'EASYPAISA';
export type PaymentStatus = 'pending' | 'paid' | 'failed';
export type OrderStatus =
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';

export interface IOrder extends Document {
    _id: mongoose.Types.ObjectId;
    orderId: string;
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    shippingAddress: IShippingAddress;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    orderStatus: OrderStatus;
    totalAmount: number;
    shippingFee: number;
    notes?: string;
    handmadeDisclaimer: boolean;
    statusHistory: Array<{
        status: OrderStatus;
        timestamp: Date;
        note?: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
    {
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        selectedVariant: {
            type: String,
        },
        customText: {
            type: String,
            maxlength: [200, 'Custom text cannot exceed 200 characters'],
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
    },
    { _id: false }
);

const shippingAddressSchema = new Schema<IShippingAddress>(
    {
        name: {
            type: String,
            required: [true, 'Recipient name is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            trim: true,
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
            trim: true,
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true,
        },
        postalCode: {
            type: String,
            trim: true,
        },
    },
    { _id: false }
);

const orderSchema = new Schema<IOrder>(
    {
        orderId: {
            type: String,
            required: true,
            unique: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: function (v: IOrderItem[]) {
                    return v.length > 0;
                },
                message: 'Order must have at least one item',
            },
        },
        shippingAddress: {
            type: shippingAddressSchema,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ['COD', 'BANK_TRANSFER', 'JAZZCASH', 'EASYPAISA'],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        orderStatus: {
            type: String,
            enum: [
                'pending',
                'confirmed',
                'processing',
                'shipped',
                'delivered',
                'cancelled',
            ],
            default: 'pending',
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        shippingFee: {
            type: Number,
            default: 0,
            min: 0,
        },
        notes: {
            type: String,
            maxlength: [500, 'Notes cannot exceed 500 characters'],
        },
        handmadeDisclaimer: {
            type: Boolean,
            default: true,
        },
        statusHistory: [
            {
                status: {
                    type: String,
                    enum: [
                        'pending',
                        'confirmed',
                        'processing',
                        'shipped',
                        'delivered',
                        'cancelled',
                    ],
                },
                timestamp: {
                    type: Date,
                    default: Date.now,
                },
                note: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

// Add initial status to history when order is created
orderSchema.pre('save', function () {
    if (this.isNew) {
        this.statusHistory = [
            {
                status: 'pending',
                timestamp: new Date(),
                note: 'Order placed',
            },
        ];
    }
});

// Indexes
// orderSchema.index({ orderId: 1 }); // Removed (covered by unique: true)
orderSchema.index({ user: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });

const Order =
    mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema);

export default Order;
