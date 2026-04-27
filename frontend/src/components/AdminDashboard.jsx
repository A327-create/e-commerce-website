import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminDashboard = ({ setPage, user }) => {
    const [activeTab, setActiveTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(true);

    const [showProductForm, setShowProductForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        name: '', price: '', old_price: '', category: '',
        image: '', description: '', stock: '', rating: '0', orders: '0', is_featured: false
    });

    useEffect(() => { loadData(); }, [activeTab]);

    const loadData = async () => {
        try {
            setLoading(true);
            if (activeTab === 'products') {
                const res = await api.get('/api/v1/products');
                setProducts(res.data);
            } else if (activeTab === 'orders') {
                const res = await api.get('/api/v1/orders/all');
                setOrders(res.data);
            } else if (activeTab === 'users') {
                const res = await api.get('/api/v1/profile/admin/users');
                setUsers(res.data);
            } else if (activeTab === 'messages') {
                const res = await api.get('/api/v1/messages/admin/all');
                setMessages(res.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadAdminChat = async (userId) => {
        try {
            const res = await api.get(`/api/v1/messages/chat/${userId}`);
            setChatMessages(res.data);
            setActiveChat(userId);
        } catch (err) {
            console.error(err);
        }
    };

    const handleReply = async () => {
        if (!replyText.trim()) return;
        try {
            await api.post(`/api/v1/messages/reply/${activeChat}`, { content: replyText });
            setReplyText('');
            loadAdminChat(activeChat);
        } catch (err) {
            console.error(err);
        }
    };

    const handleProductSubmit = async () => {
        try {
            const data = {
                ...productForm,
                price: parseFloat(productForm.price),
                old_price: productForm.old_price ? parseFloat(productForm.old_price) : null,
                stock: parseInt(productForm.stock),
                rating: parseFloat(productForm.rating),
                orders: parseInt(productForm.orders),
            };
            if (editingProduct) {
                await api.patch(`/api/v1/products/${editingProduct.id}`, data);
            } else {
                await api.post('/api/v1/products', data);
            }
            setShowProductForm(false);
            setEditingProduct(null);
            setProductForm({ name: '', price: '', old_price: '', category: '', image: '', description: '', stock: '', rating: '0', orders: '0', is_featured: false });
            loadData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        await api.delete(`/api/v1/products/${id}`);
        loadData();
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name, price: product.price,
            old_price: product.old_price || '', category: product.category,
            image: product.image || '', description: product.description || '',
            stock: product.stock, rating: product.rating,
            orders: product.orders, is_featured: product.is_featured
        });
        setShowProductForm(true);
    };

    const handleOrderStatus = async (orderId, status) => {
        await api.patch(`/api/v1/orders/${orderId}/status`, { status });
        loadData();
    };

    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700',
        processing: 'bg-blue-100 text-blue-700',
        shipped: 'bg-purple-100 text-purple-700',
        delivered: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    return (
        <div className="container py-4 lg:py-6">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
                <h1 className="text-xl lg:text-2xl font-bold text-[#1C1C1C]">Admin Dashboard</h1>
                <button onClick={() => setPage('home')} className="text-sm text-primary hover:underline">
                    ← Back
                </button>
            </div>

            {/* Tabs — scrollable on mobile */}
            <div className="flex overflow-x-auto no-scrollbar border-b border-[#DEE2E7] mb-4 lg:mb-6">
                {['products', 'orders', 'users', 'messages'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 lg:px-6 py-3 text-sm font-medium capitalize border-b-2 flex-shrink-0 transition-colors ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-[#8B96A5] hover:text-primary'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-400">Loading...</div>
            ) : (
                <>
                    {/* Products Tab */}
                    {activeTab === 'products' && (
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm text-[#8B96A5]">{products.length} products</span>
                                <button onClick={() => { setShowProductForm(true); setEditingProduct(null); }}
                                    className="bg-primary text-white px-3 lg:px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark">
                                    + Add Product
                                </button>
                            </div>

                            {showProductForm && (
                                <div className="bg-white border border-[#DEE2E7] rounded-lg p-4 lg:p-6 mb-6">
                                    <h3 className="font-bold text-[#1C1C1C] mb-4">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {[
                                            { key: 'name', label: 'Name', type: 'text' },
                                            { key: 'price', label: 'Price', type: 'number' },
                                            { key: 'old_price', label: 'Old Price', type: 'number' },
                                            { key: 'category', label: 'Category', type: 'text' },
                                            { key: 'image', label: 'Image URL', type: 'text' },
                                            { key: 'stock', label: 'Stock', type: 'number' },
                                        ].map(field => (
                                            <div key={field.key}>
                                                <label className="text-xs text-[#8B96A5] mb-1 block">{field.label}</label>
                                                <input type={field.type} value={productForm[field.key]}
                                                    onChange={e => setProductForm({ ...productForm, [field.key]: e.target.value })}
                                                    className="w-full border border-[#DEE2E7] rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" />
                                            </div>
                                        ))}
                                        <div className="sm:col-span-2">
                                            <label className="text-xs text-[#8B96A5] mb-1 block">Description</label>
                                            <textarea value={productForm.description}
                                                onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                                                className="w-full border border-[#DEE2E7] rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" rows={3} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" id="is_featured" checked={productForm.is_featured}
                                                onChange={e => setProductForm({ ...productForm, is_featured: e.target.checked })}
                                                className="w-4 h-4" />
                                            <label htmlFor="is_featured" className="text-sm text-[#1C1C1C]">Featured Product</label>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button onClick={handleProductSubmit}
                                            className="bg-primary text-white px-4 lg:px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark">
                                            {editingProduct ? 'Update' : 'Add Product'}
                                        </button>
                                        <button onClick={() => { setShowProductForm(false); setEditingProduct(null); }}
                                            className="border border-[#DEE2E7] px-4 lg:px-6 py-2 rounded-lg text-sm hover:bg-shade">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Products table — horizontal scroll on mobile */}
                            <div className="bg-white border border-[#DEE2E7] rounded-lg overflow-x-auto">
                                <table className="w-full text-sm min-w-[600px]">
                                    <thead className="bg-[#F7FAFC] border-b border-[#DEE2E7]">
                                        <tr>
                                            <th className="text-left p-3 text-[#8B96A5] font-medium">Product</th>
                                            <th className="text-left p-3 text-[#8B96A5] font-medium">Category</th>
                                            <th className="text-left p-3 text-[#8B96A5] font-medium">Price</th>
                                            <th className="text-left p-3 text-[#8B96A5] font-medium">Stock</th>
                                            <th className="text-left p-3 text-[#8B96A5] font-medium">Featured</th>
                                            <th className="text-left p-3 text-[#8B96A5] font-medium">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(product => (
                                            <tr key={product.id} className="border-b border-[#DEE2E7] hover:bg-[#F7FAFC]">
                                                <td className="p-3">
                                                    <div className="flex items-center gap-3">
                                                        <img src={product.image || 'https://placehold.co/40x40'} alt={product.name}
                                                            className="w-9 h-9 object-cover rounded-md border border-[#DEE2E7]" />
                                                        <span className="font-medium text-[#1C1C1C] line-clamp-1 max-w-[120px]">{product.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-[#505050]">{product.category}</td>
                                                <td className="p-3 font-medium">${product.price}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                                                        {product.stock > 0 ? product.stock : 'Out'}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${product.is_featured ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                                        {product.is_featured ? 'Yes' : 'No'}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleEditProduct(product)} className="text-primary text-xs font-medium hover:underline">Edit</button>
                                                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 text-xs font-medium hover:underline">Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="bg-white border border-[#DEE2E7] rounded-lg overflow-x-auto">
                            <table className="w-full text-sm min-w-[600px]">
                                <thead className="bg-[#F7FAFC] border-b border-[#DEE2E7]">
                                    <tr>
                                        <th className="text-left p-3 text-[#8B96A5] font-medium">Order ID</th>
                                        <th className="text-left p-3 text-[#8B96A5] font-medium">User ID</th>
                                        <th className="text-left p-3 text-[#8B96A5] font-medium">Total</th>
                                        <th className="text-left p-3 text-[#8B96A5] font-medium">Status</th>
                                        <th className="text-left p-3 text-[#8B96A5] font-medium">Date</th>
                                        <th className="text-left p-3 text-[#8B96A5] font-medium">Update</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order.id} className="border-b border-[#DEE2E7] hover:bg-[#F7FAFC]">
                                            <td className="p-3 font-medium">#{order.id}</td>
                                            <td className="p-3 text-[#505050]">{order.user_id}</td>
                                            <td className="p-3 font-medium">${order.total_price}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-xs ${statusColors[order.status]}`}>{order.status}</span>
                                            </td>
                                            <td className="p-3 text-[#8B96A5]">{new Date(order.created_at).toLocaleDateString()}</td>
                                            <td className="p-3">
                                                <select value={order.status} onChange={e => handleOrderStatus(order.id, e.target.value)}
                                                    className="border border-[#DEE2E7] rounded-md px-2 py-1 text-xs outline-none focus:border-primary">
                                                    {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div className="bg-white border border-[#DEE2E7] rounded-lg overflow-x-auto">
                            <table className="w-full text-sm min-w-[500px]">
                                <thead className="bg-[#F7FAFC] border-b border-[#DEE2E7]">
                                    <tr>
                                        <th className="text-left p-3 text-[#8B96A5] font-medium">ID</th>
                                        <th className="text-left p-3 text-[#8B96A5] font-medium">Name</th>
                                        <th className="text-left p-3 text-[#8B96A5] font-medium">Email</th>
                                        <th className="text-left p-3 text-[#8B96A5] font-medium">Admin</th>
                                        <th className="text-left p-3 text-[#8B96A5] font-medium">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} className="border-b border-[#DEE2E7] hover:bg-[#F7FAFC]">
                                            <td className="p-3">#{u.id}</td>
                                            <td className="p-3 font-medium">{u.fullname || '-'}</td>
                                            <td className="p-3 text-[#505050] text-xs">{u.email}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-xs ${u.is_admin ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {u.is_admin ? 'Admin' : 'User'}
                                                </span>
                                            </td>
                                            <td className="p-3 text-[#8B96A5] text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Messages Tab */}
                    {activeTab === 'messages' && (
                        <div className="bg-white border border-[#DEE2E7] rounded-lg overflow-hidden">
                            {/* Mobile: show either list or chat */}
                            <div className="flex flex-col lg:flex-row h-[500px] lg:h-[600px]">

                                {/* User list — hidden on mobile when chat is active */}
                                <div className={`lg:w-[280px] border-b lg:border-b-0 lg:border-r border-[#DEE2E7] flex flex-col ${activeChat ? 'hidden lg:flex' : 'flex'}`}>
                                    <div className="p-4 border-b border-[#DEE2E7]">
                                        <h3 className="font-bold text-sm text-[#1C1C1C]">User Conversations</h3>
                                    </div>
                                    <div className="flex-1 overflow-y-auto">
                                        {messages.length === 0 ? (
                                            <p className="text-center text-gray-400 text-sm p-4">No messages</p>
                                        ) : (
                                            messages.map((msg) => {
                                                const userId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
                                                return (
                                                    <div key={msg.id} onClick={() => loadAdminChat(userId)}
                                                        className={`p-4 border-b border-[#DEE2E7] cursor-pointer hover:bg-[#F7FAFC] ${activeChat === userId ? 'bg-[#E3F0FF]' : ''}`}>
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-9 h-9 rounded-full bg-[#E3F0FF] flex items-center justify-center text-primary font-bold text-sm">U</div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="font-medium text-sm text-[#1C1C1C]">User #{userId}</p>
                                                                <p className="text-xs text-[#8B96A5] line-clamp-1">{msg.content}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                                {/* Chat panel */}
                                <div className={`flex-1 flex flex-col ${!activeChat ? 'hidden lg:flex' : 'flex'}`}>
                                    {activeChat ? (
                                        <>
                                            <div className="p-4 border-b border-[#DEE2E7] flex items-center gap-3">
                                                {/* Mobile back button */}
                                                <button className="lg:hidden text-primary mr-1" onClick={() => setActiveChat(null)}>← </button>
                                                <p className="font-medium text-sm">User #{activeChat}</p>
                                            </div>
                                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                                {chatMessages.map((msg) => (
                                                    <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${msg.sender_id === user.id ? 'bg-primary text-white rounded-br-none' : 'bg-[#F7FAFC] text-[#1C1C1C] rounded-bl-none border border-[#DEE2E7]'}`}>
                                                            <p>{msg.content}</p>
                                                            <p className={`text-xs mt-1 ${msg.sender_id === user.id ? 'text-blue-100' : 'text-[#8B96A5]'}`}>
                                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="p-4 border-t border-[#DEE2E7] flex gap-3">
                                                <input type="text" placeholder="Type reply..." value={replyText}
                                                    onChange={e => setReplyText(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && handleReply()}
                                                    className="flex-1 border border-[#DEE2E7] rounded-lg px-4 py-2 text-sm outline-none focus:border-primary" />
                                                <button onClick={handleReply}
                                                    className="bg-primary text-white px-4 lg:px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark">
                                                    Reply
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center text-gray-400">
                                            <p>Select a conversation to reply</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default AdminDashboard;