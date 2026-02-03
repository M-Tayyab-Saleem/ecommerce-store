import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/authMiddleware";
import { uploadImage } from "@/utils/cloudinary";
import {
    successResponse,
    errorResponse,
    unauthorizedResponse,
    validationErrorResponse,
    serverErrorResponse,
} from "@/utils/apiResponse";

// Validation schema
const uploadSchema = z.object({
    image: z.string().min(1, "Image data is required"), // Base64
    folder: z.string().optional(),
});

// POST /api/admin/upload - Upload image to Cloudinary
export async function POST(request: NextRequest) {
    try {
        // Require admin
        const authResult = await requireAdmin(request);
        if (!authResult.success) {
            return unauthorizedResponse(authResult.error);
        }

        const body = await request.json();

        // Validate input
        const validationResult = uploadSchema.safeParse(body);
        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((err) => ({
                path: err.path.join("."),
                message: err.message,
            }));
            return validationErrorResponse(errors);
        }

        const { image, folder } = validationResult.data;

        // Upload to Cloudinary
        // Default folder: resin-jewelry/products
        const uploadResult = await uploadImage(
            image,
            folder || "resin-jewelry/products"
        );

        if (!uploadResult.success) {
            return errorResponse(uploadResult.error || "Failed to upload image", 500);
        }

        return successResponse("Image uploaded successfully", {
            url: uploadResult.url,
            publicId: uploadResult.publicId,
        });
    } catch (error) {
        return serverErrorResponse(error);
    }
}
