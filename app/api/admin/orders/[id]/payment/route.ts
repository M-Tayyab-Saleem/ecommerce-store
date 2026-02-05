import { NextRequest } from "next/server";
import { z } from "zod";
import dbConnect from "@/lib/dbConnect";
import Payment from "@/models/Payment";
import { requireAdmin } from "@/lib/authMiddleware";
import mongoose from "mongoose";
import {
    successResponse,
    unauthorizedResponse,
    validationErrorResponse,
    serverErrorResponse,
    notFoundResponse
} from "@/utils/apiResponse";

// Validation for route params
const paramsSchema = z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid order ID",
    }),
});

// GET /api/admin/orders/[id]/payment - Get payment details for an order
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> } // Correct type for Next.js 15+ params
) {
    try {
        // Check admin
        const authResult = await requireAdmin(request);
        if (!authResult.success) {
            return unauthorizedResponse(authResult.error);
        }

        const params = await context.params;

        // Validate params
        const validationResult = paramsSchema.safeParse(params);
        if (!validationResult.success) {
            return validationErrorResponse([{ path: "id", message: "Invalid order ID" }]);
        }

        const orderId = validationResult.data.id;

        await dbConnect();

        const payment = await Payment.findOne({ order: orderId });

        if (!payment) {
            return notFoundResponse("Payment record not found");
        }

        return successResponse("Payment details retrieved", payment);
    } catch (error) {
        return serverErrorResponse(error);
    }
}
