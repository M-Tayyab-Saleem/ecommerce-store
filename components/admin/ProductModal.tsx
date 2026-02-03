"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import adminClient from "@/lib/api/admin/axios-instance";
import { useToast } from "@/components/admin/Toast";
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
    variants: z.array(z.object({
        color: z.string().min(1, "Color is required"),
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
                const res = await adminClient.put(`/admin/products/${product._id.toString()}`, data); // Assuming endpoint
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
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">

                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Basic Info</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-group">
                            <label className="label">Product Name</label>
                            <input {...register("name")} className="input-field" placeholder="e.g. Resin Coaster" />
                            {errors.name && <p className="error-text">{errors.name.message}</p>}
                        </div>

                        <div className="form-group">
                            <label className="label">Category</label>
                            <select {...register("category")} className="input-field">
                                <option value="">Select Category</option>
                                {categories?.map((cat) => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.category && <p className="error-text">{errors.category.message}</p>}
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label">Description</label>
                        <textarea {...register("description")} className="input-field h-32" placeholder="Product details..." />
                        {errors.description && <p className="error-text">{errors.description.message}</p>}
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Pricing & Stock</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="form-group">
                            <label className="label">Price (PKR)</label>
                            <input type="number" {...register("price")} className="input-field" min="0" />
                            {errors.price && <p className="error-text">{errors.price.message}</p>}
                        </div>

                        <div className="form-group">
                            <label className="label">Stock</label>
                            <input type="number" {...register("stock")} className="input-field" min="0" />
                            {errors.stock && <p className="error-text">{errors.stock.message}</p>}
                        </div>

                        <div className="form-group">
                            <label className="label">Low Stock Alert</label>
                            <input type="number" {...register("lowStockThreshold")} className="input-field" min="0" />
                            {errors.lowStockThreshold && <p className="error-text">{errors.lowStockThreshold.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Images</h3>
                    <p className="text-sm text-gray-500">First image will be the cover image.</p>

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
                    {errors.images && <p className="error-text">{errors.images.message}</p>}
                </div>

                {/* Variants */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="text-lg font-medium text-gray-900">Variants (Optional)</h3>
                        <button
                            type="button"
                            onClick={() => append({ color: "", stock: 0 })}
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                            <Plus size={16} /> Add Variant
                        </button>
                    </div>

                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-3 items-center">
                                <div className="flex-1">
                                    <input
                                        {...register(`variants.${index}.color`)}
                                        placeholder="Color / Variant Name"
                                        className="input-field"
                                    />
                                    {errors.variants?.[index]?.color && <p className="error-text">{errors.variants[index]?.color?.message}</p>}
                                </div>
                                <div className="w-24">
                                    <input
                                        type="number"
                                        {...register(`variants.${index}.stock`)}
                                        placeholder="Stock"
                                        className="input-field"
                                        min="0"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="p-2 text-gray-400 hover:text-red-500"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {fields.length === 0 && <p className="text-sm text-gray-500 italic">No variants added.</p>}
                    </div>
                </div>

                {/* Settings */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Settings</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" {...register("isActive")} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                            <span className="text-gray-700">Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" {...register("isBestSeller")} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                            <span className="text-gray-700">Best Seller</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" {...register("isLatest")} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                            <span className="text-gray-700">Mark as New</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" {...register("customizable")} className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                            <span className="text-gray-700">Customizable</span>
                        </label>
                    </div>

                    {customizable && (
                        <div className="form-group mt-2">
                            <label className="label">Customization Note (displayed to user)</label>
                            <input {...register("customizationNote")} className="input-field" placeholder="e.g. Enter name to engrave" />
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex items-center justify-end gap-3">
                    <button type="button" onClick={onClose} className="btn-ghost" disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button type="submit" className="btn-primary flex items-center gap-2" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                        {isEditMode ? "Update Product" : "Create Product"}
                    </button>
                </div>
            </form>
        </Drawer>
    );
}
