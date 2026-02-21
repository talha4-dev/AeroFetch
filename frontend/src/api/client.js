import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' },
    timeout: 60000,
});

// Attach JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('aerofetch_token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 globally — auto-logout
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('aerofetch_token');
            if (!window.location.pathname.includes('/auth')) {
                window.dispatchEvent(new CustomEvent('aerofetch:unauthorized'));
            }
        }
        return Promise.reject(error);
    }
);

export default api;
