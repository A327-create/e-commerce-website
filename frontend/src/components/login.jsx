import React, { useState } from 'react';
import { loginUser } from '../services/authService';

const Login = ({ setPage, setUser }) => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await loginUser(form);
            setUser(data.user);
            setPage('home');
        } catch (err) {
            setError(err.response?.data?.detail || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-[#F7FAFC]">
            <div className="bg-white border border-[#DEE2E7] rounded-xl p-8 w-full max-w-md shadow-sm">
                <h1 className="text-2xl font-bold text-[#1C1C1C] mb-2">Sign In</h1>
                <p className="text-[#8B96A5] text-sm mb-6">Welcome back! Please enter your details.</p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-[#1C1C1C] font-medium mb-1 block">Email</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            className="w-full border border-[#DEE2E7] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-[#1C1C1C] font-medium mb-1 block">Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            onKeyDown={e => e.key === 'Enter' && handleLogin()}
                            className="w-full border border-[#DEE2E7] rounded-lg px-4 py-2.5 text-sm outline-none focus:border-primary"
                        />
                    </div>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </div>

                <p className="text-center text-sm text-[#8B96A5] mt-6">
                    Don't have an account?{' '}
                    <span
                        className="text-primary font-medium cursor-pointer hover:underline"
                        onClick={() => setPage('register')}
                    >
                        Sign Up
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;