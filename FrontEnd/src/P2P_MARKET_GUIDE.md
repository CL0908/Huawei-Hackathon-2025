# P2P Energy Market Implementation Guide

## Overview

The Luméa app now features a **Peer-to-Peer (P2P) Energy Trading Market** that replaces the previous AI-driven automatic matching system. Users can now place explicit limit orders (Bids and Asks) and browse a real-time order book to trade energy directly with their neighbors.

## Key Changes

### From AI-Driven to Market-Driven

**Before:**
- "Buy from Community" → Luméa AI automatically matched you with the best price
- "Sell to Community" → Luméa AI automatically matched you with buyers

**After:**
- "View Market Offers" → Browse existing sell orders and purchase directly
- "Place Sell Order" → Set your own ask price and quantity

## User Flow

### Buying Energy from the Community

1. User clicks **"Buy Energy"** button
2. Modal shows two options:
   - **Buy from Grid** (fixed price, instant)
   - **Buy from Community** (dynamic price, P2P market)
3. User selects **"View Market Offers"**
4. **P2P Market Modal** opens showing:
   - List of active sell orders (sorted by price, lowest first)
   - Seller name, price per kWh, available amount, distance
   - Time since order was placed
5. User clicks on a sell order to purchase
6. **Confirm Market Order Modal** opens:
   - Shows seller details and price
   - User enters amount to purchase (limited by battery capacity)
   - Shows total cost and savings vs grid price
7. User confirms purchase
8. Transaction is executed and both parties are notified

### Selling Energy to the Community

1. User clicks **"Sell Energy"** button
2. Modal shows two options:
   - **Sell to Grid** (fixed price, instant)
   - **Sell to Community** (set your own price, P2P market)
3. User selects **"Place Sell Order"**
4. **Place Sell Order Modal** opens:
   - User sets ask price ($/kWh)
   - User sets amount (kWh)
   - Shows profit margin compared to grid price
   - Shows expected revenue
5. User places order
6. Order appears in the P2P market order book
7. Order remains active until:
   - A buyer purchases it (full or partial fill)
   - User cancels it
   - Order expires (if time limits are implemented)

## Components

### UI Components

1. **BuyOptionsModal.tsx**
   - Updated description: "View and purchase from existing market sell orders placed by your neighbors."
   - Updated button: "View Market Offers"

2. **SellOptionsModal.tsx**
   - Updated description: "Place your energy for sale on the P2P market. Set your ask price and quantity."
   - Updated button: "Place Sell Order"

3. **P2PMarketModal.tsx** (NEW)
   - Displays the order book with tabs for Sell Orders and Buy Orders
   - Shows order details: seller/buyer name, price, amount, timestamp, distance
   - Clickable orders that open confirmation modal

4. **PlaceSellOrderModal.tsx** (NEW)
   - Form to create a new sell order
   - Price input with validation ($0.05 - $1.00 range)
   - Amount input with validation (1-100 kWh range)
   - Shows profit margin vs grid price
   - Shows expected revenue

5. **ConfirmMarketOrderModal.tsx** (NEW)
   - Confirms purchase from a specific seller
   - Shows seller information and distance
   - Amount input with smart validation (battery capacity + available amount)
   - Shows total cost and savings
   - Info banner about direct P2P transaction

### Backend Service

6. **P2PMarketService.ts** (NEW)
   - Manages order book (bids and asks)
   - Implements market clearing logic
   - Order matching engine with price-time priority
   - Trade settlement processing
   - Market statistics calculation

## Market Mechanics

### Order Types

1. **Sell Orders (Asks)**
   - User wants to sell energy at a specific price
   - Sorted by price (lowest first = best for buyers)
   - Can be partially filled

2. **Buy Orders (Bids)**
   - User wants to buy energy at a specific price
   - Sorted by price (highest first = best for sellers)
   - Can be partially filled

3. **Direct Purchase**
   - User accepts an existing sell order immediately
   - Executed at the ask price
   - No waiting for matching

### Order Matching Algorithm

The market uses **price-time priority**:

1. **Best Price First:**
   - Buy orders: Highest bid first
   - Sell orders: Lowest ask first

2. **Time Priority:**
   - Among orders at the same price, earlier orders match first

3. **Automatic Matching:**
   - When buy price ≥ sell price, orders automatically match
   - Trade executes at the sell price (price improvement for buyer)
   - Orders can be partially filled

4. **Order Status:**
   - `active` - Order is in the market, no fills yet
   - `partial` - Order has been partially filled
   - `filled` - Order is completely filled
   - `cancelled` - Order was cancelled by user

### Market Clearing Example

**Order Book State:**
```
Sell Orders (Asks):
- Alice: 10 kWh @ $0.16/kWh
- Bob: 15 kWh @ $0.17/kWh

Buy Orders (Bids):
- Charlie: 20 kWh @ $0.18/kWh
- Diana: 25 kWh @ $0.15/kWh
```

**Matching Process:**
1. Charlie's bid ($0.18) ≥ Alice's ask ($0.16) → **Match!**
   - Trade: 10 kWh @ $0.16/kWh (Alice's price)
   - Alice's order: Filled
   - Charlie's order: Partial (10 kWh remaining)

2. Charlie's bid ($0.18) ≥ Bob's ask ($0.17) → **Match!**
   - Trade: 10 kWh @ $0.17/kWh (Bob's price)
   - Bob's order: Partial (5 kWh remaining)
   - Charlie's order: Filled

**Final Order Book:**
```
Sell Orders (Asks):
- Bob: 5 kWh @ $0.17/kWh (partial)

Buy Orders (Bids):
- Diana: 25 kWh @ $0.15/kWh (active)
```

Diana's bid ($0.15) < Bob's ask ($0.17) → No match, orders remain in book.

## Supabase Integration

### Database Schema

```sql
-- Market Orders Table
CREATE TABLE market_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  username TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('buy', 'sell')),
  price DECIMAL(10, 4) NOT NULL CHECK (price > 0),
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  filled_amount DECIMAL(10, 2) DEFAULT 0 CHECK (filled_amount >= 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'partial', 'filled', 'cancelled')),
  location JSONB,
  distance TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trades Table
CREATE TABLE trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  buy_order_id UUID REFERENCES market_orders(id),
  sell_order_id UUID REFERENCES market_orders(id),
  buyer_id UUID REFERENCES auth.users(id) NOT NULL,
  seller_id UUID REFERENCES auth.users(id) NOT NULL,
  price DECIMAL(10, 4) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_market_orders_type_status ON market_orders(type, status);
CREATE INDEX idx_market_orders_price ON market_orders(price);
CREATE INDEX idx_market_orders_user_id ON market_orders(user_id);
CREATE INDEX idx_trades_buyer_id ON trades(buyer_id);
CREATE INDEX idx_trades_seller_id ON trades(seller_id);
```

### Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE market_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- Users can view all active/partial orders
CREATE POLICY "Anyone can view active orders" ON market_orders
  FOR SELECT USING (status IN ('active', 'partial'));

-- Users can insert their own orders
CREATE POLICY "Users can create their own orders" ON market_orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own orders (cancel)
CREATE POLICY "Users can update their own orders" ON market_orders
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can view trades they're involved in
CREATE POLICY "Users can view their trades" ON trades
  FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- System can insert trades (use service role key in Edge Function)
CREATE POLICY "Service role can insert trades" ON trades
  FOR INSERT WITH CHECK (true);
```

### Real-Time Subscriptions

```typescript
// Subscribe to market orders changes
const ordersSubscription = supabase
  .channel('market-orders')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'market_orders',
      filter: 'status=in.(active,partial)',
    },
    (payload) => {
      console.log('Order book updated:', payload);
      // Update UI with new order data
    }
  )
  .subscribe();

// Subscribe to new trades
const tradesSubscription = supabase
  .channel('trades')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'trades',
    },
    (payload) => {
      console.log('New trade:', payload);
      // Update UI, show notification
    }
  )
  .subscribe();
```

### Edge Functions

#### 1. Match Orders Function

```typescript
// supabase/functions/match-orders/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // Get active buy orders (highest price first)
  const { data: buyOrders } = await supabase
    .from('market_orders')
    .select('*')
    .eq('type', 'buy')
    .in('status', ['active', 'partial'])
    .order('price', { ascending: false })
    .order('created_at', { ascending: true });

  // Get active sell orders (lowest price first)
  const { data: sellOrders } = await supabase
    .from('market_orders')
    .select('*')
    .eq('type', 'sell')
    .in('status', ['active', 'partial'])
    .order('price', { ascending: true })
    .order('created_at', { ascending: true });

  // Match orders
  for (const buyOrder of buyOrders || []) {
    for (const sellOrder of sellOrders || []) {
      if (buyOrder.price >= sellOrder.price) {
        const buyAvailable = buyOrder.amount - buyOrder.filled_amount;
        const sellAvailable = sellOrder.amount - sellOrder.filled_amount;
        
        if (buyAvailable > 0 && sellAvailable > 0) {
          const tradeAmount = Math.min(buyAvailable, sellAvailable);
          
          // Create trade
          await supabase.from('trades').insert({
            buy_order_id: buyOrder.id,
            sell_order_id: sellOrder.id,
            buyer_id: buyOrder.user_id,
            seller_id: sellOrder.user_id,
            price: sellOrder.price,
            amount: tradeAmount,
            status: 'completed',
          });

          // Update orders
          await supabase
            .from('market_orders')
            .update({
              filled_amount: buyOrder.filled_amount + tradeAmount,
              status: buyOrder.filled_amount + tradeAmount >= buyOrder.amount ? 'filled' : 'partial',
            })
            .eq('id', buyOrder.id);

          await supabase
            .from('market_orders')
            .update({
              filled_amount: sellOrder.filled_amount + tradeAmount,
              status: sellOrder.filled_amount + tradeAmount >= sellOrder.amount ? 'filled' : 'partial',
            })
            .eq('id', sellOrder.id);
        }
      }
    }
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
```

#### 2. Place Order Function

```typescript
// Frontend call
const placeOrder = async (type: 'buy' | 'sell', price: number, amount: number) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('market_orders')
    .insert({
      user_id: user.id,
      username: user.user_metadata.username,
      type,
      price,
      amount,
      status: 'active',
      filled_amount: 0,
    })
    .select()
    .single();

  if (error) throw error;

  // Trigger order matching
  await supabase.functions.invoke('match-orders');

  return data;
};
```

## Smart Features

### Battery-Aware Purchase Limits

The system prevents users from purchasing more energy than their battery can hold:

```typescript
const batteryLevel = 8.5; // Current: 8.5 kWh
const batteryCapacity = 13.5; // Max: 13.5 kWh
const maxPurchase = batteryCapacity - batteryLevel; // Can buy: 5.0 kWh
```

### Distance Calculation

Orders can show distance to help users prefer nearby neighbors:

```typescript
// Calculate distance between two coordinates
function calculateDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
```

### Price Validation

- Minimum price: $0.05/kWh (prevents predatory pricing)
- Maximum price: $1.00/kWh (prevents price gouging)
- Grid price reference: $0.10/kWh (sell) and $0.20/kWh (buy)

### CO2 Token Rewards

Users earn CO2 tokens when trading cleaner energy in the community market.

## Benefits of P2P Market

1. **Transparency:** Users see all available offers and choose directly
2. **Price Discovery:** Market determines fair prices based on supply/demand
3. **User Control:** Set your own prices, no AI deciding for you
4. **Competition:** Multiple sellers compete, driving better prices
5. **Community Building:** See who you're trading with (neighbors)
6. **Flexibility:** Partial fills, cancel anytime, set limits

## Future Enhancements

- [ ] Order expiration (time limits)
- [ ] Advanced order types (stop-loss, take-profit)
- [ ] Market depth charts
- [ ] Historical price data and trends
- [ ] Reputation system for reliable traders
- [ ] Bulk order placement
- [ ] Scheduled/recurring orders
- [ ] Mobile notifications for order fills
- [ ] Transaction fees for market operations
- [ ] Smart contract integration for trustless trading

## Testing Checklist

- [ ] Place sell order with valid price/amount
- [ ] Place sell order with invalid price (too low/high)
- [ ] Place sell order with invalid amount
- [ ] View market offers (sell orders)
- [ ] Purchase from market offer (full amount)
- [ ] Purchase from market offer (partial amount)
- [ ] Purchase exceeding battery capacity (should fail)
- [ ] Purchase exceeding available amount (should fail)
- [ ] Automatic order matching when prices cross
- [ ] Order status updates (active → partial → filled)
- [ ] Cancel active order
- [ ] View trade history
- [ ] Real-time order book updates
- [ ] Notifications on order fill
- [ ] Distance calculation to sellers
- [ ] CO2 token rewards calculation

---

**Implementation Status:** ✅ Complete

All UI components and backend service logic have been implemented. Next step is to integrate with Supabase for production deployment.
