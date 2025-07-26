'use client';

import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface HistorySession {
  sessionId: string;
  title: string;
  type: 'report' | 'medication';
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  lastMessage: string;
}

export interface HistoryState {
  reportSessions: HistorySession[];
  medicationSessions: HistorySession[];
  isLoading: boolean;
  error: string | null;
}

export function useHistory() {
  const { user } = useAuth();
  const [state, setState] = useState<HistoryState>({
    reportSessions: [],
    medicationSessions: [],
    isLoading: false,
    error: null
  });

  // Load history for specific type
  const loadHistory = useCallback(async (type?: 'report' | 'medication') => {
    if (!user) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const url = type ? `/api/ai/history?type=${type}` : '/api/ai/history';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to load history');
      }
      
      const data = await response.json();
      if (data.success && data.sessions) {
        const sessions: HistorySession[] = data.sessions.map((session: any) => ({
          sessionId: session.sessionId,
          title: session.title,
          type: session.type || 'report',
          createdAt: new Date(session.createdAt),
          updatedAt: new Date(session.updatedAt),
          messageCount: session.messageCount,
          lastMessage: session.lastMessage
        }));

        if (type) {
          setState(prev => ({
            ...prev,
            [type === 'report' ? 'reportSessions' : 'medicationSessions']: sessions,
            isLoading: false
          }));
        } else {
          // Split sessions by type
          const reportSessions = sessions.filter(s => s.type === 'report');
          const medicationSessions = sessions.filter(s => s.type === 'medication');
          
          setState(prev => ({
            ...prev,
            reportSessions,
            medicationSessions,
            isLoading: false
          }));
        }
      }
    } catch (error) {
      console.error('Error loading history:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to load history',
        isLoading: false
      }));
    }
  }, [user]);

  // Delete specific session
  const deleteSession = useCallback(async (sessionId: string) => {
    if (!user) return false;

    try {
      const response = await fetch(`/api/ai/history?sessionId=${sessionId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete session');
      }

      const data = await response.json();
      if (data.success) {
        // Remove from state
        setState(prev => ({
          ...prev,
          reportSessions: prev.reportSessions.filter(s => s.sessionId !== sessionId),
          medicationSessions: prev.medicationSessions.filter(s => s.sessionId !== sessionId)
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting session:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to delete session'
      }));
      return false;
    }
  }, [user]);

  // Clear all sessions of specific type
  const clearHistory = useCallback(async (type: 'report' | 'medication') => {
    if (!user) return false;

    try {
      const response = await fetch(`/api/ai/history?type=${type}&action=clear`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(`Failed to clear ${type} history`);
      }

      const data = await response.json();
      if (data.success) {
        // Clear from state
        setState(prev => ({
          ...prev,
          [type === 'report' ? 'reportSessions' : 'medicationSessions']: []
        }));
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error clearing ${type} history:`, error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : `Failed to clear ${type} history`
      }));
      return false;
    }
  }, [user]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Load all history on mount
  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user, loadHistory]);

  return {
    // State
    reportSessions: state.reportSessions,
    medicationSessions: state.medicationSessions,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    loadHistory,
    deleteSession,
    clearHistory,
    clearError
  };
}
