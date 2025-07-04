import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content?: string;
  message?: string;
  createdAt?: string;
  timestamp?: string;
  sender: {
    id: string;
    name: string;
  };
  senderId?: string;
}

interface CommunityChatProps {
  communityId: string;
}

export const CommunityChat = ({ communityId }: CommunityChatProps) => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Fetch old messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!token) return;
      
      try {
        const response = await fetch(`http://localhost:3000/api/communities/${communityId}/messages`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const oldMessages = await response.json();
          setMessages(oldMessages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [communityId, token]);

  // WebSocket connection
  const websocketUrl = `ws://localhost:3000?communityId=${communityId}&token=${token}`;
  
  const { isConnected, connectionError, accessDenied, sendMessage } = useWebSocket({
    url: websocketUrl,
    onMessage: (message) => {
      setMessages((prev) => [...prev, message]);
    },
    onError: () => {
      toast({
        title: "Connection Error",
        description: "Failed to connect to chat. Please refresh the page.",
        variant: "destructive",
      });
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !isConnected) return;

    const success = sendMessage(newMessage);
    if (success) {
      setNewMessage('');
    } else {
      toast({
        title: "Failed to send message",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (message: Message) => ({
    id: message.id,
    content: message.content || message.message || '',
    timestamp: message.createdAt || message.timestamp || new Date().toISOString(),
    sender: message.sender || { id: message.senderId || '', name: 'Unknown' },
  });

  if (!user || !token) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Sign in to join the community chat</p>
        </CardContent>
      </Card>
    );
  }

  // Don't show chat if access is denied
  if (accessDenied) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">{connectionError}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Community Chat
          {isConnected ? (
            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
              Online
            </span>
          ) : (
            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
              Offline
            </span>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {messages.map((msg) => {
                const formattedMsg = formatMessage(msg);
                const isOwnMessage = formattedMsg.sender.id === user.id;
                
                return (
                  <div
                    key={formattedMsg.id}
                    className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback>
                        {formattedMsg.sender.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`flex-1 ${isOwnMessage ? 'text-right' : ''}`}>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {isOwnMessage ? 'You' : formattedMsg.sender.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(formattedMsg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div
                        className={`inline-block p-3 rounded-lg max-w-[70%] ${
                          isOwnMessage
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {formattedMsg.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <div className="p-4 border-t">
          {connectionError && (
            <div className="text-xs text-red-500 mb-2">{connectionError}</div>
          )}
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={!isConnected}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !isConnected}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};