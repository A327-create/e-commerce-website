import api from './api';

export const toggleFavorite = async (product_id) => {
    const res = await api.post(`/api/v1/favorites/${product_id}`);
    return res.data;
};

export const getMyFavorites = async () => {
    const res = await api.get('/api/v1/favorites');
    return res.data;
};