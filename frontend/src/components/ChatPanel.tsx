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
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm flex flex-col h-[600px]">
            <div className="bg-slate-900 px-6 py-4 flex items-center">
                <div className="w-2 h-2 rounded-full bg-emerald-400 mr-3 animate-pulse"></div>
                <h2 className="text-lg font-semibold text-white">DataLens AI Assistant</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-slate-50">
                {messages.length === 0 && (
                    <div className="text-center text-slate-400 my-auto flex flex-col items-center">
                        <svg className="w-12 h-12 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        <p>Ask a question about your dataset!</p>
                    </div>
                )}
                
                {messages.map(msg => (
                    <div key={msg.id} className={`max-w-[85%] p-4 ${
                        msg.sender === 'user' 
                            ? 'bg-blue-600 text-white self-end rounded-2xl rounded-br-sm shadow-sm' 
                            : 'bg-white border border-slate-200 text-slate-800 self-start rounded-2xl rounded-bl-sm shadow-sm'
                    }`}>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                    </div>
                ))}
                
                {loading && (
                    <div className="bg-white border border-slate-200 text-slate-500 self-start rounded-2xl rounded-bl-sm shadow-sm max-w-[85%] p-4 flex items-center space-x-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="p-4 bg-white border-t border-slate-200">
                <div className="flex gap-3 relative">
                    <input 
                        type="text" 
                        className="flex-1 bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full px-5 py-3 pr-16 transition-all"
                        placeholder="Type your question..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={loading}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="absolute right-2 top-1.5 bottom-1.5 aspect-square bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-slate-300 disabled:text-slate-500 transition-colors flex items-center justify-center shadow-sm"
                        aria-label="Send message"
                    >
                        <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};
