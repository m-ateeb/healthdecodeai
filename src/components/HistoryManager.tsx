'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useHistory } from '@/hooks/use-history';
import { MessageSquare, Calendar, Trash2, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface HistoryManagerProps {
  type: 'report' | 'medication';
  onSessionSelect?: (sessionId: string) => void;
}

export function HistoryManager({ type, onSessionSelect }: HistoryManagerProps) {
  const { 
    reportSessions, 
    medicationSessions, 
    isLoading, 
    error, 
    deleteSession, 
    clearHistory, 
    loadHistory,
    clearError
  } = useHistory();

  const sessions = type === 'report' ? reportSessions : medicationSessions;
  const title = type === 'report' ? 'Report Analysis History' : 'Medication History';
  const description = type === 'report' 
    ? 'Your previous medical report analyses' 
    : 'Your previous medication inquiries';

  const handleDeleteSession = async (sessionId: string) => {
    const success = await deleteSession(sessionId);
    if (success) {
      console.log(`Session ${sessionId} deleted successfully`);
    }
  };

  const handleClearAll = async () => {
    const success = await clearHistory(type);
    if (success) {
      console.log(`All ${type} history cleared successfully`);
    }
  };

  const handleRefresh = () => {
    loadHistory(type);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          {sessions.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear All {type === 'report' ? 'Report' : 'Medication'} History?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your {type} chat sessions. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearAll} className="bg-red-600 hover:bg-red-700">
                    Delete All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
            <Button variant="ghost" size="sm" onClick={clearError} className="mt-1">
              Dismiss
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading history...</span>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg mb-2">No {type} history yet</p>
            <p className="text-sm">
              Start a {type === 'report' ? 'report analysis' : 'medication inquiry'} to see your history here.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {sessions.map((session, index) => (
                <div key={session.sessionId}>
                  <div className="flex items-start justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="text-sm font-medium truncate">{session.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {session.messageCount} messages
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                        {session.lastMessage}
                      </p>
                      <div className="flex items-center text-xs text-gray-400">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(session.updatedAt, { addSuffix: true })}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-3">
                      {onSessionSelect && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSessionSelect(session.sessionId)}
                        >
                          Open
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Session?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the session "{session.title}". This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteSession(session.sessionId)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  {index < sessions.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
