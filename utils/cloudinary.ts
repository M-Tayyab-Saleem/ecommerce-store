import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface UploadResult {
    success: boolean;
    url?: string;
    publicId?: string;
    error?: string;
}

/**
 * Upload an image to Cloudinary
 * @param file - Base64 encoded image or file path
 * @param folder - Folder to store the image in
 */
export async function uploadImage(
    file: string,
    folder: string = 'resin-jewelry'
): Promise<UploadResult> {
    try {
        const result = await cloudinary.uploader.upload(file, {
            folder,
            resource_type: 'image',
            transformation: [
                { quality: 'auto', fetch_format: 'auto' },
                { width: 1200, height: 1200, crop: 'limit' },
            ],
        });

        return {
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return {
            success: false,
            error: 'Failed to upload image',
        };
    }
}

/**
 * Upload multiple images to Cloudinary
 */
export async function uploadMultipleImages(
    files: string[],
    folder: string = 'resin-jewelry/products'
): Promise<UploadResult[]> {
    const results = await Promise.all(
        files.map((file) => uploadImage(file, folder))
    );
    return results;
}

/**
 * Delete an image from Cloudinary
 */
export async function deleteImage(publicId: string): Promise<boolean> {
    try {
        await cloudinary.uploader.destroy(publicId);
        return true;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        return false;
    }
}

/**
 * Upload payment proof screenshot
 */
export async function uploadPaymentProof(file: string): Promise<UploadResult> {
    return uploadImage(file, 'resin-jewelry/payment-proofs');
}

export default cloudinary;
