# order_book.py
from datetime import datetime, timedelta
from typing import List, Tuple, Dict, Any

# In-memory storage for order history
order_storage: List[Dict[str, Any]] = []
transacted_orders: List[Tuple[datetime, float, float]] = []   # (ts, price, qty)

def volume_in_last_5min(now: datetime = None) -> float:
    """Calculate trading volume in the last 5 minutes"""
    now = now or datetime.now()
    cutoff = now - timedelta(minutes=5)
    return sum(qty for ts, _, qty in transacted_orders if cutoff <= ts < now)

def is_liquid(trading_volume: float, bid_ask_spread: float,
              min_volume: float = 100_000.0, max_spread: float = 0.01) -> bool:
    """
    Determine if market is liquid based on volume and spread.
    
    Args:
        trading_volume: Total volume traded recently
        bid_ask_spread: Relative spread (ask-bid)/bid
        min_volume: Minimum volume threshold for liquidity
        max_spread: Maximum spread threshold for liquidity
    
    Returns:
        True if market is liquid, False otherwise
    """
    return trading_volume >= min_volume and bid_ask_spread <= max_spread

def process_and_rank_orders(incoming: List[Tuple[str, float, int, str, str]]) -> Dict[str, list]:
    """
    Convert raw orders into ranked order book entries.
    
    Args:
        incoming: List of tuples (timestamp_iso, price, qty, side, user_id)
    
    Returns:
        Dict with 'bids' and 'asks' lists, each containing (price, qty, timestamp, user_id)
    """
    book = {'bids': [], 'asks': []}
    
    for timestamp_str, price, qty, side, user_id in incoming:
        # Parse timestamp
        ts = datetime.fromisoformat(timestamp_str.replace(' ', 'T'))
        
        # Add to appropriate side
        if side == 'buy':
            book['bids'].append((price, qty, ts, user_id))
        else:  # side == 'sell'
            book['asks'].append((price, qty, ts, user_id))

    # Sort orders
    # Bids: highest price first, then earliest time
    book['bids'].sort(key=lambda x: (-x[0], x[2]))
    
    # Asks: lowest price first, then earliest time
    book['asks'].sort(key=lambda x: (x[0], x[2]))
    
    return book

def match_transaction(book: Dict[str, list], is_liquid_flag: bool) -> Dict[str, Any]:
    """
    Attempt to match orders from the book.
    
    Args:
        book: Order book with 'bids' and 'asks'
        is_liquid_flag: Whether market is currently liquid
    
    Returns:
        Dict containing:
        - order_book: Updated order book after match
        - transaction_price: Price at which trade occurred (None if no match)
        - market_price: Current market price estimate
    """
    # Check if we have orders on both sides
    if not book['bids'] or not book['asks']:
        return {
            'order_book': book,
            'transaction_price': None,
            'market_price': None
        }

    best_bid = book['bids'][0]  # (price, qty, timestamp, user_id)
    best_ask = book['asks'][0]

    # Check if orders can match (bid >= ask)
    if best_bid[0] < best_ask[0]:
        # No match possible, return mid-price as market price
        mid = (best_bid[0] + best_ask[0]) / 2
        return {
            'order_book': book,
            'transaction_price': None,
            'market_price': mid
        }

    # === MATCH FOUND ===
    # Transaction occurs at the ask price (seller's price)
    price = best_ask[0]
    qty = min(best_bid[1], best_ask[1])
    now = datetime.now()

    # Update order book
    # Remove or reduce bid
    if best_bid[1] == qty:
        book['bids'].pop(0)  # Fully filled
    else:
        book['bids'][0] = (best_bid[0], best_bid[1] - qty, best_bid[2], best_bid[3])

    # Remove or reduce ask
    if best_ask[1] == qty:
        book['asks'].pop(0)  # Fully filled
    else:
        book['asks'][0] = (best_ask[0], best_ask[1] - qty, best_ask[2], best_ask[3])

    # Record transaction
    transacted_orders.append((now, price, qty))

    # Determine market price based on liquidity
    if is_liquid_flag:
        market_price = price  # Use transaction price in liquid markets
    else:
        # In illiquid markets, use mid-price
        if book['bids'] and book['asks']:
            market_price = (book['bids'][0][0] + book['asks'][0][0]) / 2
        else:
            market_price = price

    return {
        'order_book': book,
        'transaction_price': price,
        'market_price': market_price
    }
