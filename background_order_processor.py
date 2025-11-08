# background_order_processor.py
import threading
import time
from collections import deque
from order_book import process_and_rank_orders, match_transaction, is_liquid, transacted_orders
from block_chain_templates import Blockchain, Transaction
from flask_socketio import SocketIO

# ------------------------------------------------------------------
# Global shared state
# ------------------------------------------------------------------
order_queue = deque()  # (timestamp_iso, price, qty, side, user_id)
order_book = {'bids': [], 'asks': []}
state_lock = threading.Lock()

# Blockchain instance (quantum-enabled)
blockchain = Blockchain(difficulty=2, max_block_transactions=5)

# WebSocket
socketio: SocketIO = None

def set_socketio(sio: SocketIO):
    global socketio
    socketio = sio

# ------------------------------------------------------------------
# Public API
# ------------------------------------------------------------------
def submit_order(timestamp_iso: str, price: float, qty: int, side: str, user_id: str):
    """Submit an order to the queue"""
    if side not in ('buy', 'sell'):
        raise ValueError("side must be 'buy' or 'sell'")
    if price <= 0 or qty <= 0:
        raise ValueError("price/qty must be positive")

    with state_lock:
        order_queue.append((timestamp_iso, price, qty, side, user_id))

# ------------------------------------------------------------------
# Background Worker
# ------------------------------------------------------------------
def background_order_engine():
    """Main order processing loop"""
    print("[Engine] Started with quantum-enhanced blockchain")
    print(f"[Engine] Blockchain height: {len(blockchain.chain)}")
    print(f"[Engine] Quantum participants: {list(blockchain.quantum_participants.keys())}")
    
    while True:
        # 1. Drain queue and process new orders
        incoming = []
        with state_lock:
            while order_queue:
                incoming.append(order_queue.popleft())

        if incoming:
            try:
                # Process and rank orders
                ranked = process_and_rank_orders(incoming)
                with state_lock:
                    order_book['bids'].extend(ranked['bids'])
                    order_book['asks'].extend(ranked['asks'])
                    # Re-sort order book
                    order_book['bids'].sort(key=lambda x: (-x[0], x[2]))  # price desc, time asc
                    order_book['asks'].sort(key=lambda x: (x[0], x[2]))   # price asc, time asc
                print(f"[Engine] Processed {len(incoming)} orders")
            except Exception as e:
                print(f"[Engine] Ranking error: {e}")

        # 2. Check for matches and create transactions
        with state_lock:
            current = {
                'bids': order_book['bids'].copy(),
                'asks': order_book['asks'].copy()
            }

        trade = None
        if current['bids'] and current['asks']:
            # Calculate market conditions
            best_bid_p = current['bids'][0][0]
            best_ask_p = current['asks'][0][0]
            spread = (best_ask_p - best_bid_p) / best_bid_p if best_bid_p else 999
            volume = sum(q for _, q, _ in transacted_orders[-100:])  # last 100 trades
            liquid = is_liquid(volume, spread)

            # Attempt to match
            result = match_transaction(current, liquid)
            
            if result['transaction_price'] is not None:
                # Match found!
                buyer_id = current['bids'][0][2] if current['bids'] else "unknown"
                seller_id = current['asks'][0][2] if current['asks'] else "unknown"
                qty_matched = min(
                    current['bids'][0][1] if current['bids'] else 0,
                    current['asks'][0][1] if current['asks'] else 0
                )
                
                trade = {
                    'price': result['transaction_price'],
                    'market_price': result['market_price'],
                    'qty': qty_matched,
                    'buyer': buyer_id,
                    'seller': seller_id,
                    'timestamp': time.time(),
                    'liquid': liquid
                }

                # Update global order book
                with state_lock:
                    order_book['bids'] = result['order_book']['bids']
                    order_book['asks'] = result['order_book']['asks']

                # === BLOCKCHAIN TRANSACTION ===
                try:
                    amount_usd = trade['price'] * qty_matched
                    
                    # Check if both parties are quantum participants
                    buyer_is_quantum = buyer_id in blockchain.quantum_participants
                    seller_is_quantum = seller_id in blockchain.quantum_participants
                    
                    if buyer_is_quantum and seller_is_quantum:
                        # Create quantum-secured transaction
                        print(f"[Engine] Creating quantum transaction: {seller_id} → {buyer_id}, ${amount_usd:.2f}")
                        tx = blockchain.create_quantum_transaction(
                            sender_label=seller_id,
                            recipient_label=buyer_id,
                            amount=amount_usd
                        )
                        trade['transaction_type'] = 'quantum'
                    else:
                        # Create standard transaction
                        print(f"[Engine] Creating standard transaction: {seller_id} → {buyer_id}, ${amount_usd:.2f}")
                        tx = Transaction(
                            sender=seller_id,
                            recipient=buyer_id,
                            amount=amount_usd
                        )
                        trade['transaction_type'] = 'standard'
                    
                    # Add to blockchain
                    blockchain.add_transaction(tx)
                    trade['tx_added'] = True
                    
                except Exception as e:
                    print(f"[Engine] Blockchain error: {e}")
                    trade['tx_added'] = False
                    trade['tx_error'] = str(e)

        # 3. Broadcast market update via WebSocket
        with state_lock:
            # Prepare market update payload
            payload = {
                'order_book': {
                    'bids': [(p, q, str(t)) for p, q, t in order_book['bids'][:20]],
                    'asks': [(p, q, str(t)) for p, q, t in order_book['asks'][:20]]
                },
                'last_trade': trade,
                'stats': {
                    'total_bids': len(order_book['bids']),
                    'total_asks': len(order_book['asks']),
                    'liquidity': 'liquid' if (trade and trade.get('liquid')) else 'illiquid',
                    'spread': f"{spread * 100:.2f}%" if current['bids'] and current['asks'] else "N/A"
                },
                'blockchain': {
                    'height': len(blockchain.chain),
                    'latest_hash': blockchain.chain[-1].hash[:8] + '...',
                    'mempool_size': len(blockchain.mempool),
                    'total_transactions': sum(len(b.transactions) for b in blockchain.chain),
                    'quantum_participants': len(blockchain.quantum_participants),
                    'quantum_channels': len(blockchain.quantum_channels)
                }
            }

        # Emit update to all connected clients
        if socketio:
            socketio.emit('market_update', payload)

        # Sleep before next iteration
        time.sleep(0.3)


def get_order_book_summary():
    """Get a snapshot of the current order book"""
    with state_lock:
        return {
            'bids': order_book['bids'][:10],
            'asks': order_book['asks'][:10],
            'total_bids': len(order_book['bids']),
            'total_asks': len(order_book['asks'])
        }


def get_blockchain_summary():
    """Get a snapshot of the blockchain state"""
    return {
        'height': len(blockchain.chain),
        'difficulty': blockchain.difficulty,
        'total_transactions': sum(len(b.transactions) for b in blockchain.chain),
        'mempool_size': len(blockchain.mempool),
        'quantum_enabled': True,
        'quantum_participants': list(blockchain.quantum_participants.keys()),
        'quantum_channels': len(blockchain.quantum_channels),
        'is_valid': blockchain.is_chain_valid()
    }
