"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Loader2, Image as ImageIcon, Settings, Package, Tag, Info } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import adminClient from "@/lib/api/admin/axios-instance";
import { useToast } from "@/components/Toast";
import ImageUploader from "@/components/admin/ImageUploader";
import { IProduct } from "@/models/Product";
import Drawer from "@/components/admin/Drawer";

// Validation Schema (matching server schema roughly)
const productSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.coerce.number().min(0, "Price cannot be negative"),
    category: z.string().min(1, "Category is required"),
    stock: z.coerce.number().min(0, "Stock cannot be negative"),
    lowStockThreshold: z.coerce.number().min(0).default(5),
    images: z.array(z.string()).min(1, "At least one image is required"),
    isActive: z.boolean().default(true),
    isBestSeller: z.boolean().default(false),
    isLatest: z.boolean().default(true),
    customizable: z.boolean().default(false),
    customizationNote: z.string().optional(),
    handmadeDisclaimer: z.string().optional(),
    // Design-based variants
    variants: z.array(z.object({
        designName: z.string().min(1, "Design name is required"),
        images: z.array(z.string()).default([]),
        price: z.coerce.number().min(0, "Price cannot be negative").optional(),
        stock: z.coerce.number().min(0, "Stock cannot be negative"),
    })).optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

interface Category {
    _id: string;
    name: string;
}

interface ProductModalProps {
    product?: IProduct | null; // null means create mode
    isOpen: boolean;
    onClose: () => void;
    categories: Category[];
}

export default function ProductModal({
    product,
    isOpen,
    onClose,
    categories,
}: ProductModalProps) {
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    const isEditMode = !!product;

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ProductFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(productSchema) as any,
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            stock: 0,
            lowStockThreshold: 5,
            images: [],
            isActive: true,
            customizable: false,
            isBestSeller: false,
            isLatest: true,
            category: "",
            variants: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants",
    });

    const customizable = watch("customizable");

    // Reset form when modal opens or product changes
    useEffect(() => {
        if (isOpen) {
            if (product) {
                reset({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    lowStockThreshold: product.lowStockThreshold || 5,
                    images: product.images || [],
                    isActive: product.isActive,
                    isBestSeller: product.isBestSeller,
                    isLatest: product.isLatest,
                    customizable: product.customizable,
                    customizationNote: product.customizationNote,
                    handmadeDisclaimer: product.handmadeDisclaimer,
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    category: typeof product.category === 'object' ? (product.category as any)._id?.toString() : String(product.category),
                    variants: product.variants || [],
                });
            } else {
                reset({
                    name: "",
                    description: "",
                    price: 0,
                    stock: 0,
                    lowStockThreshold: 5,
                    images: [],
                    isActive: true,
                    isBestSeller: false,
                    isLatest: true,
                    customizable: false,
                    variants: [],
                    category: "",
                });
            }
        }
    }, [isOpen, product, reset]);

    // Mutation
    const mutation = useMutation({
        mutationFn: async (data: ProductFormData) => {
            if (isEditMode && product) {
                // Update
                const res = await adminClient.put(`/products/${product._id.toString()}`, data);
                return res.data;
            } else {
                // Create
                const res = await adminClient.post("/products", data);
                return res.data;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
            showToast("success", `Product ${isEditMode ? "updated" : "created"} successfully`);
            onClose();
        },
        onError: (error) => {
            console.error(error);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            showToast("error", (error as any).response?.data?.message || "Failed to save product");
        },
    });

    const onSubmit = (data: ProductFormData) => {
        mutation.mutate(data);
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title={isEditMode ? "Edit Product" : "New Product"}
            size="lg"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="pb-24">
                {/* Form content with better spacing */}
                <div className="space-y-8 px-1">
                    {/* Basic Info Section */}
                    <section className="bg-white rounded-lg border border-gray-200 p-5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Info className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                                <p className="text-sm text-gray-500 mt-1">Enter product details and description</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        {...register("name")}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                        placeholder="e.g. Handmade Resin Coaster Set"
                                    />
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        {...register("category")}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white"
                                    >
                                        <option value="">Select a category</option>
                                        {categories?.map((cat) => (
                                            <option key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                            {errors.category.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    {...register("description")}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors min-h-[120px] resize-y"
                                    placeholder="Describe your product in detail..."
                                />
                                {errors.description && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        {errors.description.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Pricing & Stock Section */}
                    <section className="bg-white rounded-lg border border-gray-200 p-5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Tag className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Pricing & Stock</h3>
                                <p className="text-sm text-gray-500 mt-1">Set pricing and inventory details</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (PKR) *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        ₹
                                    </span>
                                    <input
                                        type="number"
                                        {...register("price")}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                                {errors.price && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        {errors.price.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock Quantity *
                                </label>
                                <input
                                    type="number"
                                    {...register("stock")}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                    min="0"
                                />
                                {errors.stock && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        {errors.stock.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Low Stock Alert
                                </label>
                                <input
                                    type="number"
                                    {...register("lowStockThreshold")}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                    min="0"
                                    placeholder="Default: 5"
                                />
                                {errors.lowStockThreshold && (
                                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                        {errors.lowStockThreshold.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Images Section */}
                    <section className="bg-white rounded-lg border border-gray-200 p-5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <ImageIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Product Images</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    First image will be the cover image. Max 5 images
                                </p>
                            </div>
                        </div>

                        <Controller
                            control={control}
                            name="images"
                            render={({ field }) => (
                                <ImageUploader
                                    value={field.value}
                                    onChange={field.onChange}
                                    maxImages={5}
                                />
                            )}
                        />
                        {errors.images && (
                            <p className="mt-4 text-sm text-red-600 flex items-center gap-1">
                                {errors.images.message}
                            </p>
                        )}
                    </section>

                    {/* Variants Section */}
                    <section className="bg-white rounded-lg border border-gray-200 p-5">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Package className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">Variants (Optional)</h3>
                                    <p className="text-sm text-gray-500 mt-1">Add color or size variants</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => append({ designName: "", images: [], stock: 0 })}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                            >
                                <Plus size={16} />
                                Add Variant
                            </button>
                        </div>

                        <div className="space-y-4">
                            {fields.length > 0 ? (
                                <div className="space-y-3">
                                    {fields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4"
                                        >
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                    <div className="sm:col-span-1">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Design Name *
                                                        </label>
                                                        <input
                                                            {...register(`variants.${index}.designName`)}
                                                            placeholder="e.g. Ocean Blue"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                                        />
                                                        {errors.variants?.[index]?.designName && (
                                                            <p className="mt-1 text-sm text-red-600">
                                                                {errors.variants[index]?.designName?.message}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Stock *
                                                        </label>
                                                        <input
                                                            type="number"
                                                            {...register(`variants.${index}.stock`)}
                                                            placeholder="0"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Price (PKR)
                                                        </label>
                                                        <input
                                                            type="number"
                                                            {...register(`variants.${index}.price`)}
                                                            placeholder="Optional"
                                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                                            min="0"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                    title="Remove variant"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Variant Images
                                                </label>
                                                <Controller
                                                    control={control}
                                                    name={`variants.${index}.images`}
                                                    render={({ field: { onChange, value } }) => (
                                                        <ImageUploader
                                                            value={value || []}
                                                            onChange={onChange}
                                                            maxImages={5}
                                                            folder="resin-jewelry/variants"
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500">No design variants added yet</p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Add design variations with unique images and pricing
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Settings Section */}
                    <section className="bg-white rounded-lg border border-gray-200 p-5">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Settings className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Product Settings</h3>
                                <p className="text-sm text-gray-500 mt-1">Configure product visibility and features</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                    <input
                                        type="checkbox"
                                        {...register("isActive")}
                                        className="mt-1 w-4 h-4 text-primary rounded focus:ring-primary/20 border-gray-300"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-900">Active</span>
                                        <p className="text-sm text-gray-500 mt-1">Product will be visible to customers</p>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                    <input
                                        type="checkbox"
                                        {...register("isBestSeller")}
                                        className="mt-1 w-4 h-4 text-primary rounded focus:ring-primary/20 border-gray-300"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-900">Best Seller</span>
                                        <p className="text-sm text-gray-500 mt-1">Mark as best selling product</p>
                                    </div>
                                </label>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                    <input
                                        type="checkbox"
                                        {...register("isLatest")}
                                        className="mt-1 w-4 h-4 text-primary rounded focus:ring-primary/20 border-gray-300"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-900">Mark as New</span>
                                        <p className="text-sm text-gray-500 mt-1">Show &quot;New&quot; badge on product</p>
                                    </div>
                                </label>

                                <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                    <input
                                        type="checkbox"
                                        {...register("customizable")}
                                        className="mt-1 w-4 h-4 text-primary rounded focus:ring-primary/20 border-gray-300"
                                    />
                                    <div>
                                        <span className="font-medium text-gray-900">Customizable</span>
                                        <p className="text-sm text-gray-500 mt-1">Allow customers to customize this product</p>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {customizable && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Customization Note
                                </label>
                                <input
                                    {...register("customizationNote")}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                    placeholder="e.g. Enter name to engrave, Choose color options..."
                                />
                                <p className="mt-2 text-sm text-gray-500">
                                    This note will be displayed to customers during customization
                                </p>
                            </div>
                        )}
                    </section>
                </div>

                {/* Sticky Footer */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg">
                    <div className="flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                            {isEditMode ? "Update Product" : "Create Product"}
                        </button>
                    </div>
                </div>
            </form>
        </Drawer>
    );
}