import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { logoutUser } from '../services/authService';

const Profile = ({ setPage, user, setUser }) => {
    const [editing, setEditing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [form, setForm] = useState({ username: '', fullname: '', email: '' });
    const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setForm({
                username: user.username || '',
                fullname: user.fullname || '',
                email: user.email || ''
            });
        }
    }, [user]);

    const handleUpdate = async () => {
        try {
            const res = await api.patch('/api/v1/profile', form);
            setUser(res.data);
            setEditing(false);
            setMessage('Profile updated!');
        } catch (err) {
            setMessage('Update failed');
        }
    };

    const handlePasswordChange = async () => {
        try {
            await api.patch('/api/v1/profile/password', passwordForm);
            setChangingPassword(false);
            setMessage('Password changed!');
        } catch (err) {
            setMessage(err.response?.data?.detail || 'Failed');
        }
    };

    const initials = user?.fullname
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase() || 'U';

    return (
        <div className="container py-8">
            <div className="bg-white border border-[#DEE2E7] rounded-lg p-8 shadow-sm max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

                {message && (
                    <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                        {message}
                    </div>
                )}

                {/* Avatar + Info */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#DEE2E7]">
                    <div className="w-24 h-24 rounded-full bg-[#E3F0FF] flex items-center justify-center text-primary text-3xl font-bold">
                        {initials}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{user?.fullname || user?.username}</h2>
                        <p className="text-[#505050]">{user?.email}</p>
                    </div>
                </div>

                {/* Edit Profile */}
                {editing ? (
                    <div className="space-y-4 mb-4">
                        <input
                            className="w-full border border-[#DEE2E7] rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                            placeholder="Full Name"
                            value={form.fullname}
                            onChange={e => setForm({ ...form, fullname: e.target.value })}
                        />
                        <input
                            className="w-full border border-[#DEE2E7] rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                            placeholder="Username"
                            value={form.username}
                            onChange={e => setForm({ ...form, username: e.target.value })}
                        />
                        <input
                            className="w-full border border-[#DEE2E7] rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                            placeholder="Email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                        <div className="flex gap-3">
                            <button onClick={handleUpdate}
                                className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark">
                                Save
                            </button>
                            <button onClick={() => setEditing(false)}
                                className="flex-1 border border-[#DEE2E7] py-2 rounded-lg hover:bg-shade">
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : changingPassword ? (
                    <div className="space-y-4 mb-4">
                        <input
                            type="password"
                            className="w-full border border-[#DEE2E7] rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                            placeholder="Current Password"
                            value={passwordForm.current_password}
                            onChange={e => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                        />
                        <input
                            type="password"
                            className="w-full border border-[#DEE2E7] rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
                            placeholder="New Password"
                            value={passwordForm.new_password}
                            onChange={e => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                        />
                        <div className="flex gap-3">
                            <button onClick={handlePasswordChange}
                                className="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark">
                                Change Password
                            </button>
                            <button onClick={() => setChangingPassword(false)}
                                className="flex-1 border border-[#DEE2E7] py-2 rounded-lg hover:bg-shade">
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <button onClick={() => setEditing(true)}
                            className="w-full text-left p-4 border border-[#DEE2E7] rounded-lg hover:bg-shade transition-colors flex justify-between items-center">
                            <span>Edit Profile</span>
                            <span className="text-[#8B96A5]">→</span>
                        </button>
                        <button onClick={() => setChangingPassword(true)}
                            className="w-full text-left p-4 border border-[#DEE2E7] rounded-lg hover:bg-shade transition-colors flex justify-between items-center">
                            <span>Change Password</span>
                            <span className="text-[#8B96A5]">→</span>
                        </button>
                        <button onClick={() => setPage('favorites')}
                            className="w-full text-left p-4 border border-[#DEE2E7] rounded-lg hover:bg-shade transition-colors flex justify-between items-center">
                            <span>My Favorites</span>
                            <span className="text-[#8B96A5]">→</span>
                        </button>
                        <button onClick={() => setPage('orders')}
                            className="w-full text-left p-4 border border-[#DEE2E7] rounded-lg hover:bg-shade transition-colors flex justify-between items-center">
                            <span>My Orders</span>
                            <span className="text-[#8B96A5]">→</span>
                        </button>
                        {user?.is_admin && (
                            <button onClick={() => setPage('admin')}
                                className="w-full text-left p-4 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex justify-between items-center">
                                <span>Admin Dashboard</span>
                                <span>→</span>
                            </button>
                        )}
                        <button
                            onClick={async () => {
                                await logoutUser();
                                setUser(null);
                                setPage('home');
                            }}
                            className="w-full text-left p-4 border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors flex justify-between items-center">
                            <span>Logout</span>
                            <span>→</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;