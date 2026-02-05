import { NextRequest } from "next/server";
import { z } from "zod";
import { uploadImage } from "@/utils/cloudinary";
import {
    successResponse,
    errorResponse,
    validationErrorResponse,
    serverErrorResponse,
} from "@/utils/apiResponse";

// Validation schema
const uploadSchema = z.object({
    image: z.string().min(1, "Image data is required"), // Base64
    folder: z.string().optional(),
});

// POST /api/upload - Public upload for payment proofs
export async function POST(request: NextRequest) {
    try {
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

        const { image } = validationResult.data;

        // Upload to Cloudinary
        // Specific folder for payment proofs
        // Since this is public, we force the folder to be payment-proofs to avoid abuse
        const uploadResult = await uploadImage(
            image,
            "resin-jewelry/payment-proofs"
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
