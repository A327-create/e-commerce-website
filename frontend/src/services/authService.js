import api from './api';

export const registerUser = async (data) => {
    const res = await api.post('/api/v1/auth/register', data);
    return res.data;
};

export const loginUser = async (data) => {
    const res = await api.post('/api/v1/auth/login', data);
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
    return res.data;
};

export const logoutUser = async () => {
    const refresh_token = localStorage.getItem('refresh_token');
    try {
        if (refresh_token) {
            await api.post('/api/v1/auth/logout', { refresh_token });
        }
    } catch (err) {
        console.error('Logout error:', err);
    } finally {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    }
};

export const getCurrentUser = async () => {
    const res = await api.get('/api/v1/auth/me');
    return res.data;
};