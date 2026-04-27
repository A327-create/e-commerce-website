import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Messages = ({ setPage, user }) => {
    const [conversations, setConversations] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        if (!user) { setPage('login'); return; }
        loadConversations();
    }, [user]);

    const loadConversations = async () => {
        try {
            const res = await api.get('/api/v1/messages/');
            setConversations(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadChat = async (otherId) => {
        try {
            const res = await api.get(`/api/v1/messages/chat/${otherId}`);
            setMessages(res.data);
            setActiveChat(otherId);
        } catch (err) {
            console.error(err);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        try {
            setSending(true);
            await api.post('/api/v1/messages/send', { content: newMessage });
            setNewMessage('');
            if (activeChat) loadChat(activeChat);
            else loadConversations();
        } catch (err) {
            console.error(err);
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

    return (
        <div className="container py-4 lg:py-8">
            <h1 className="text-xl lg:text-2xl font-bold text-[#1C1C1C] mb-4 lg:mb-6">Messages</h1>

            <div className="bg-white border border-[#DEE2E7] rounded-lg overflow-hidden h-[calc(100vh-200px)] lg:h-[600px] flex flex-col lg:flex-row">

                {/* Left — Conversations (hidden on mobile when chat open) */}
                <div className={`lg:w-[300px] border-b lg:border-b-0 lg:border-r border-[#DEE2E7] flex flex-col ${activeChat ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-[#DEE2E7]">
                        <h3 className="font-bold text-[#1C1C1C]">Conversations</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {conversations.length === 0 ? (
                            <div className="p-4 text-center text-gray-400 text-sm">No conversations yet</div>
                        ) : (
                            conversations.map((msg) => {
                                const otherId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
                                return (
                                    <div key={msg.id} onClick={() => loadChat(otherId)}
                                        className={`p-4 border-b border-[#DEE2E7] cursor-pointer hover:bg-[#F7FAFC] transition-colors ${activeChat === otherId ? 'bg-[#E3F0FF]' : ''}`}>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#E3F0FF] flex items-center justify-center text-primary font-bold">
                                                {msg.sender_id === user.id ? 'A' : 'U'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-[#1C1C1C]">
                                                    {msg.sender_id === user.id
                                                        ? msg.receiver?.fullname || msg.receiver?.username
                                                        : msg.sender?.fullname || msg.sender?.username}
                                                </p>
                                                <p className="text-xs text-[#8B96A5] line-clamp-1">{msg.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                    <div className="p-4 border-t border-[#DEE2E7]">
                        <button onClick={() => setActiveChat('new')}
                            className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary-dark">
                            + New Message
                        </button>
                    </div>
                </div>

                {/* Right — Chat (hidden on mobile when no chat selected) */}
                <div className={`flex-1 flex flex-col ${!activeChat ? 'hidden lg:flex' : 'flex'}`}>
                    {activeChat ? (
                        <>
                            <div className="p-4 border-b border-[#DEE2E7] flex items-center gap-3">
                                {/* Mobile back button */}
                                <button className="lg:hidden text-primary font-medium text-sm mr-1" onClick={() => setActiveChat(null)}>
                                    ←
                                </button>
                                <div className="w-9 h-9 rounded-full bg-[#E3F0FF] flex items-center justify-center text-primary font-bold text-sm">A</div>
                                <div>
                                    <p className="font-medium text-sm">Admin Support</p>
                                    <p className="text-xs text-[#8B96A5]">Typically replies within 24 hours</p>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {messages.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] px-4 py-2 rounded-lg text-sm ${msg.sender_id === user.id ? 'bg-primary text-white rounded-br-none' : 'bg-[#F7FAFC] text-[#1C1C1C] rounded-bl-none border border-[#DEE2E7]'}`}>
                                            <p>{msg.content}</p>
                                            <p className={`text-xs mt-1 ${msg.sender_id === user.id ? 'text-blue-100' : 'text-[#8B96A5]'}`}>
                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {messages.length === 0 && (
                                    <div className="text-center text-gray-400 text-sm py-8">
                                        Start a conversation with admin
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t border-[#DEE2E7] flex gap-3">
                                <input type="text" placeholder="Type a message..." value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                    className="flex-1 border border-[#DEE2E7] rounded-lg px-4 py-2 text-sm outline-none focus:border-primary" />
                                <button onClick={sendMessage} disabled={sending}
                                    className="bg-primary text-white px-4 lg:px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary-dark disabled:opacity-50">
                                    {sending ? '...' : 'Send'}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400">
                            <div className="text-center">
                                <p className="text-lg mb-2">Select a conversation</p>
                                <p className="text-sm">or start a new message</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;