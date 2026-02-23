import axios from "axios";
import { toast } from "sonner";

const API_Url = process.env.NEXT_PUBLIC_API_URL;

const API = axios.create({
    baseURL:`${API_Url as string}`,
    headers:{
        'Content-Type':'application/json'
    },
    timeout: 30000, // 30 second timeout
});

API.interceptors.request.use((config)=>{
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if(token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Global error interceptor
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            // Network error / timeout
            toast.error('Network error. Please check your connection.');
        } else if (error.response.status === 401) {
            // Token expired / unauthorized
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        } else if (error.response.status >= 500) {
            toast.error('Server error. Please try again later.');
        }
        return Promise.reject(error);
    }
);

export default API;