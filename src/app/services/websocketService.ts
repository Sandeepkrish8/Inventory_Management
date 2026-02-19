/**
 * WebSocket Service for Real-Time Updates
 * Simulates real-time stock updates using WebSocket-like events
 */

type StockUpdateCallback = (data: StockUpdate) => void;
type AlertCallback = (data: Alert) => void;

export interface StockUpdate {
  productId: string;
  productName: string;
  oldQuantity: number;
  newQuantity: number;
  changeType: 'sale' | 'restock' | 'adjustment' | 'return';
  timestamp: string;
  location?: string;
}

export interface Alert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'restock_needed' | 'expiry_warning';
  productId: string;
  productName: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

class WebSocketService {
  private stockUpdateCallbacks: Set<StockUpdateCallback> = new Set();
  private alertCallbacks: Set<AlertCallback> = new Set();
  private simulationInterval: NodeJS.Timeout | null = null;
  private isConnected: boolean = false;

  /**
   * Connect to WebSocket (simulated)
   */
  connect(): void {
    if (this.isConnected) return;

    console.log('WebSocket connected (simulated)');
    this.isConnected = true;

    // Simulate real-time updates every 5-15 seconds
    this.simulationInterval = setInterval(() => {
      this.simulateStockUpdate();
    }, Math.random() * 10000 + 5000); // 5-15 seconds
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    this.isConnected = false;
    console.log('WebSocket disconnected');
  }

  /**
   * Subscribe to stock updates
   */
  onStockUpdate(callback: StockUpdateCallback): () => void {
    this.stockUpdateCallbacks.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.stockUpdateCallbacks.delete(callback);
    };
  }

  /**
   * Subscribe to alerts
   */
  onAlert(callback: AlertCallback): () => void {
    this.alertCallbacks.add(callback);
    
    return () => {
      this.alertCallbacks.delete(callback);
    };
  }

  /**
   * Simulate a stock update event
   */
  private simulateStockUpdate(): void {
    const changeTypes: ('sale' | 'restock' | 'adjustment' | 'return')[] = 
      ['sale', 'restock', 'adjustment', 'return'];
    
    const sampleProducts = [
      { id: '1', name: 'Wireless Mouse' },
      { id: '2', name: 'USB-C Cable' },
      { id: '3', name: 'Mechanical Keyboard' },
      { id: '4', name: 'Office Chair' },
      { id: '5', name: 'Monitor Stand' },
    ];

    const product = sampleProducts[Math.floor(Math.random() * sampleProducts.length)];
    const changeType = changeTypes[Math.floor(Math.random() * changeTypes.length)];
    const oldQuantity = Math.floor(Math.random() * 100) + 20;
    
    let newQuantity: number;
    if (changeType === 'sale') {
      newQuantity = oldQuantity - Math.floor(Math.random() * 5) - 1;
    } else if (changeType === 'restock') {
      newQuantity = oldQuantity + Math.floor(Math.random() * 50) + 10;
    } else if (changeType === 'return') {
      newQuantity = oldQuantity + Math.floor(Math.random() * 3) + 1;
    } else {
      newQuantity = oldQuantity + Math.floor(Math.random() * 20) - 10;
    }

    const update: StockUpdate = {
      productId: product.id,
      productName: product.name,
      oldQuantity,
      newQuantity,
      changeType,
      timestamp: new Date().toISOString(),
      location: 'Main Warehouse',
    };

    // Notify all subscribers
    this.stockUpdateCallbacks.forEach(callback => callback(update));

    // Check if alert should be triggered
    if (newQuantity < 15) {
      this.triggerAlert({
        id: `alert-${Date.now()}`,
        type: newQuantity === 0 ? 'out_of_stock' : 'low_stock',
        productId: product.id,
        productName: product.name,
        message: newQuantity === 0 
          ? `${product.name} is out of stock!`
          : `${product.name} stock is low (${newQuantity} units remaining)`,
        severity: newQuantity === 0 ? 'critical' : newQuantity < 5 ? 'high' : 'medium',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Trigger an alert
   */
  private triggerAlert(alert: Alert): void {
    this.alertCallbacks.forEach(callback => callback(alert));
  }

  /**
   * Manually trigger a stock update (for testing)
   */
  public triggerManualUpdate(update: StockUpdate): void {
    this.stockUpdateCallbacks.forEach(callback => callback(update));
  }

  /**
   * Check connection status
   */
  public get connected(): boolean {
    return this.isConnected;
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();
