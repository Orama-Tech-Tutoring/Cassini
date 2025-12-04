import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, AlertCircle, X } from 'lucide-react';
import { sendMessageToGemini, GEMINI_API_KEY } from '../services/geminiService';
import MarkdownRenderer from './MarkdownRenderer';

const ChatSidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [messages, setMessages] = useState([
        { role: 'model', content: 'Hello! I am your AI assistant. How can I help you with your whiteboard today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setError(null);

        // Add user message
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await sendMessageToGemini(userMessage, messages);
            setMessages(prev => [...prev, { role: 'model', content: response }]);
        } catch (err) {
            console.error(err);
            let errorMessage = `Error: ${err.message}`;

            // Try to fetch available models if it's a 404 or related error
            if (err.message.includes('not found') || err.message.includes('404')) {
                try {
                    const { getAvailableModels } = await import('../services/geminiService');
                    const models = await getAvailableModels();
                    errorMessage += `\n\nAvailable models for your key:\n${models.join('\n')}`;
                } catch (modelErr) {
                    errorMessage += `\n\nCould not list models: ${modelErr.message}`;
                }
            }

            setError(errorMessage);
            setMessages(prev => [...prev, {
                role: 'model',
                content: errorMessage,
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="glass-button"
                style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}
            >
                <Bot size={24} />
            </button>
        );
    }

    return (
        <div className="glass" style={{
            position: 'absolute',
            top: 20,
            right: 20,
            bottom: 20,
            width: '350px',
            borderRadius: 'var(--radius-xl)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000,
            overflow: 'hidden',
            transition: 'all 0.3s ease'
        }}>
            {/* Header */}
            <div style={{
                padding: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bot size={20} className="text-accent-blue" />
                    <span style={{ fontWeight: 600 }}>Gemini Assistant</span>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="glass-button"
                    style={{ padding: '4px', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <X size={16} />
                </button>
            </div>

            {/* Messages */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
            }}>
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        style={{
                            display: 'flex',
                            gap: '8px',
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '85%'
                        }}
                    >
                        {msg.role === 'model' && (
                            <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: 'rgba(255, 255, 255, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <Bot size={16} />
                            </div>
                        )}
                        <div style={{
                            padding: '10px 14px',
                            borderRadius: '16px',
                            background: msg.role === 'user'
                                ? 'var(--accent-blue)'
                                : msg.isError
                                    ? 'rgba(255, 59, 48, 0.1)'
                                    : 'rgba(255, 255, 255, 0.05)',
                            border: msg.isError ? '1px solid rgba(255, 59, 48, 0.3)' : 'none',
                            color: msg.role === 'user' ? 'white' : 'rgba(255, 255, 255, 0.9)',
                            fontSize: '14px',
                            lineHeight: '1.4',
                            borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                            borderBottomLeftRadius: msg.role === 'model' ? '4px' : '16px'
                        }}>
                            {msg.role === 'model' ? (
                                <MarkdownRenderer content={msg.content} />
                            ) : (
                                msg.content
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: '36px' }}>
                        <div className="loading-dot" style={{ animationDelay: '0s' }} />
                        <div className="loading-dot" style={{ animationDelay: '0.2s' }} />
                        <div className="loading-dot" style={{ animationDelay: '0.4s' }} />
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* API Key Warning */}
            {GEMINI_API_KEY === 'INSERT_YOUR_KEY_HERE' && (
                <div style={{
                    padding: '8px 16px',
                    background: 'rgba(255, 149, 0, 0.1)',
                    borderTop: '1px solid rgba(255, 149, 0, 0.2)',
                    fontSize: '12px',
                    color: '#FF9500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <AlertCircle size={14} />
                    <span>API Key not configured in code</span>
                </div>
            )}

            {/* Input */}
            <div style={{
                padding: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                gap: '8px'
            }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask Gemini..."
                    style={{
                        flex: 1,
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '20px',
                        padding: '10px 16px',
                        color: 'white',
                        outline: 'none',
                        fontSize: '14px'
                    }}
                />
                <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="glass-button"
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: (isLoading || !input.trim()) ? 0.5 : 1,
                        cursor: (isLoading || !input.trim()) ? 'not-allowed' : 'pointer'
                    }}
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};

export default ChatSidebar;
