import axios from 'axios';

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important for JWT cookies
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Add any custom headers here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
            // Unauthorized - could redirect to login
            if (typeof window !== 'undefined') {
                // Only redirect on client side
                console.warn('Unauthorized access - please login');
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
