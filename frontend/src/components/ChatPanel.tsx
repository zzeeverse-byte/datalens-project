import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';

interface ChatPanelProps {
    tableName: string;
}

interface Message {
    id: number;
    sender: 'user' | 'ai';
    text: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ tableName }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg: Message = { id: Date.now(), sender: 'user', text: input.trim() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const result = await sendChatMessage(userMsg.text, tableName);
            const aiMsg: Message = { 
                id: Date.now(), 
                sender: 'ai', 
                text: result.response || result.message || 'No response' 
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error: any) {
            const errorMsg: Message = { 
                id: Date.now(), 
                sender: 'ai', 
                text: `Error: ${error.message}` 
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', height: '600px' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>🤖</span>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'white', margin: 0 }}>DataLens AI Assistant</h2>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#94a3b8', margin: 'auto 0' }}>
                        <p style={{ fontSize: '1rem' }}>Ask a question about your dataset!</p>
                    </div>
                )}
                
                {messages.map(msg => (
                    <div key={msg.id} style={{
                        maxWidth: '85%',
                        padding: '1rem',
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        backgroundColor: msg.sender === 'user' ? '#2563eb' : 'white',
                        color: msg.sender === 'user' ? 'white' : '#1e293b',
                        border: msg.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                        borderRadius: '1rem',
                        borderBottomRightRadius: msg.sender === 'user' ? '0.25rem' : '1rem',
                        borderBottomLeftRadius: msg.sender === 'user' ? '1rem' : '0.25rem'
                    }}>
                        <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>{msg.text}</p>
                    </div>
                ))}
                
                {loading && (
                    <div style={{ alignSelf: 'flex-start', backgroundColor: 'white', border: '1px solid #e2e8f0', color: '#64748b', padding: '1rem', borderRadius: '1rem', borderBottomLeftRadius: '0.25rem' }}>
                        Thinking...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <div style={{ padding: '1rem', backgroundColor: 'white', borderTop: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input 
                        type="text" 
                        style={{ flex: 1, border: '1px solid #cbd5e1', backgroundColor: '#f8fafc', color: '#0f172a', padding: '0.75rem 1rem', borderRadius: '2rem', outline: 'none' }}
                        placeholder="Type your question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        style={{ backgroundColor: (loading || !input.trim()) ? '#cbd5e1' : '#2563eb', color: 'white', border: 'none', padding: '0 1.5rem', borderRadius: '2rem', cursor: (loading || !input.trim()) ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};
