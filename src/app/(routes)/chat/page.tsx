
"use client";

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Paperclip, Mic, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'file' | 'analysis';
}

function ChatInterfaceContent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your HealthWise AI assistant. I can help you understand medical reports, check medication interactions, and answer health-related questions. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand you're asking about your medication. Let me analyze the information you've provided and check for any potential interactions.",
        "Based on your medical report, I can see several key findings. Let me break this down into simple terms for you.",
        "That's a great question about your health. Here's what the medical literature suggests about your condition:",
        "I've analyzed your lab results. Overall, most values appear to be within normal ranges, but there are a few areas we should discuss."
      ];
      
      const botResponse: Message = {
        id: messages.length + 2,
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16 h-screen flex flex-col">
        <div className="border-b bg-background/95 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-3 animate-fade-in">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">HealthWise AI Assistant</h1>
                <p className="text-sm text-muted-foreground">Online • Ready to help with your health questions</p>
              </div>
              <div className="ml-auto">
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  Active
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-3 animate-fade-in ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user'
                      ? 'bg-blue-500'
                      : 'bg-gradient-to-br from-purple-500 to-blue-500'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 text-white" />
                    )}
                  </div>
                  
                  <div className={`flex-1 max-w-3xl ${
                    message.sender === 'user' ? 'text-right' : ''
                  }`}>
                    <Card className={`${
                      message.sender === 'user'
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-card'
                    }`}>
                      <CardContent className="p-4">
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p className={`text-xs mt-2 opacity-70 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-muted-foreground'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex items-start space-x-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t bg-background/95 backdrop-blur-lg">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-end space-x-3">
              <Button variant="outline" size="sm" className="mb-2">
                <Paperclip className="h-4 w-4" />
              </Button>
              
              <div className="flex-1">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about your health, medications, or upload a medical report..."
                  className="min-h-[50px] resize-none rounded-xl border-2 focus:border-blue-500 transition-colors"
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={toggleRecording}
                className={`mb-2 ${isRecording ? 'bg-red-500 text-white hover:bg-red-600' : ''}`}
              >
                {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="mb-2 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2 text-center">
              HealthWise AI can make mistakes. Please verify important medical information with healthcare professionals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatInterface() {
  return (
    <ProtectedRoute>
      <ChatInterfaceContent />
    </ProtectedRoute>
  );
}
