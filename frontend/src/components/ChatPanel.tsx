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
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md max-w-5xl mx-auto flex flex-col h-[500px]">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Ask DataLens</h2>
            <div className="flex-1 overflow-y-auto mb-4 border border-gray-200 rounded p-4 flex flex-col gap-3">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 my-auto">
                        Ask a question about your data!
                    </div>
                )}
                {messages.map(msg => (
                    <div key={msg.id} className={`max-w-[80%] p-3 rounded-lg ${msg.sender === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-100 text-gray-800 self-start'}`}>
                        {msg.text}
                    </div>
                ))}
                {loading && (
                    <div className="bg-gray-100 text-gray-800 self-start max-w-[80%] p-3 rounded-lg italic">
                        Thinking...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
                    placeholder="Ask a question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                />
                <button 
                    onClick={handleSend}
                    disabled={loading || !input.trim()}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                >
                    Send
                </button>
            </div>
        </div>
    );
};
