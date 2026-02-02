import { NextResponse } from 'next/server';

interface ApiResponseData {
    success: boolean;
    message: string;
    data?: unknown;
    error?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

/**
 * Create a successful API response
 */
export function successResponse(
    message: string,
    data?: unknown,
    status: number = 200,
    pagination?: ApiResponseData['pagination']
): NextResponse<ApiResponseData> {
    const response: ApiResponseData = {
        success: true,
        message,
    };

    if (data !== undefined) {
        response.data = data;
    }

    if (pagination) {
        response.pagination = pagination;
    }

    return NextResponse.json(response, { status });
}

/**
 * Create an error API response
 */
export function errorResponse(
    message: string,
    status: number = 400,
    error?: string
): NextResponse<ApiResponseData> {
    return NextResponse.json(
        {
            success: false,
            message,
            error: error || message,
        },
        { status }
    );
}

/**
 * Create a validation error response
 */
export function validationErrorResponse(
    errors: Array<{ path: string; message: string }>
): NextResponse<ApiResponseData> {
    return NextResponse.json(
        {
            success: false,
            message: 'Validation failed',
            error: errors.map((e) => `${e.path}: ${e.message}`).join(', '),
        },
        { status: 400 }
    );
}

/**
 * Create an unauthorized response
 */
export function unauthorizedResponse(
    message: string = 'Unauthorized'
): NextResponse<ApiResponseData> {
    return NextResponse.json(
        {
            success: false,
            message,
            error: message,
        },
        { status: 401 }
    );
}

/**
 * Create a forbidden response
 */
export function forbiddenResponse(
    message: string = 'Access denied'
): NextResponse<ApiResponseData> {
    return NextResponse.json(
        {
            success: false,
            message,
            error: message,
        },
        { status: 403 }
    );
}

/**
 * Create a not found response
 */
export function notFoundResponse(
    message: string = 'Resource not found'
): NextResponse<ApiResponseData> {
    return NextResponse.json(
        {
            success: false,
            message,
            error: message,
        },
        { status: 404 }
    );
}

/**
 * Create an internal server error response
 */
export function serverErrorResponse(
    error?: unknown
): NextResponse<ApiResponseData> {
    console.error('Server error:', error);
    return NextResponse.json(
        {
            success: false,
            message: 'Internal server error',
            error: 'Something went wrong',
        },
        { status: 500 }
    );
}
