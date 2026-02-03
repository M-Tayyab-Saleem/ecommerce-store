"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import adminClient from "@/lib/api/admin/axios-instance";
import { useToast } from "@/components/admin/Toast";

interface ImageUploaderProps {
    value?: string[];
    onChange: (urls: string[]) => void;
    maxImages?: number;
    folder?: string;
    disabled?: boolean;
}

export default function ImageUploader({
    value = [],
    onChange,
    maxImages = 5,
    folder = "resin-jewelry/products",
    disabled = false,
}: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (value.length + files.length > maxImages) {
            showToast("error", `Maximum ${maxImages} images allowed`);
            return;
        }

        setUploading(true);

        try {
            const newUrls: string[] = [];

            // Process each file
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Validate file type
                if (!file.type.startsWith("image/")) {
                    showToast("error", "Only image files are allowed");
                    continue;
                }

                // Validate file size (e.g. 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showToast("error", "Image size must be less than 5MB");
                    continue;
                }

                // Convert to Base64
                const base64 = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result as string);
                    reader.onerror = (error) => reject(error);
                });

                // Upload to API
                const { data } = await adminClient.post("/admin/upload", {
                    image: base64,
                    folder,
                });

                if (data.success && data.data?.url) {
                    newUrls.push(data.data.url);
                }
            }

            if (newUrls.length > 0) {
                onChange([...value, ...newUrls]);
                showToast("success", "Images uploaded successfully");
            }
        } catch (error) {
            console.error("Upload failed", error);
            showToast("error", "Failed to upload images");
        } finally {
            setUploading(false);
            // Reset input
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const removeImage = (indexToRemove: number) => {
        onChange(value.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="space-y-4">
            {/* Image Grid */}
            {value.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {value.map((url, index) => (
                        <div key={url} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                            <Image
                                src={url}
                                alt={`Product image ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                disabled={disabled}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Button */}
            {value.length < maxImages && (
                <div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        multiple
                        className="hidden"
                        disabled={disabled || uploading}
                    />
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={disabled || uploading}
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg text-gray-400 hover:border-primary hover:text-primary hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? (
                            <>
                                <Loader2 size={24} className="animate-spin mb-2" />
                                <span className="text-sm">Uploading...</span>
                            </>
                        ) : (
                            <>
                                <Upload size={24} className="mb-2" />
                                <span className="text-sm font-medium">Click to upload images</span>
                                <span className="text-xs text-gray-400 mt-1">
                                    JPG, PNG, WEBP up to 5MB (Max {maxImages} images)
                                </span>
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
