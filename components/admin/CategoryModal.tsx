"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, FolderTree, Image as ImageIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import adminClient from "@/lib/api/admin/axios-instance";
import { useToast } from "@/components/Toast";
import Drawer from "@/components/admin/Drawer";
import ImageUploader from "@/components/admin/ImageUploader";
import { ICategory } from "@/models/Category";

// Validation Schema
const categorySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
    description: z.string().max(500, "Description cannot exceed 500 characters").optional(),
    image: z.string().url("Invalid image URL").optional().or(z.literal("")),
    isActive: z.boolean().default(true),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryModalProps {
    category?: ICategory | null;
    isOpen: boolean;
    onClose: () => void;
}

// Generate slug preview from name
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export default function CategoryModal({ category, isOpen, onClose }: CategoryModalProps) {
    const { showToast } = useToast();
    const queryClient = useQueryClient();
    const isEditMode = !!category;
    const [slugPreview, setSlugPreview] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CategoryFormData>({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        resolver: zodResolver(categorySchema) as any,
        defaultValues: {
            name: "",
            description: "",
            image: "",
            isActive: true,
        },
    });

    const nameValue = watch("name");

    // Update slug preview when name changes
    useEffect(() => {
        if (nameValue) {
            setSlugPreview(generateSlug(nameValue));
        } else {
            setSlugPreview("");
        }
    }, [nameValue]);

    // Reset form when modal opens or category changes
    useEffect(() => {
        if (isOpen) {
            if (category) {
                reset({
                    name: category.name,
                    description: category.description || "",
                    image: category.image || "",
                    isActive: category.isActive,
                });
                setSlugPreview(category.slug);
            } else {
                reset({
                    name: "",
                    description: "",
                    image: "",
                    isActive: true,
                });
                setSlugPreview("");
            }
        }
    }, [isOpen, category, reset]);

    // Mutation
    const mutation = useMutation({
        mutationFn: async (data: CategoryFormData) => {
            // Clean up empty strings
            const payload = {
                ...data,
                image: data.image || undefined,
                description: data.description || undefined,
            };

            if (isEditMode && category) {
                const res = await adminClient.put(`/categories/${category._id.toString()}`, payload);
                return res.data;
            } else {
                const res = await adminClient.post("/categories", payload);
                return res.data;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            showToast("success", `Category ${isEditMode ? "updated" : "created"} successfully`);
            onClose();
        },
        onError: (error) => {
            console.error(error);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const message = (error as any).response?.data?.message || "Failed to save category";
            showToast("error", message);
        },
    });

    const onSubmit = (data: CategoryFormData) => {
        mutation.mutate(data);
    };

    // Handle image upload
    const handleImageChange = (images: string[]) => {
        setValue("image", images[0] || "");
    };

    const currentImage = watch("image");

    return (
        <Drawer isOpen={isOpen} onClose={onClose} title={isEditMode ? "Edit Category" : "New Category"}>
            <form onSubmit={handleSubmit(onSubmit)} className="pb-24">
                <div className="space-y-8 px-1">
                    {/* Basic Info Section */}
                    <section className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <FolderTree className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Category Details</h3>
                                <p className="text-sm text-gray-500 mt-1">Enter category name and description</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category Name *
                                </label>
                                <input
                                    {...register("name")}
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                    placeholder="e.g. Coasters, Keychains, Jewelry"
                                />
                                {errors.name && (
                                    <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>

                            {/* Slug Preview */}
                            {slugPreview && (
                                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <p className="text-xs text-gray-500 mb-1">URL Slug (auto-generated)</p>
                                    <code className="text-sm text-primary font-mono">/products?category={slugPreview}</code>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    {...register("description")}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors min-h-[100px] resize-y"
                                    placeholder="Brief description of this category..."
                                />
                                {errors.description && (
                                    <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Image Section */}
                    <section className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <ImageIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Category Image</h3>
                                <p className="text-sm text-gray-500 mt-1">Optional banner or icon for this category</p>
                            </div>
                        </div>

                        <ImageUploader
                            value={currentImage ? [currentImage] : []}
                            onChange={handleImageChange}
                            maxImages={1}
                        />
                        {errors.image && (
                            <p className="mt-4 text-sm text-red-600">{errors.image.message}</p>
                        )}
                    </section>

                    {/* Settings Section */}
                    <section className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <FolderTree className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
                                <p className="text-sm text-gray-500 mt-1">Configure category visibility</p>
                            </div>
                        </div>

                        <label className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <input
                                type="checkbox"
                                {...register("isActive")}
                                className="mt-1 w-4 h-4 text-primary rounded focus:ring-primary/20 border-gray-300"
                            />
                            <div>
                                <span className="font-medium text-gray-900">Active</span>
                                <p className="text-sm text-gray-500 mt-1">Category will be visible to customers on the public site</p>
                            </div>
                        </label>
                    </section>
                </div>

                {/* Sticky Footer */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg z-10">
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
                            disabled={isSubmitting || mutation.isPending}
                        >
                            {(isSubmitting || mutation.isPending) && <Loader2 size={18} className="animate-spin" />}
                            {isEditMode ? "Update Category" : "Create Category"}
                        </button>
                    </div>
                </div>
            </form>
        </Drawer>
    );
}
