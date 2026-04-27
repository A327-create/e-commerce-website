import React, { useState, useEffect } from 'react';
import { ChevronDown, ArrowLeft, ShieldCheck, Truck, MessageSquare } from 'lucide-react';
import { getCart, removeFromCart } from '../services/cartService';
import { placeOrder } from '../services/orderService';

const Cart = ({ setPage }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            setLoading(true);
            const data = await getCart();
            setCart(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (itemId) => {
        try {
            await removeFromCart(itemId);
            loadCart();
        } catch (err) {
            console.error(err);
        }
    };

    const handleCheckout = async () => {
        try {
            setOrderLoading(true);
            await placeOrder();
            setMessage('Order placed successfully!');
            loadCart();
            setTimeout(() => setPage('orders'), 1500);
        } catch (err) {
            setMessage(err.response?.data?.detail || 'Order failed');
        } finally {
            setOrderLoading(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

    const items = cart?.items || [];
    const subtotal = items.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    return (
        <div className="container py-6">
            <h1 className="text-2xl font-bold text-[#1C1C1C] mb-6">My cart ({items.length})</h1>

            {message && (
                <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">{message}</div>
            )}

            {items.length === 0 ? (
                <div className="text-center py-20">
                    <p className="text-gray-400 mb-4">Your cart is empty</p>
                    <button
                        onClick={() => setPage('listing')}
                        className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary-dark"
                    >
                        Shop Now
                    </button>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left — Cart Items */}
                    <div className="flex-1 space-y-4">
                        <div className="bg-white border border-[#DEE2E7] rounded-lg overflow-hidden">
                            {items.map((item, index) => (
                                <div
                                    key={item.id}
                                    className={`p-4 lg:p-6 flex flex-col sm:flex-row gap-4 lg:gap-6 ${index !== items.length - 1 ? 'border-b border-[#DEE2E7]' : ''}`}
                                >
                                    {/* Image */}
                                    <div className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] border border-[#DEE2E7] rounded-lg p-3 flex items-center justify-center bg-[#F7F7F7] flex-shrink-0">
                                        <img
                                            src={item.product?.image || 'https://placehold.co/100x100'}
                                            alt={item.product?.name}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 flex flex-col md:flex-row justify-between gap-4">
                                        <div className="space-y-1.5">
                                            <h3 className="font-semibold text-[#1C1C1C] hover:text-primary cursor-pointer">
                                                {item.product?.name}
                                            </h3>
                                            <p className="text-[#8B96A5] text-sm">
                                                Category: {item.product?.category}
                                            </p>
                                            <div className="flex gap-2 pt-2">
                                                <button
                                                    onClick={() => handleRemove(item.id)}
                                                    className="px-3 py-1.5 border border-[#DEE2E7] rounded-md text-[#FA3434] text-xs font-semibold hover:bg-[#FFF0F0] transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-3 min-w-[120px]">
                                            <span className="text-lg font-bold text-[#1C1C1C]">
                                                ${(item.product?.price * item.quantity).toFixed(2)}
                                            </span>
                                            <div className="flex items-center gap-2 border border-[#DEE2E7] rounded-md px-3 py-2 bg-white">
                                                <span className="text-sm">Qty: {item.quantity}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-[#DEE2E7]">
                            <button
                                onClick={() => setPage('listing')}
                                className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary-dark transition-colors"
                            >
                                <ArrowLeft size={18} />
                                Back to shop
                            </button>
                        </div>

                        {/* Benefits */}
                        <div className="flex flex-wrap gap-6 py-4">
                            {[
                                { icon: <ShieldCheck size={20} />, title: 'Secure Payment', sub: 'Safe & encrypted' },
                                { icon: <MessageSquare size={20} />, title: 'Customer Support', sub: '24/7 support' },
                                { icon: <Truck size={20} />, title: 'Free Delivery', sub: 'On orders over $100' },
                            ].map((b, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#DEE2E7] flex items-center justify-center text-[#8B96A5]">
                                        {b.icon}
                                    </div>
                                    <div>
                                        <p className="text-[#1C1C1C] font-semibold text-sm">{b.title}</p>
                                        <p className="text-[#8B96A5] text-xs">{b.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Summary */}
                    <div className="lg:w-[280px] space-y-4">
                        <div className="bg-white border border-[#DEE2E7] rounded-lg p-5 shadow-sm">
                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-[#505050]">
                                    <span>Subtotal:</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[#00B517]">
                                    <span>Tax (5%):</span>
                                    <span>+ ${tax.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="h-[1px] bg-[#DEE2E7] mb-4"></div>
                            <div className="flex justify-between text-lg font-bold text-[#1C1C1C] mb-6">
                                <span>Total:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <button
                                onClick={handleCheckout}
                                disabled={orderLoading}
                                className="w-full bg-[#00B517] hover:bg-[#00A015] text-white py-4 rounded-lg font-bold text-lg transition-colors disabled:opacity-50"
                            >
                                {orderLoading ? 'Placing Order...' : 'Checkout'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;