import React, { useState, useRef, useEffect } from 'react';
import { FiMessageSquare, FiX, FiSend, FiMinimize2, FiMaximize2, FiCpu, FiTrash2 } from 'react-icons/fi';
import { askAI } from '../../api/endpoint';
import { toast } from 'react-hot-toast';

const AIAssistantButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const chatWindowRef = useRef(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when chat opens
    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen, isMinimized]);

    // Click outside to close (optional)
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatWindowRef.current && !chatWindowRef.current.contains(event.target) && 
                !event.target.closest('button')?.classList.contains('ai-toggle-btn')) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');
        
        setMessages(prev => [...prev, { 
            role: 'user', 
            content: userMessage,
            timestamp: new Date().toISOString()
        }]);

        setIsLoading(true);

        try {
            const context = getCurrentContext();
            
            const response = await askAI({ 
                message: userMessage,
                context: context
            });

            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: response.data.response,
                timestamp: response.data.timestamp,
                isFallback: response.data.isFallback
            }]);

        } catch (error) {
            console.error('AI Error:', error);
            toast.error('Failed to get response');
            
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: "I'm having trouble connecting. Please try again.",
                timestamp: new Date().toISOString(),
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const getCurrentContext = () => {
        const path = window.location.pathname;
        if (path.includes('/student/articles/')) return 'Reading an article';
        if (path.includes('/student/dashboard')) return 'Viewing dashboard';
        if (path.includes('/student/articles')) return 'Browsing articles';
        return 'Using learning platform';
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const clearChat = () => {
        if (messages.length > 0) {
            setMessages([]);
            toast.success('Chat cleared');
        }
    };

    return (
        <>
            {/* Toggle Button - Smaller and more refined */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`ai-toggle-btn fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 ${
                    isOpen 
                        ? 'bg-red-500 rotate-90 shadow-red-500/20' 
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-indigo-500/30'
                }`}
                aria-label="Toggle AI Assistant"
            >
                {isOpen ? (
                    <FiX className="text-white text-xl" />
                ) : (
                    <FiMessageSquare className="text-white text-xl" />
                )}
            </button>

            {/* Chat Window - Optimized dimensions */}
            {isOpen && (
                <div
                    ref={chatWindowRef}
                    className={`fixed bottom-20 right-4 z-50 bg-gray-900/95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-800 transition-all duration-300 ${
                        isMinimized 
                            ? 'w-64 h-12' 
                            : 'w-80 sm:w-96 h-[480px] max-h-[80vh]'
                    }`}
                >
                    {/* Header - Compact */}
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-t-lg">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-indigo-500/20 rounded-md">
                                <FiCpu className="text-indigo-400 text-sm" />
                            </div>
                            <div>
                                <h3 className="text-white text-sm font-medium leading-tight">AI Assistant</h3>
                                <p className="text-[10px] text-gray-500 leading-tight">Powered by Cohere</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                                aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                            >
                                {isMinimized ? <FiMaximize2 size={14} /> : <FiMinimize2 size={14} />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                                aria-label="Close"
                            >
                                <FiX size={14} />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Messages Area - Custom scrollbar */}
                            <div className="h-[340px] overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800/50 hover:scrollbar-thumb-gray-600">
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center px-4">
                                        <FiCpu className="text-3xl mb-2 text-indigo-500/30" />
                                        <p className="text-gray-300 text-sm font-medium mb-1">AI Learning Assistant</p>
                                        <p className="text-gray-500 text-xs max-w-[200px]">
                                            Ask me about your courses, articles, or get study tips!
                                        </p>
                                        <div className="mt-3 flex gap-2">
                                            <button
                                                onClick={() => setInputMessage("Study tips")}
                                                className="text-[10px] px-2 py-1 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition-colors border border-gray-700"
                                            >
                                                Study tips
                                            </button>
                                            <button
                                                onClick={() => setInputMessage("Summarize this")}
                                                className="text-[10px] px-2 py-1 bg-gray-800 text-gray-300 rounded-full hover:bg-gray-700 transition-colors border border-gray-700"
                                            >
                                                Summarize
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[85%] p-2.5 rounded-lg ${
                                                    msg.role === 'user'
                                                        ? 'bg-indigo-600 text-white rounded-br-none'
                                                        : msg.isError
                                                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                        : 'bg-gray-800/80 text-gray-200 rounded-bl-none border border-gray-700/50'
                                                }`}
                                            >
                                                <p className="text-xs leading-relaxed whitespace-pre-wrap break-words">
                                                    {msg.content}
                                                </p>
                                                <p className="text-[10px] mt-1 opacity-50 flex items-center gap-1">
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { 
                                                        hour: '2-digit', 
                                                        minute: '2-digit' 
                                                    })}
                                                    {msg.isFallback && (
                                                        <span className="text-yellow-500/70">(offline)</span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-800/80 text-gray-200 p-3 rounded-lg rounded-bl-none border border-gray-700/50">
                                            <div className="flex gap-1">
                                                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area - Compact */}
                            <div className="p-3 border-t border-gray-800 bg-gray-900/50">
                                <div className="flex gap-2">
                                    <textarea
                                        ref={inputRef}
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Ask anything..."
                                        className="flex-1 px-3 py-2 bg-gray-800/80 border border-gray-700 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none placeholder-gray-500 text-xs"
                                        rows="1"
                                        disabled={isLoading}
                                        style={{ maxHeight: '80px' }}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={isLoading || !inputMessage.trim()}
                                        className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
                                        aria-label="Send message"
                                    >
                                        <FiSend size={16} />
                                    </button>
                                </div>
                                {messages.length > 0 && (
                                    <div className="flex justify-end mt-1.5">
                                        <button
                                            onClick={clearChat}
                                            className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors flex items-center gap-1"
                                        >
                                            <FiTrash2 size={10} />
                                            <span>Clear</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}

           
        </>
    );
};

export default AIAssistantButton;