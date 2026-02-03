import mongoose, { Document, Schema } from 'mongoose';

export interface IVariant {
    color: string;
    stock: number;
}

export interface IProduct extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    description: string;
    price: number;
    images: string[];
    category: mongoose.Types.ObjectId;
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
    createdAt: Date;
    updatedAt: Date;
}

const variantSchema = new Schema<IVariant>(
    {
        color: {
            type: String,
            required: true,
            trim: true,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
    },
    { _id: false }
);

const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, 'Product name is required'],
            trim: true,
            maxlength: [200, 'Product name cannot exceed 200 characters'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
            maxlength: [2000, 'Description cannot exceed 2000 characters'],
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        images: {
            type: [String],
            default: [],
            validate: {
                validator: function (v: string[]) {
                    return v.length <= 10;
                },
                message: 'Cannot have more than 10 images',
            },
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: [true, 'Category is required'],
        },
        customizable: {
            type: Boolean,
            default: false,
        },
        customizationNote: {
            type: String,
            maxlength: [500, 'Customization note cannot exceed 500 characters'],
        },
        variants: {
            type: [variantSchema],
            default: [],
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        lowStockThreshold: {
            type: Number,
            default: 5,
            min: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        isBestSeller: {
            type: Boolean,
            default: false,
            index: true,
        },
        isLatest: {
            type: Boolean,
            default: true, // New products are marked as latest by default
            index: true,
        },
        handmadeDisclaimer: {
            type: String,
            default:
                'This is a handmade product. Slight variations in color, size, and pattern are natural and add to its unique charm.',
        },
    },
    {
        timestamps: true,
    }
);

// Generate slug from name before saving
productSchema.pre('save', function () {
    if (this.isModified('name') || !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
});

// Indexes for faster queries
productSchema.index({ category: 1 });
productSchema.index({ isActive: 1, isDeleted: 1 });
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1 });

// Virtual for checking low stock
productSchema.virtual('isLowStock').get(function () {
    return this.stock <= this.lowStockThreshold;
});

const Product =
    mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
