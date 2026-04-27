import api from './api';

export const fetchProducts = async (search = '') => {
    const res = await api.get(`/api/v1/products${search ? `?q=${search}` : ''}`);
    return res.data;
};

export const fetchFeaturedProducts = async () => {
    const res = await api.get('/api/v1/products/featured');
    return res.data;
};

export const fetchProductById = async (id) => {
    const res = await api.get(`/api/v1/products/${id}`);
    return res.data;
};