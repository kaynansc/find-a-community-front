import { useState, useEffect, useRef, useCallback } from 'react';

interface Message {
  id: string;
  message: string;
  sender: {
    id: string;
    name: string;
  };
  timestamp: string;
}

interface UseWebSocketProps {
  url: string;
  onMessage?: (message: Message) => void;
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (error: Event) => void;
}

export const useWebSocket = ({
  url,
  onMessage,
  onOpen,
  onClose,
  onError,
}: UseWebSocketProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const websocketRef = useRef<WebSocket | null>(null);

  // Use refs to store callbacks to avoid reconnection loops
  const callbacksRef = useRef({ onMessage, onOpen, onClose, onError });
  callbacksRef.current = { onMessage, onOpen, onClose, onError };

  const connect = useCallback(() => {
    try {
      websocketRef.current = new WebSocket(url);

      websocketRef.current.onopen = () => {
        setIsConnected(true);
        setConnectionError(null);
        setAccessDenied(false);
        callbacksRef.current.onOpen?.();
      };

      websocketRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          callbacksRef.current.onMessage?.(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      websocketRef.current.onclose = (event) => {
        setIsConnected(false);
        
        // Handle specific close codes for validation errors
        if (event.code === 1008) {
          setConnectionError('Community not found');
          setAccessDenied(true);
        } else if (event.code === 1003) {
          setConnectionError('You must be a member to access the chat');
          setAccessDenied(true);
        }
        
        callbacksRef.current.onClose?.(event);
      };

      websocketRef.current.onerror = (error) => {
        setConnectionError('WebSocket connection error');
        callbacksRef.current.onError?.(error);
      };
    } catch (error) {
      setConnectionError('Failed to create WebSocket connection');
    }
  }, [url]);

  const disconnect = useCallback(() => {
    if (websocketRef.current) {
      websocketRef.current.close();
      websocketRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify({ message }));
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  return {
    isConnected,
    connectionError,
    accessDenied,
    sendMessage,
    connect,
    disconnect,
  };
};