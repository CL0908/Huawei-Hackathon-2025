/**
 * P2P Market Service
 * 
 * This file contains the backend logic for managing peer-to-peer energy trading.
 * In production, this would be implemented using Supabase for real-time data persistence.
 * 
 * Key Features:
 * - Order Book Management (Bids and Asks)
 * - Market Clearing Logic
 * - Order Matching Engine
 * - Transaction Settlement
 */

export interface MarketOrder {
  id: string;
  type: 'buy' | 'sell';
  userId: string;
  username: string;
  price: number; // Price per kWh in dollars
  amount: number; // Amount in kWh
  timestamp: Date;
  status: 'active' | 'partial' | 'filled' | 'cancelled';
  filledAmount: number; // Amount already traded
  distance?: string;
  location?: { lat: number; lng: number };
}

export interface Trade {
  id: string;
  buyOrderId: string;
  sellOrderId: string;
  buyerId: string;
  sellerId: string;
  price: number;
  amount: number;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
}

/**
 * Mock order book storage
 * In production, replace with Supabase queries
 */
class P2PMarketService {
  private orders: MarketOrder[] = [];
  private trades: Trade[] = [];

  /**
   * Submit a new sell order (Ask)
   */
  async submitSellOrder(
    userId: string,
    username: string,
    price: number,
    amount: number,
    location?: { lat: number; lng: number }
  ): Promise<MarketOrder> {
    const order: MarketOrder = {
      id: `sell-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'sell',
      userId,
      username,
      price,
      amount,
      timestamp: new Date(),
      status: 'active',
      filledAmount: 0,
      location,
    };

    this.orders.push(order);
    
    // Attempt to match with existing buy orders
    await this.matchOrders();

    return order;
  }

  /**
   * Submit a new buy order (Bid)
   */
  async submitBuyOrder(
    userId: string,
    username: string,
    price: number,
    amount: number,
    location?: { lat: number; lng: number }
  ): Promise<MarketOrder> {
    const order: MarketOrder = {
      id: `buy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'buy',
      userId,
      username,
      price,
      amount,
      timestamp: new Date(),
      status: 'active',
      filledAmount: 0,
      location,
    };

    this.orders.push(order);
    
    // Attempt to match with existing sell orders
    await this.matchOrders();

    return order;
  }

  /**
   * Accept an existing sell order (direct purchase)
   */
  async acceptSellOrder(
    sellOrderId: string,
    buyerId: string,
    buyerUsername: string,
    amount: number
  ): Promise<Trade> {
    const sellOrder = this.orders.find(o => o.id === sellOrderId && o.type === 'sell');
    
    if (!sellOrder) {
      throw new Error('Sell order not found');
    }

    const availableAmount = sellOrder.amount - sellOrder.filledAmount;
    if (amount > availableAmount) {
      throw new Error('Insufficient amount available');
    }

    const trade: Trade = {
      id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      buyOrderId: `direct-${Date.now()}`,
      sellOrderId: sellOrder.id,
      buyerId,
      sellerId: sellOrder.userId,
      price: sellOrder.price,
      amount,
      timestamp: new Date(),
      status: 'completed',
    };

    // Update sell order
    sellOrder.filledAmount += amount;
    if (sellOrder.filledAmount >= sellOrder.amount) {
      sellOrder.status = 'filled';
    } else {
      sellOrder.status = 'partial';
    }

    this.trades.push(trade);

    return trade;
  }

  /**
   * Market clearing algorithm - matches compatible buy and sell orders
   * Priority: Price-time priority (best price first, then earliest timestamp)
   */
  private async matchOrders(): Promise<void> {
    // Get active buy and sell orders
    const activeBuyOrders = this.orders
      .filter(o => o.type === 'buy' && o.status === 'active')
      .sort((a, b) => {
        // Sort by price descending (highest buy price first), then by time
        if (b.price !== a.price) return b.price - a.price;
        return a.timestamp.getTime() - b.timestamp.getTime();
      });

    const activeSellOrders = this.orders
      .filter(o => o.type === 'sell' && o.status === 'active')
      .sort((a, b) => {
        // Sort by price ascending (lowest sell price first), then by time
        if (a.price !== b.price) return a.price - b.price;
        return a.timestamp.getTime() - b.timestamp.getTime();
      });

    // Match orders where buy price >= sell price
    for (const buyOrder of activeBuyOrders) {
      for (const sellOrder of activeSellOrders) {
        // Check if prices are compatible
        if (buyOrder.price >= sellOrder.price) {
          const buyAvailable = buyOrder.amount - buyOrder.filledAmount;
          const sellAvailable = sellOrder.amount - sellOrder.filledAmount;
          
          if (buyAvailable > 0 && sellAvailable > 0) {
            // Execute trade at the sell order price (price improvement for buyer)
            const tradeAmount = Math.min(buyAvailable, sellAvailable);
            const tradePrice = sellOrder.price;

            const trade: Trade = {
              id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              buyOrderId: buyOrder.id,
              sellOrderId: sellOrder.id,
              buyerId: buyOrder.userId,
              sellerId: sellOrder.userId,
              price: tradePrice,
              amount: tradeAmount,
              timestamp: new Date(),
              status: 'completed',
            };

            // Update orders
            buyOrder.filledAmount += tradeAmount;
            sellOrder.filledAmount += tradeAmount;

            if (buyOrder.filledAmount >= buyOrder.amount) {
              buyOrder.status = 'filled';
            } else {
              buyOrder.status = 'partial';
            }

            if (sellOrder.filledAmount >= sellOrder.amount) {
              sellOrder.status = 'filled';
            } else {
              sellOrder.status = 'partial';
            }

            this.trades.push(trade);

            // In production: Trigger payment processing, update user balances, etc.
            await this.settleTrade(trade);
          }
        }
      }
    }
  }

  /**
   * Settle a completed trade (payment processing, battery updates, etc.)
   */
  private async settleTrade(trade: Trade): Promise<void> {
    // In production, this would:
    // 1. Transfer funds from buyer to seller
    // 2. Update battery levels
    // 3. Record transaction history
    // 4. Send notifications to both parties
    // 5. Update CO2 token balances
    
    console.log('Trade settled:', {
      tradeId: trade.id,
      buyer: trade.buyerId,
      seller: trade.sellerId,
      amount: trade.amount,
      price: trade.price,
      totalCost: (trade.amount * trade.price).toFixed(2),
    });
  }

  /**
   * Get active sell orders (order book asks)
   */
  async getSellOrders(): Promise<MarketOrder[]> {
    return this.orders
      .filter(o => o.type === 'sell' && (o.status === 'active' || o.status === 'partial'))
      .sort((a, b) => a.price - b.price); // Lowest price first
  }

  /**
   * Get active buy orders (order book bids)
   */
  async getBuyOrders(): Promise<MarketOrder[]> {
    return this.orders
      .filter(o => o.type === 'buy' && (o.status === 'active' || o.status === 'partial'))
      .sort((a, b) => b.price - a.price); // Highest price first
  }

  /**
   * Get user's orders
   */
  async getUserOrders(userId: string): Promise<MarketOrder[]> {
    return this.orders.filter(o => o.userId === userId);
  }

  /**
   * Get user's trades
   */
  async getUserTrades(userId: string): Promise<Trade[]> {
    return this.trades.filter(t => t.buyerId === userId || t.sellerId === userId);
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string, userId: string): Promise<void> {
    const order = this.orders.find(o => o.id === orderId && o.userId === userId);
    
    if (!order) {
      throw new Error('Order not found or unauthorized');
    }

    if (order.status === 'filled') {
      throw new Error('Cannot cancel a filled order');
    }

    order.status = 'cancelled';
  }

  /**
   * Get market statistics
   */
  async getMarketStats() {
    const sellOrders = await this.getSellOrders();
    const buyOrders = await this.getBuyOrders();

    const lowestAsk = sellOrders.length > 0 ? sellOrders[0].price : null;
    const highestBid = buyOrders.length > 0 ? buyOrders[0].price : null;
    const spread = lowestAsk && highestBid ? lowestAsk - highestBid : null;

    const recentTrades = this.trades.slice(-10);
    const avgPrice = recentTrades.length > 0
      ? recentTrades.reduce((sum, t) => sum + t.price, 0) / recentTrades.length
      : null;

    return {
      lowestAsk,
      highestBid,
      spread,
      averagePrice: avgPrice,
      totalSellVolume: sellOrders.reduce((sum, o) => sum + (o.amount - o.filledAmount), 0),
      totalBuyVolume: buyOrders.reduce((sum, o) => sum + (o.amount - o.filledAmount), 0),
      tradesCount: this.trades.length,
    };
  }
}

// Singleton instance
export const p2pMarketService = new P2PMarketService();

/**
 * SUPABASE INTEGRATION GUIDE
 * 
 * To implement this with Supabase:
 * 
 * 1. Create tables:
 *    - market_orders (id, user_id, username, type, price, amount, filled_amount, status, timestamp, location)
 *    - trades (id, buy_order_id, sell_order_id, buyer_id, seller_id, price, amount, status, timestamp)
 * 
 * 2. Set up Row Level Security (RLS):
 *    - Users can only insert their own orders
 *    - Users can view all active orders
 *    - Users can only cancel their own orders
 * 
 * 3. Create real-time subscriptions:
 *    - Subscribe to changes in market_orders table
 *    - Subscribe to new trades
 * 
 * 4. Implement Supabase Edge Functions for:
 *    - Order matching (runs periodically or on new order submission)
 *    - Trade settlement (payment processing, battery updates)
 *    - Market stats calculation
 * 
 * 5. Example Supabase query:
 *    const { data: sellOrders } = await supabase
 *      .from('market_orders')
 *      .select('*')
 *      .eq('type', 'sell')
 *      .in('status', ['active', 'partial'])
 *      .order('price', { ascending: true })
 */
