'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    model?: string;
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  };
}

export interface ChatSession {
  sessionId: string;
  title: string;
  type: 'report' | 'medication';
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface DashboardChatState {
  sessions: ChatSession[];
  currentReportSession: string | null;
  currentMedicationSession: string | null;
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
}

export function useDashboardChat() {
  const { user } = useAuth();
  const [state, setState] = useState<DashboardChatState>({
    sessions: [],
    currentReportSession: null,
    currentMedicationSession: null,
    isLoading: false,
    isSending: false,
    error: null
  });

  // Use ref to access current state in callbacks
  const stateRef = useRef(state);
  stateRef.current = state;

  // Load chat sessions from API
  const loadSessions = useCallback(async () => {
    if (!user) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await fetch('/api/ai/chat');
      if (!response.ok) {
        throw new Error('Failed to load chat sessions');
      }
      
      const data = await response.json();
      if (data.success && data.sessions) {
        // Transform API data to our session format
        const transformedSessions: ChatSession[] = data.sessions.map((session: any) => ({
          sessionId: session.sessionId,
          title: session.title,
          type: session.type || (session.sessionId?.includes('medication') ? 'medication' : 'report'), // Better fallback type detection
          messages: [],
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          isActive: true
        }));
        
        console.log('Loaded sessions with types:', transformedSessions.map(s => ({ 
          id: s.sessionId, 
          type: s.type, 
          title: s.title 
        })));
        
        setState(prev => ({ 
          ...prev, 
          sessions: transformedSessions, 
          isLoading: false 
        }));
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to load sessions',
        isLoading: false 
      }));
    }
  }, [user]);

  // Load specific session messages
  const loadSession = useCallback(async (sessionId: string) => {
    if (!user) return null;

    try {
      const response = await fetch(`/api/ai/chat?sessionId=${sessionId}`);
      if (!response.ok) {
        if (response.status === 404) {
          console.log(`Session ${sessionId} not found in database - this is normal for new sessions`);
          return null; // Don't throw error for 404, just return null
        }
        const errorText = await response.text();
        console.error('Session load failed:', response.status, errorText);
        throw new Error(`Failed to load session: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.success && data.session) {
        const session: ChatSession = {
          sessionId: data.session.sessionId,
          title: data.session.title,
          type: data.session.type || 'report', // Use actual type from API
          messages: data.session.messages.map((msg: any) => ({
            id: msg._id || Date.now().toString(),
            role: msg.role,
            content: msg.content,
            timestamp: new Date(msg.timestamp),
            metadata: msg.metadata
          })),
          createdAt: new Date(data.session.createdAt),
          updatedAt: new Date(data.session.updatedAt),
          isActive: true
        };

        // Update session in state
        setState(prev => ({
          ...prev,
          sessions: prev.sessions.map(s => 
            s.sessionId === sessionId ? session : s
          )
        }));

        return session;
      } else {
        throw new Error(data.error || 'Session data not found');
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        // Don't log 404 errors as they're expected for new sessions
        return null;
      }
      console.error('Error loading session:', error);
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to load session'
      }));
    }
    
    return null;
  }, [user]);

  // Create new session
  const createSession = useCallback((type: 'report' | 'medication'): string => {
    const sessionId = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newSession: ChatSession = {
      sessionId,
      title: type === 'report' ? 'Medical Report Analysis' : 'Medication Information Check',
      type,
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };

    setState(prev => ({
      ...prev,
      sessions: [newSession, ...prev.sessions],
      [type === 'report' ? 'currentReportSession' : 'currentMedicationSession']: sessionId
    }));

    return sessionId;
  }, []);

  // Send message
  const sendMessage = useCallback(async (sessionId: string, message: string) => {
    if (!user || !message.trim()) return;

    setState(prev => ({ ...prev, isSending: true, error: null }));

    try {
      // Get session type from current state
      const session = stateRef.current.sessions.find(s => s.sessionId === sessionId);
      const sessionType: 'report' | 'medication' = session?.type || (sessionId.includes('medication') ? 'medication' : 'report');
      
      console.log('sendMessage debug:', {
        sessionId,
        sessionFound: !!session,
        sessionType: session?.type,
        sessionIdContainsMedication: sessionId.includes('medication'),
        finalSessionType: sessionType
      });
      
      // Add user message immediately
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: message,
        timestamp: new Date()
      };

      setState(prev => ({
        ...prev,
        sessions: prev.sessions.map(s =>
          s.sessionId === sessionId
            ? {
                ...s,
                messages: [...s.messages, userMessage],
                updatedAt: new Date()
              }
            : s
        )
      }));

      // Send to API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message,
          type: sessionType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();
      if (data.success && data.message) {
        // Add AI response
        const aiMessage: ChatMessage = {
          id: data.message._id || `ai-${Date.now()}`,
          role: 'assistant',
          content: data.message.content,
          timestamp: new Date(data.message.timestamp),
          metadata: data.message.metadata
        };

        setState(prev => ({
          ...prev,
          sessions: prev.sessions.map(session =>
            session.sessionId === sessionId
              ? {
                  ...session,
                  messages: [...session.messages, aiMessage],
                  updatedAt: new Date()
                }
              : session
          ),
          isSending: false
        }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to send message',
        isSending: false
      }));
    }
  }, [user]);

  // Set active sessions
  const setCurrentReportSession = useCallback((sessionId: string | null) => {
    setState(prev => ({ ...prev, currentReportSession: sessionId }));
    // Only try to load the session if it's not already in our local state
    if (sessionId) {
      setState(prev => {
        const existingSession = prev.sessions.find(s => s.sessionId === sessionId);
        if (!existingSession || existingSession.messages.length === 0) {
          // Don't try to load new sessions from server yet - they don't exist until first message
          return prev;
        } else {
          // Load existing session with messages
          loadSession(sessionId);
          return prev;
        }
      });
    }
  }, [loadSession]);

  const setCurrentMedicationSession = useCallback((sessionId: string | null) => {
    setState(prev => ({ ...prev, currentMedicationSession: sessionId }));
    // Only try to load the session if it's not already in our local state
    if (sessionId) {
      setState(prev => {
        const existingSession = prev.sessions.find(s => s.sessionId === sessionId);
        if (!existingSession || existingSession.messages.length === 0) {
          // Don't try to load new sessions from server yet - they don't exist until first message
          return prev;
        } else {
          // Load existing session with messages
          loadSession(sessionId);
          return prev;
        }
      });
    }
  }, [loadSession]);

  // Get current sessions
  const getCurrentReportSession = useCallback(() => {
    return state.sessions.find(s => s.sessionId === state.currentReportSession);
  }, [state.sessions, state.currentReportSession]);

  const getCurrentMedicationSession = useCallback(() => {
    return state.sessions.find(s => s.sessionId === state.currentMedicationSession);
  }, [state.sessions, state.currentMedicationSession]);

  // Get sessions by type
  const getReportSessions = useCallback(() => {
    return state.sessions.filter(s => s.type === 'report');
  }, [state.sessions]);

  const getMedicationSessions = useCallback(() => {
    return state.sessions.filter(s => s.type === 'medication');
  }, [state.sessions]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Load sessions on mount
  useEffect(() => {
    if (user) {
      loadSessions();
    }
  }, [user, loadSessions]);

  return {
    // State
    sessions: state.sessions,
    currentReportSession: state.currentReportSession,
    currentMedicationSession: state.currentMedicationSession,
    isLoading: state.isLoading,
    isSending: state.isSending,
    error: state.error,

    // Actions
    createSession,
    sendMessage,
    loadSession,
    loadSessions,
    setCurrentReportSession,
    setCurrentMedicationSession,
    clearError,

    // Computed
    getCurrentReportSession,
    getCurrentMedicationSession,
    getReportSessions,
    getMedicationSessions
  };
}
