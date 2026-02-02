/**
 * Format number as Pakistani Rupees
 */
export function formatPKR(amount: number): string {
    return new Intl.NumberFormat('en-PK', {
        style: 'currency',
        currency: 'PKR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format date in a readable format
 */
export function formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-PK', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(dateObj);
}

/**
 * Format short date
 */
export function formatShortDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-PK', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(dateObj);
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

/**
 * Format phone number for Pakistan
 */
export function formatPhonePK(phone: string): string {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');

    // Format as +92 XXX XXXXXXX
    if (cleaned.startsWith('92')) {
        return `+92 ${cleaned.slice(2, 5)} ${cleaned.slice(5)}`;
    } else if (cleaned.startsWith('0')) {
        return `0${cleaned.slice(1, 4)} ${cleaned.slice(4)}`;
    }

    return phone;
}
