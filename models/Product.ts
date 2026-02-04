import mongoose, { Document, Schema } from 'mongoose';
import './Category'; // Ensure Category model is registered

// Design-based variant structure
// Each design has its own images, optional price, and stock
export interface IVariant {
    designName: string;      // e.g., "Ocean Blue", "Sunset Glow"
    images: string[];        // Design-specific images
    price?: number;          // Optional price override (uses product.price if not set)
    stock: number;           // Per-design stock
}

export interface IProduct extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
    description: string;
    price: number;           // Base price (fallback if variant has no price)
    images: string[];        // Base images (fallback if no variants)
    category: mongoose.Types.ObjectId;
    customizable: boolean;
    customizationNote?: string;
    variants: IVariant[];
    stock: number;           // Base stock (used when no variants exist)
    lowStockThreshold: number;
    isActive: boolean;
    isDeleted: boolean;
    isBestSeller: boolean;
    isLatest: boolean;
    handmadeDisclaimer: string;
    createdAt: Date;
    updatedAt: Date;
    // Virtuals
    totalStock: number;
    isLowStock: boolean;
}

// Design-based variant schema
const variantSchema = new Schema<IVariant>(
    {
        designName: {
            type: String,
            required: true,
            trim: true,
        },
        images: {
            type: [String],
            default: [],
            validate: {
                validator: function (v: string[]) {
                    return v.length <= 10;
                },
                message: 'Cannot have more than 10 images per design',
            },
        },
        price: {
            type: Number,
            min: 0,
            // Optional - if not set, uses product.price
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

// Virtual for total stock across all variants
// Falls back to base stock if no variants exist
productSchema.virtual('totalStock').get(function () {
    if (this.variants && this.variants.length > 0) {
        return this.variants.reduce((sum, variant) => sum + variant.stock, 0);
    }
    return this.stock;
});

// Virtual for checking low stock (uses totalStock)
productSchema.virtual('isLowStock').get(function () {
    const total = this.variants && this.variants.length > 0
        ? this.variants.reduce((sum, variant) => sum + variant.stock, 0)
        : this.stock;
    return total <= this.lowStockThreshold;
});

// Ensure virtuals are included in JSON output
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product =
    mongoose.models.Product || mongoose.model<IProduct>('Product', productSchema);

export default Product;
