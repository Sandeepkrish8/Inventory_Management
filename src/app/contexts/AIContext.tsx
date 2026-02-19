import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { websocketService, StockUpdate, Alert } from '@/app/services/websocketService';
import { PredictionResult, PricingSuggestion, ErrorDetection } from '@/app/services/aiService';

interface AIContextType {
  // Real-time updates
  recentStockUpdates: StockUpdate[];
  recentAlerts: Alert[];
  
  // AI Predictions
  predictions: PredictionResult[];
  setPredictions: (predictions: PredictionResult[]) => void;
  
  // Pricing suggestions
  pricingSuggestions: PricingSuggestion[];
  setPricingSuggestions: (suggestions: PricingSuggestion[]) => void;
  
  // Error detection
  detectedErrors: ErrorDetection[];
  setDetectedErrors: (errors: ErrorDetection[]) => void;
  
  // Voice/Chat
  voiceEnabled: boolean;
  setVoiceEnabled: (enabled: boolean) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  
  // AI Features toggle
  aiEnabled: boolean;
  setAiEnabled: (enabled: boolean) => void;
  
  // Clear functions
  clearAlerts: () => void;
  clearStockUpdates: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = () => {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within AIProvider');
  }
  return context;
};

interface AIProviderProps {
  children: ReactNode;
}

export const AIProvider: React.FC<AIProviderProps> = ({ children }) => {
  const [recentStockUpdates, setRecentStockUpdates] = useState<StockUpdate[]>([]);
  const [recentAlerts, setRecentAlerts] = useState<Alert[]>([]);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [pricingSuggestions, setPricingSuggestions] = useState<PricingSuggestion[]>([]);
  const [detectedErrors, setDetectedErrors] = useState<ErrorDetection[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!aiEnabled) return;

    websocketService.connect();

    // Subscribe to stock updates
    const unsubscribeStockUpdates = websocketService.onStockUpdate((update) => {
      setRecentStockUpdates((prev) => {
        const newUpdates = [update, ...prev].slice(0, 50); // Keep last 50 updates
        return newUpdates;
      });
    });

    // Subscribe to alerts
    const unsubscribeAlerts = websocketService.onAlert((alert) => {
      setRecentAlerts((prev) => {
        const newAlerts = [alert, ...prev].slice(0, 20); // Keep last 20 alerts
        return newAlerts;
      });
    });

    // Cleanup
    return () => {
      unsubscribeStockUpdates();
      unsubscribeAlerts();
      websocketService.disconnect();
    };
  }, [aiEnabled]);

  const clearAlerts = useCallback(() => {
    setRecentAlerts([]);
  }, []);

  const clearStockUpdates = useCallback(() => {
    setRecentStockUpdates([]);
  }, []);

  const value: AIContextType = {
    recentStockUpdates,
    recentAlerts,
    predictions,
    setPredictions,
    pricingSuggestions,
    setPricingSuggestions,
    detectedErrors,
    setDetectedErrors,
    voiceEnabled,
    setVoiceEnabled,
    chatOpen,
    setChatOpen,
    aiEnabled,
    setAiEnabled,
    clearAlerts,
    clearStockUpdates,
  };

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
};
