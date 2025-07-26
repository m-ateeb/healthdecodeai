import { useState, useEffect, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface ChatSession {
  sessionId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  createNewSession: () => string;
  loadSessions: () => Promise<void>;
  clearError: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate unique session ID
  const generateSessionId = useCallback(() => {
    return `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Create new chat session
  const createNewSession = useCallback(() => {
    const sessionId = generateSessionId();
    setCurrentSessionId(sessionId);
    setMessages([]);
    setError(null);
    return sessionId;
  }, [generateSessionId]);

  // Load chat sessions
  const loadSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/ai/chat');
      
      if (!response.ok) {
        throw new Error('Failed to load sessions');
      }

      const data = await response.json();
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sessions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load specific chat session
  const loadSession = useCallback(async (sessionId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/ai/chat?sessionId=${sessionId}`);
      
      if (!response.ok) {
        throw new Error('Failed to load session');
      }

      const data = await response.json();
      if (data.success) {
        setCurrentSessionId(sessionId);
        setMessages(data.session.messages.map((msg: any, index: number) => ({
          id: `${sessionId}_${index}`,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          metadata: msg.metadata
        })));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isSending) return;

    // Ensure we have a session
    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = createNewSession();
    }

    // Add user message immediately
    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsSending(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content.trim(),
          sessionId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      if (data.success) {
        const assistantMessage: ChatMessage = {
          id: `assistant_${Date.now()}`,
          role: 'assistant',
          content: data.message.content,
          timestamp: new Date(data.message.timestamp),
          metadata: data.message.metadata
        };

        setMessages(prev => [...prev, assistantMessage]);
        
        // Update session ID if needed
        if (data.sessionId && data.sessionId !== currentSessionId) {
          setCurrentSessionId(data.sessionId);
        }
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      
      // Remove the user message if sending failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsSending(false);
    }
  }, [currentSessionId, isSending, createNewSession]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load sessions on mount
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  return {
    messages,
    sessions,
    currentSessionId,
    isLoading,
    isSending,
    error,
    sendMessage,
    loadSession,
    createNewSession,
    loadSessions,
    clearError
  };
}
