import mongoose, { Document, Schema } from 'mongoose';

export type PaymentVerificationStatus =
    | 'pending'
    | 'verified'
    | 'rejected';

export interface IPayment extends Document {
    _id: mongoose.Types.ObjectId;
    order: mongoose.Types.ObjectId;
    method: 'COD' | 'BANK_TRANSFER' | 'JAZZCASH' | 'EASYPAISA';
    transactionId?: string;
    screenshot?: string;
    amount: number;
    status: PaymentVerificationStatus;
    verifiedBy?: mongoose.Types.ObjectId;
    verifiedAt?: Date;
    rejectionReason?: string;
    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema = new Schema<IPayment>(
    {
        order: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true,
        },
        method: {
            type: String,
            enum: ['COD', 'BANK_TRANSFER', 'JAZZCASH', 'EASYPAISA'],
            required: true,
        },
        transactionId: {
            type: String,
            trim: true,
        },
        screenshot: {
            type: String, // Cloudinary URL
        },
        amount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'verified', 'rejected'],
            default: 'pending',
        },
        verifiedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        verifiedAt: {
            type: Date,
        },
        rejectionReason: {
            type: String,
            maxlength: [500, 'Rejection reason cannot exceed 500 characters'],
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
paymentSchema.index({ order: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ createdAt: -1 });

const Payment =
    mongoose.models.Payment ||
    mongoose.model<IPayment>('Payment', paymentSchema);

export default Payment;
