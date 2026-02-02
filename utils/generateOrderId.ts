/**
 * Generate a unique order ID
 * Format: ORD-YYYYMMDD-XXXXX (where XXXXX is a random alphanumeric string)
 */
export function generateOrderId(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Generate random 5-character alphanumeric string
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';
    for (let i = 0; i < 5; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `ORD-${year}${month}${day}-${randomPart}`;
}

/**
 * Generate a unique transaction ID for payments
 * Format: TXN-TIMESTAMP-XXXX
 */
export function generateTransactionId(): string {
    const timestamp = Date.now();
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomPart = '';
    for (let i = 0; i < 4; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `TXN-${timestamp}-${randomPart}`;
}
