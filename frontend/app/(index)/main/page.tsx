'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Settings, History, Plus, Copy, ThumbsUp, ThumbsDown, MoreVertical, ArrowLeft, Link as LinkIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function Main() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your TubeIQ AI assistant. I can summarize YouTube videos and answer questions about their content using semantic search. Paste a YouTube URL below to get started!',
      role: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasVideoSummary, setHasVideoSummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleProcessVideo = async () => {
    if (!youtubeUrl.trim()) return;

    setIsProcessing(true);
    const processingMessage: Message = {
      id: Date.now().toString(),
      content: '🔄 Processing YouTube video... Extracting transcript and generating AI summary...',
      role: 'assistant',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, processingMessage]);

    try {
      // Send request to backend
      const response = await fetch('http://127.0.0.1:8000/process_video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          video_id: 'auto',
          video_url: youtubeUrl
        }),
      });

      const data = await response.json();
      
      // Remove processing message and add summary
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== processingMessage.id);
        return [...filtered, {
          id: (Date.now() + 1).toString(),
          content: `📹 **Video Summary Generated!**\n\n${data.summary || 'Summary generated successfully. You can now ask questions about this video!'}`,
          role: 'assistant',
          timestamp: new Date()
        }];
      });
      
      setHasVideoSummary(true);
      setYoutubeUrl('');
    } catch (error) {
      console.error('Error processing video:', error);
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== processingMessage.id);
        return [...filtered, {
          id: (Date.now() + 1).toString(),
          content: '❌ Error processing video. Please check the URL and try again.',
          role: 'assistant',
          timestamp: new Date()
        }];
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // Send chat request to backend
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: 'session1',
          query: input
        }),
      });

      const data = await response.json();
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'I apologize, but I couldn\'t process your request. Please try again.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I apologize, but I\'m having trouble connecting to the AI service. Please try again later.',
        role: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <SignedOut>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome to TubeIQ</h2>
            <p className="text-gray-600 mb-6">Sign in to start summarizing YouTube videos and asking questions</p>
            <SignInButton mode="modal">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Sign In to Continue
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>
      
      <SignedIn>
      {/* Sidebar */}
      <div className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col">
        <div className="p-4 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Home</span>
          </Link>
          <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <Plus className="w-5 h-5" />
            New Chat
          </button>
        </div>
        
        {/* <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Recent Chats
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                <div className="text-sm font-medium text-gray-900 truncate">
                  Video Summary {i}
                </div>
                <div className="text-xs text-gray-500">
                  {i} hour{i > 1 ? 's' : ''} ago
                </div>
              </div>
            ))}
          </div>
        </div> */}

        <div className="p-4 border-t border-gray-200">
          <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Settings</span>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-base md:text-lg font-semibold text-gray-900">TubeIQ Assistant</h1>
                <p className="text-xs md:text-sm text-gray-500 hidden sm:block">AI-powered video understanding & Q&A</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <History className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
              </button>
              <SignedIn>
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8"
                    }
                  }}
                />
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <User className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 message-enter ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              
              <div
                className={`max-w-xs sm:max-w-md md:max-w-2xl px-3 md:px-4 py-2 md:py-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-xs ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => copyToClipboard(message.content)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Copy className="w-3 h-3 text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <ThumbsUp className="w-3 h-3 text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <ThumbsDown className="w-3 h-3 text-gray-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-1">
                  <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* YouTube URL Input */}
        {!hasVideoSummary && (
          <div className="bg-blue-50 border-t border-blue-200 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📹 Summarize YouTube Video</h3>
                <p className="text-sm text-gray-600">Paste a YouTube URL to get AI-powered video summarization and understanding</p>
              </div>
              <div className="flex gap-2 md:gap-3">
                <div className="flex-1 relative">
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  />
                  <LinkIcon className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <button
                  onClick={handleProcessVideo}
                  disabled={!youtubeUrl.trim() || isProcessing}
                  className="px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Bot className="w-4 h-4" />
                      Analyze
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chat Input Area */}
        <div className="bg-white border-t border-gray-200 p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2 md:gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={hasVideoSummary ? "Ask questions about the video content using natural language..." : "Paste a YouTube URL above to get started..."}
                  className="w-full px-3 md:px-4 py-2 md:py-3 pr-10 md:pr-12 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  rows={1}
                  disabled={!hasVideoSummary}
                  style={{
                    minHeight: '40px',
                    maxHeight: '120px',
                    height: 'auto'
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                  }}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || !hasVideoSummary}
                className="px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1 md:gap-2 text-sm md:text-base"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
            <div className="mt-2 md:mt-3 text-xs text-gray-500 text-center">
              {hasVideoSummary ? "Press Enter to send, Shift+Enter for new line" : "Summarize a YouTube video first to start asking questions"}
            </div>
          </div>
        </div>
      </div>
      </SignedIn>
    </div>
  );
}
