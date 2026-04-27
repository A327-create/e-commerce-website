import api from './api';

export const getCart = async () => {
    const res = await api.get('/api/v1/cart');
    return res.data;
};

export const addToCart = async (product_id, quantity = 1) => {
    const res = await api.post('/api/v1/cart/add', { product_id, quantity });
    return res.data;
};

export const removeFromCart = async (item_id) => {
    const res = await api.delete(`/api/v1/cart/remove/${item_id}`);
    return res.data;
};