/**
 * AI Service - Handles AI-powered features for inventory management
 * This service simulates AI predictions and recommendations.
 * In production, these would call actual AI/ML backend services.
 */

import { Product } from '@/app/types';

export interface PredictionResult {
  productId: string;
  productName: string;
  currentStock: number;
  predictedDemand: number;
  recommendedOrderQuantity: number;
  confidence: number;
  daysUntilStockout?: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface PricingSuggestion {
  productId: string;
  currentPrice: number;
  suggestedPrice: number;
  reason: string;
  expectedImpact: {
    salesIncrease?: number;
    profitIncrease?: number;
  };
}

export interface ErrorDetection {
  id: string;
  type: 'stock_mismatch' | 'pricing_anomaly' | 'demand_spike' | 'data_inconsistency';
  severity: 'low' | 'medium' | 'high' | 'critical';
  productId: string;
  productName: string;
  message: string;
  suggestedAction: string;
  detectedAt: string;
}

export interface ProductRecommendation {
  productId: string;
  productName: string;
  reason: string;
  relevanceScore: number;
  imageUrl?: string;
}

/**
 * Predict demand for products using AI (simulated)
 */
export const predictDemand = async (products: Product[]): Promise<PredictionResult[]> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 800));

  return products.map(product => {
    // Simulate ML prediction with some randomness
    const baselineDemand = product.quantity * 0.15;
    const seasonalFactor = Math.random() * 0.5 + 0.75; // 0.75 - 1.25
    const trendFactor = Math.random() * 0.3 + 0.85; // 0.85 - 1.15
    
    const predictedDemand = Math.round(baselineDemand * seasonalFactor * trendFactor);
    const daysOfStock = product.quantity / (predictedDemand / 30);
    
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (trendFactor > 1.05) trend = 'increasing';
    else if (trendFactor < 0.95) trend = 'decreasing';

    return {
      productId: product.id,
      productName: product.name,
      currentStock: product.quantity,
      predictedDemand,
      recommendedOrderQuantity: Math.max(0, predictedDemand - product.quantity + product.minStockLevel),
      confidence: Math.random() * 0.2 + 0.75, // 75-95% confidence
      daysUntilStockout: daysOfStock < 60 ? Math.round(daysOfStock) : undefined,
      trend,
    };
  });
};

/**
 * Get dynamic pricing suggestions using AI
 */
export const getDynamicPricing = async (products: Product[]): Promise<PricingSuggestion[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  return products.slice(0, 10).map(product => {
    const currentPrice = product.price;
    const stockRatio = product.quantity / product.minStockLevel;
    
    let priceAdjustment = 1.0;
    let reason = '';
    
    if (stockRatio < 0.5) {
      // Low stock - increase price
      priceAdjustment = 1.05 + Math.random() * 0.1; // 5-15% increase
      reason = 'Low stock detected. Price increase recommended to maximize profit.';
    } else if (stockRatio > 3) {
      // Excess stock - decrease price
      priceAdjustment = 0.85 + Math.random() * 0.1; // 10-15% decrease
      reason = 'Excess inventory. Price reduction recommended to move stock.';
    } else {
      // Optimal pricing based on demand
      priceAdjustment = 0.95 + Math.random() * 0.1; // -5% to +5%
      reason = 'Optimized for current market demand and stock levels.';
    }

    const suggestedPrice = Math.round(currentPrice * priceAdjustment * 100) / 100;
    const priceDiff = ((suggestedPrice - currentPrice) / currentPrice) * 100;

    return {
      productId: product.id,
      currentPrice,
      suggestedPrice,
      reason,
      expectedImpact: {
        salesIncrease: priceDiff < 0 ? Math.abs(priceDiff) * 2 : undefined,
        profitIncrease: priceDiff > 0 ? priceDiff * 0.8 : undefined,
      },
    };
  });
};

/**
 * Detect errors and anomalies in inventory data
 */
export const detectErrors = async (products: Product[]): Promise<ErrorDetection[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const errors: ErrorDetection[] = [];
  const now = new Date().toISOString();

  products.forEach(product => {
    // Check for stock mismatches
    if (product.quantity < 0) {
      errors.push({
        id: `err-${product.id}-1`,
        type: 'stock_mismatch',
        severity: 'critical',
        productId: product.id,
        productName: product.name,
        message: `Negative stock detected: ${product.quantity} units`,
        suggestedAction: 'Review recent transactions and correct stock level.',
        detectedAt: now,
      });
    }

    // Check for low stock without alerts
    if (product.quantity < product.minStockLevel * 0.3) {
      errors.push({
        id: `err-${product.id}-2`,
        type: 'stock_mismatch',
        severity: 'high',
        productId: product.id,
        productName: product.name,
        message: `Critically low stock: ${product.quantity} units (${Math.round((product.quantity / product.minStockLevel) * 100)}% of minimum)`,
        suggestedAction: 'Create purchase order immediately.',
        detectedAt: now,
      });
    }

    // Check for pricing anomalies
    if (product.price < product.cost * 1.1) {
      errors.push({
        id: `err-${product.id}-3`,
        type: 'pricing_anomaly',
        severity: 'medium',
        productId: product.id,
        productName: product.name,
        message: `Low profit margin: ${Math.round(((product.price - product.cost) / product.cost) * 100)}%`,
        suggestedAction: 'Review pricing strategy to ensure profitability.',
        detectedAt: now,
      });
    }
  });

  return errors;
};

/**
 * Get personalized product recommendations
 */
export const getRecommendations = async (
  currentProductId: string,
  allProducts: Product[],
  userHistory?: string[]
): Promise<ProductRecommendation[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  const currentProduct = allProducts.find(p => p.id === currentProductId);
  if (!currentProduct) return [];

  // Find related products (same category or complementary)
  const recommendations = allProducts
    .filter(p => p.id !== currentProductId && p.categoryId === currentProduct.categoryId)
    .slice(0, 5)
    .map(product => ({
      productId: product.id,
      productName: product.name,
      reason: `Frequently bought with ${currentProduct.name}`,
      relevanceScore: Math.random() * 0.3 + 0.7, // 70-100%
      imageUrl: product.imageUrl,
    }));

  return recommendations;
};

/**
 * Automatically categorize products using AI
 */
export const autoCategorizepro = async (
  productName: string,
  productDescription?: string
): Promise<{
  suggestedCategory: string;
  confidence: number;
  tags: string[];
}> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  // Simple NLP simulation
  const keywords = (productName + ' ' + (productDescription || '')).toLowerCase();
  
  let category = 'General';
  let tags: string[] = [];
  let confidence = 0.7;

  if (keywords.includes('laptop') || keywords.includes('computer') || keywords.includes('phone')) {
    category = 'Electronics';
    tags = ['tech', 'device'];
    confidence = 0.92;
  } else if (keywords.includes('shirt') || keywords.includes('pants') || keywords.includes('jacket')) {
    category = 'Clothing';
    tags = ['apparel', 'wear'];
    confidence = 0.88;
  } else if (keywords.includes('pen') || keywords.includes('notebook') || keywords.includes('paper')) {
    category = 'Stationery';
    tags = ['office', 'supplies'];
    confidence = 0.85;
  } else if (keywords.includes('chair') || keywords.includes('desk') || keywords.includes('table')) {
    category = 'Furniture';
    tags = ['office', 'home'];
    confidence = 0.90;
  }

  return { suggestedCategory: category, confidence, tags };
};

/**
 * Smart search with AI-powered suggestions
 */
export const smartSearch = async (
  query: string,
  products: Product[],
  searchHistory?: string[]
): Promise<{
  results: Product[];
  suggestions: string[];
  didYouMean?: string;
}> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  const lowerQuery = query.toLowerCase().trim();
  
  // Fuzzy search simulation
  const results = products.filter(product => {
    const searchText = `${product.name} ${product.sku} ${product.category}`.toLowerCase();
    return searchText.includes(lowerQuery);
  });

  // Generate suggestions based on search history and popular items
  const suggestions = [
    'wireless mouse',
    'office chair',
    'laptop stand',
    'notebook',
    'usb cable',
  ].filter(s => s.includes(lowerQuery) && s !== lowerQuery);

  // Simulate typo correction
  let didYouMean: string | undefined;
  if (results.length === 0 && lowerQuery.length > 3) {
    const commonCorrections: Record<string, string> = {
      'compter': 'computer',
      'notbook': 'notebook',
      'chiar': 'chair',
    };
    didYouMean = commonCorrections[lowerQuery];
  }

  return { results, suggestions, didYouMean };
};

/**
 * Voice command processing (simulated)
 */
export const processVoiceCommand = async (
  transcript: string
): Promise<{
  intent: string;
  action: string;
  parameters: Record<string, any>;
  confidence: number;
}> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const lower = transcript.toLowerCase();
  
  // Simple intent recognition
  if (lower.includes('show') || lower.includes('display')) {
    if (lower.includes('stock') || lower.includes('inventory')) {
      return {
        intent: 'view_inventory',
        action: 'navigate',
        parameters: { page: 'products' },
        confidence: 0.9,
      };
    }
  }
  
  if (lower.includes('low stock') || lower.includes('alert')) {
    return {
      intent: 'view_alerts',
      action: 'navigate',
      parameters: { page: 'low-stock-alerts' },
      confidence: 0.85,
    };
  }

  if (lower.includes('add') || lower.includes('create')) {
    return {
      intent: 'create_item',
      action: 'open_dialog',
      parameters: { dialog: 'add_product' },
      confidence: 0.8,
    };
  }

  return {
    intent: 'unknown',
    action: 'none',
    parameters: {},
    confidence: 0.3,
  };
};
