import api from './api';

export const placeOrder = async () => {
    const res = await api.post('/api/v1/orders');
    return res.data;
};

export const getMyOrders = async () => {
    const res = await api.get('/api/v1/orders/my');
    return res.data;
};