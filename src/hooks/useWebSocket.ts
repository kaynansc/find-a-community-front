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
  onClose?: () => void;
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
  const websocketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    try {
      websocketRef.current = new WebSocket(url);

      websocketRef.current.onopen = () => {
        setIsConnected(true);
        setConnectionError(null);
        onOpen?.();
      };

      websocketRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          onMessage?.(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      websocketRef.current.onclose = () => {
        setIsConnected(false);
        onClose?.();
      };

      websocketRef.current.onerror = (error) => {
        setConnectionError('WebSocket connection error');
        onError?.(error);
      };
    } catch (error) {
      setConnectionError('Failed to create WebSocket connection');
    }
  }, [url, onMessage, onOpen, onClose, onError]);

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
    sendMessage,
    connect,
    disconnect,
  };
};