import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Badge } from '@/app/components/ui/badge';
import { useAI } from '@/app/contexts/AIContext';
import { processVoiceCommand } from '@/app/services/aiService';
import {
  MessageCircle,
  Send,
  Sparkles,
  Mic,
  MicOff,
  X,
  Bot,
  User,
  Lightbulb
} from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIChatAssistantProps {
  onNavigate?: (page: string) => void;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ onNavigate }) => {
  const { chatOpen, setChatOpen, voiceEnabled, setVoiceEnabled } = useAI();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI inventory assistant. I can help you with:\n\n• Checking stock levels\n• Finding products\n• Viewing alerts\n• Analytics and reports\n• Creating orders\n\nHow can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize speech recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Voice recognition failed');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleVoiceToggle = () => {
    if (!recognitionRef.current) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast.info('Listening...');
    }
  };

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    const lower = userMessage.toLowerCase();

    // Process voice command
    const command = await processVoiceCommand(userMessage);

    if (command.intent === 'view_inventory') {
      onNavigate?.('products');
      return 'Opening the inventory page for you. You can view all products and their stock levels there.';
    }

    if (command.intent === 'view_alerts') {
      onNavigate?.('low-stock-alerts');
      return 'Opening the low stock alerts page. Here you can see all products that need attention.';
    }

    if (command.intent === 'create_item') {
      return 'To add a new product, please navigate to the Products page and click the "Add Product" button.';
    }

    // Keyword-based responses
    if (lower.includes('stock') || lower.includes('inventory')) {
      return 'I can help you check stock levels. Would you like to:\n\n• View all products\n• Check low stock alerts\n• See stock adjustments\n• View warehouse locations';
    }

    if (lower.includes('report') || lower.includes('analytics')) {
      onNavigate?.('analytics');
      return 'Opening the analytics dashboard. You\'ll find comprehensive reports and insights there.';
    }

    if (lower.includes('order') || lower.includes('purchase')) {
      onNavigate?.('purchase-orders');
      return 'Opening the purchase orders page. You can create new orders and track existing ones there.';
    }

    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return 'Hello! How can I assist you with your inventory management today?';
    }

    if (lower.includes('help')) {
      return 'I can help you with:\n\n• Checking stock levels and inventory\n• Creating and managing orders\n• Viewing analytics and reports\n• Managing suppliers and customers\n• Tracking shipments\n• Low stock alerts\n\nWhat would you like to do?';
    }

    return 'I\'m here to help! Could you please provide more details about what you need? You can ask me about stock levels, orders, reports, or any inventory-related tasks.';
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate AI response
    const response = await generateAIResponse(text);

    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsProcessing(false);
  };

  const quickActions = [
    { label: 'Show low stock', action: 'show me low stock items' },
    { label: 'View analytics', action: 'show analytics' },
    { label: 'Recent orders', action: 'show recent orders' },
    { label: 'Help', action: 'help' },
  ];

  if (!chatOpen) {
    return (
      <Button
        onClick={() => setChatOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            AI Assistant
            <Badge variant="secondary" className="gap-1 ml-1">
              <Sparkles className="w-3 h-3" />
              Beta
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleVoiceToggle}
              className={`h-8 w-8 p-0 ${isListening ? 'text-red-500 animate-pulse' : ''}`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChatOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4 flex flex-col overflow-hidden">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                )}
                <div
                  className={`px-4 py-2 rounded-lg max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
              </div>
            ))}
            {isProcessing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Quick Actions */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="text-xs text-slate-500">Quick actions:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 text-xs"
                onClick={() => handleSendMessage(action.action)}
              >
                {action.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder={isListening ? 'Listening...' : 'Type your message...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={isListening || isProcessing}
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={!input.trim() || isProcessing}
            size="icon"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
