import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './AIChatWidget.css';

const AIChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'system', content: 'Hi! I can help you with your schedule. Ask me anything!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post('http://138.197.192.172:8000/ai/chat',
                { message: userMsg },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
        } catch (error) {
            console.error("AI Chat Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't reach the server." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ai-chat-widget">
            {!isOpen && (
                <button className="ai-chat-toggle" onClick={() => setIsOpen(true)}>
                    🤖
                </button>
            )}

            {isOpen && (
                <div className="ai-chat-window">
                    <div className="ai-chat-header">
                        <span>Schedule Assistant</span>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                    </div>
                    <div className="ai-chat-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.role}`}>
                                {msg.content}
                            </div>
                        ))}
                        {isLoading && <div className="message assistant">Thinking...</div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className="ai-chat-input" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your classes..."
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading}>Send</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AIChatWidget;
