import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import Category from '@/models/Category';
import mongoose from 'mongoose';

export interface GetProductsOptions {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    includeInactive?: boolean;
    isActive?: boolean;
    lowStockOnly?: boolean;
    isBestSeller?: boolean;
    isLatest?: boolean;
}

export async function getProducts(options: GetProductsOptions = {}) {
    await dbConnect();
    // Ensure Category model is registered
    void Category;

    const {
        page = 1,
        limit = 12,
        category,
        search,
        minPrice,
        maxPrice,
        sort = 'createdAt',
        order = 'desc',
        includeInactive = false,
        isActive,
        lowStockOnly = false,
        isBestSeller,
        isLatest,
    } = options;

    // Build query
    const query: Record<string, unknown> = {
        isDeleted: false,
    };

    // Active Status Logic
    if (typeof isActive === 'boolean') {
        query.isActive = isActive;
    } else if (!includeInactive) {
        query.isActive = true;
    }

    // Category filter
    if (category) {
        if (mongoose.Types.ObjectId.isValid(category)) {
            query.category = new mongoose.Types.ObjectId(category);
        } else {
            // Try to find category by slug
            const categoryDoc = await Category.findOne({ slug: category, isActive: true });
            if (categoryDoc) {
                query.category = categoryDoc._id;
            } else {
                // If category slug provided but not found, ensure no results returned (or handle as error?)
                // Returning empty results is safer than showing all products
                return {
                    products: [],
                    metadata: {
                        page,
                        limit,
                        total: 0,
                        totalPages: 0,
                    }
                };
            }
        }
    }

    // Search filter
    if (search) {
        query.$text = { $search: search };
    }

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
        query.price = {};
        if (minPrice !== undefined) (query.price as Record<string, number>).$gte = minPrice;
        if (maxPrice !== undefined) (query.price as Record<string, number>).$lte = maxPrice;
    }

    // Low stock filter
    if (lowStockOnly) {
        query.$expr = { $lte: ['$stock', '$lowStockThreshold'] };
    }

    // Best seller filter
    if (isBestSeller) {
        query.isBestSeller = true;
    }

    // Latest products filter
    if (isLatest) {
        query.isLatest = true;
    }

    // Sorting
    const sortOptions: Record<string, 1 | -1> = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;

    // Pagination
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    const products = await Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(); // Use lean() for better performance when just reading

    // Transform _id to string for serialization if needed (though Mongoose usually handles this in JSON.stringify)
    // transforming lean documents to replace _id with string if passing to client component directly
    const serializedProducts = products.map(product => ({
        ...product,
        _id: (product._id as mongoose.Types.ObjectId).toString(),
        category: product.category ? {
            ...product.category,
            _id: (product.category._id as mongoose.Types.ObjectId).toString()
        } : null,
        createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : undefined,
        updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : undefined,
    }));

    return {
        products: serializedProducts,
        metadata: {
            page,
            limit,
            total,
            totalPages,
        }
    };
}

export async function getProductBySlug(slug: string) {
    await dbConnect();
    // Ensure Category model is registered
    void Category;

    const query = { slug, isDeleted: false };
    const product = await Product.findOne(query).populate('category', 'name slug').lean();

    if (!product) return null;

    // Type assertion or checking safely
    const categoryData = product.category && typeof product.category === 'object' && '_id' in product.category
        ? {
            ...product.category,
            _id: (product.category._id as mongoose.Types.ObjectId).toString()
        }
        : null;

    return {
        ...product,
        _id: (product._id as mongoose.Types.ObjectId).toString(),
        category: categoryData,
        createdAt: product.createdAt ? new Date(product.createdAt).toISOString() : undefined,
        updatedAt: product.updatedAt ? new Date(product.updatedAt).toISOString() : undefined,
    };
}
