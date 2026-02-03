import axios from 'axios';

// Create admin-specific axios instance
const adminClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Include cookies in requests
});

// Request interceptor
adminClient.interceptors.request.use(
    (config) => {
        // Log requests in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[Admin API] ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
adminClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
            // Unauthorized - redirect to login
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }

        // Log errors in development
        if (process.env.NODE_ENV === 'development') {
            console.error('[Admin API Error]', error.response?.data || error.message);
        }

        return Promise.reject(error);
    }
);

export default adminClient;
