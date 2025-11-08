# app_backend.py
"""
Energy Trading & Solar Forecasting Backend
Uses YOUR uploaded model architecture (QuantileRegressor, FeatureBuilder)
"""

from flask import Flask, request, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
import threading
from pathlib import Path
from datetime import datetime
import logging

# Import your modules
from background_order_processor import (
    submit_order, background_order_engine, set_socketio, 
    blockchain, order_book, state_lock, get_order_book_summary
)
from block_chain_templates import QuantumParticipant
from solar_service import SolarForecastService
from config import PlantConfig

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s | %(levelname)s | %(name)s | %(message)s'
)
LOGGER = logging.getLogger(__name__)

app = Flask(__name__)
app.config['SECRET_KEY'] = 'energy-market-secret'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# ------------------------------------------------------------------
# Configuration - CUSTOMIZE THIS FOR YOUR PLANT
# ------------------------------------------------------------------
MODEL_DIR = Path("artifacts/models")
PLANT_CONFIG = PlantConfig(
    plant_id="Plant_1",
    latitude=13.0,
    longitude=77.6,
    timezone="Asia/Kolkata",
    capacity_kw=100.0,
    name="Solar Plant 1"
)

# Initialize YOUR forecast service
try:
    forecast_service = SolarForecastService(MODEL_DIR, PLANT_CONFIG)
    if forecast_service.models:
        LOGGER.info(f"✅ Loaded {len(forecast_service.models)} quantile models")
        LOGGER.info(f"   Quantiles: {forecast_service.quantiles}")
    else:
        LOGGER.warning("⚠️  No models loaded - forecasting disabled")
        forecast_service = None
except Exception as e:
    LOGGER.error(f"❌ Could not initialize forecast service: {e}")
    forecast_service = None

# ------------------------------------------------------------------
# Wallet Management
# ------------------------------------------------------------------
wallets = {}

def generate_wallet(user_id: str):
    """Create quantum-enabled wallet"""
    if user_id in wallets:
        return wallets[user_id].address
    participant = QuantumParticipant(user_id)
    blockchain.register_quantum_participant(participant)
    wallets[user_id] = participant
    return participant.address

def get_participant(user_id: str):
    """Get user's quantum participant"""
    return wallets.get(user_id)

# ------------------------------------------------------------------
# SOLAR FORECASTING API - Uses YOUR Models
# ------------------------------------------------------------------

@app.route('/api/solar/forecast', methods=['POST'])
def get_forecast():
    """
    Generate solar power forecast using YOUR trained models.
    
    Request body:
    {
        "hours": 24,                          # Hours to forecast
        "interval_minutes": 15,               # Time interval
        "start_time": "2024-01-15T00:00:00"  # Optional start time
    }
    """
    if not forecast_service:
        return jsonify(error="Forecast service not available - models not loaded"), 503
    
    try:
        data = request.json or {}
        hours = data.get('hours', 24)
        interval_minutes = data.get('interval_minutes', 15)
        start_time = data.get('start_time')
        
        if start_time:
            start_time = datetime.fromisoformat(start_time)
        
        # Generate forecast using YOUR models
        forecast = forecast_service.generate_forecast(
            start_time=start_time,
            hours=hours,
            interval_minutes=interval_minutes
        )
        
        return jsonify(forecast)
    except Exception as e:
        LOGGER.error(f"Forecast error: {e}", exc_info=True)
        return jsonify(error=str(e)), 400

@app.route('/api/solar/building-potential', methods=['POST'])
def calculate_building_potential():
    """
    Calculate solar potential for a building.
    
    Request body:
    {
        "roof_area_m2": 150,
        "sunshine_hours_year": 1800,
        "panel_capacity_w": 350,
        "panel_area_m2": 1.7,
        "system_efficiency": 0.8
    }
    """
    if not forecast_service:
        return jsonify(error="Forecast service not available"), 503
    
    try:
        data = request.json
        required = ['roof_area_m2', 'sunshine_hours_year']
        if not all(k in data for k in required):
            return jsonify(error="Missing required fields: roof_area_m2, sunshine_hours_year"), 400
        
        potential = forecast_service.calculate_building_potential(
            roof_area_m2=float(data['roof_area_m2']),
            sunshine_hours_year=float(data['sunshine_hours_year']),
            panel_capacity_w=float(data.get('panel_capacity_w', 350)),
            panel_area_m2=float(data.get('panel_area_m2', 1.7)),
            system_efficiency=float(data.get('system_efficiency', 0.8))
        )
        
        return jsonify(potential)
    except Exception as e:
        LOGGER.error(f"Building potential error: {e}", exc_info=True)
        return jsonify(error=str(e)), 400

@app.route('/api/solar/plant-info')
def get_plant_info():
    """Get plant configuration and model status"""
    return jsonify({
        'plant_id': PLANT_CONFIG.plant_id,
        'name': PLANT_CONFIG.name,
        'latitude': PLANT_CONFIG.latitude,
        'longitude': PLANT_CONFIG.longitude,
        'timezone': PLANT_CONFIG.timezone,
        'capacity_kw': PLANT_CONFIG.capacity_kw,
        'models_loaded': bool(forecast_service and forecast_service.models),
        'quantiles': forecast_service.quantiles if forecast_service else [],
        'model_type': 'quantile_residual'
    })

@app.route('/api/solar/dashboard')
def solar_dashboard():
    """Get comprehensive dashboard data with 24h forecast"""
    if not forecast_service:
        return jsonify(error="Forecast service not available"), 503
    
    try:
        # Generate 24-hour forecast
        forecast = forecast_service.generate_forecast(hours=24, interval_minutes=15)
        
        plant_info = {
            'plant_id': PLANT_CONFIG.plant_id,
            'name': PLANT_CONFIG.name,
            'capacity_kw': PLANT_CONFIG.capacity_kw,
            'location': {
                'latitude': PLANT_CONFIG.latitude,
                'longitude': PLANT_CONFIG.longitude,
                'timezone': PLANT_CONFIG.timezone
            }
        }
        
        stats = forecast.get('statistics', {})
        
        return jsonify({
            'plant_info': plant_info,
            'forecast': forecast,
            'summary': {
                'total_energy_kwh': stats.get('total_energy_kwh', 0),
                'co2_saved_kg': stats.get('co2_saved_kg', 0),
                'co2_saved_tons': stats.get('co2_saved_tons', 0),
                'peak_power_kw': stats.get('peak_power_kw', 0),
                'capacity_factor_pct': stats.get('capacity_factor_pct', 0)
            }
        })
    except Exception as e:
        LOGGER.error(f"Dashboard error: {e}", exc_info=True)
        return jsonify(error=str(e)), 500

# ------------------------------------------------------------------
# ENERGY TRADING API
# ------------------------------------------------------------------

@app.route('/wallet', methods=['POST'])
def create_wallet():
    """Create quantum-enabled wallet"""
    data = request.json
    user_id = data.get('user_id')
    if not user_id:
        return jsonify(error="user_id required"), 400
    
    addr = generate_wallet(user_id)
    return jsonify(user_id=user_id, address=addr, type="quantum_enabled")

@app.route('/wallet/<user_id>', methods=['GET'])
def get_wallet(user_id: str):
    """Get wallet information"""
    participant = get_participant(user_id)
    if not participant:
        return jsonify(error="wallet not found"), 404
    
    return jsonify(
        user_id=user_id,
        address=participant.address,
        label=participant.label,
        type="quantum_enabled"
    )

@app.route('/order', methods=['POST'])
def place_order():
    """
    Place energy order.
    
    Request body:
    {
        "user_id": "user123",
        "side": "buy" or "sell",
        "price": 0.15,
        "quantity": 100,
        "timestamp": "2024-01-15T12:00:00"
    }
    """
    data = request.json
    required = ['timestamp', 'price', 'quantity', 'side', 'user_id']
    if not all(k in data for k in required):
        return jsonify(error="missing fields"), 400

    user_id = data['user_id']
    if user_id not in wallets:
        generate_wallet(user_id)

    try:
        submit_order(
            timestamp_iso=data['timestamp'],
            price=float(data['price']),
            qty=int(data['quantity']),
            side=data['side'].lower(),
            user_id=user_id
        )
        return jsonify(status="order queued", user_id=user_id)
    except Exception as e:
        return jsonify(error=str(e)), 400

@app.route('/book')
def get_book():
    """Get current order book"""
    with state_lock:
        return jsonify({
            'bids': order_book['bids'][:20],
            'asks': order_book['asks'][:20]
        })

@app.route('/book/summary')
def get_book_summary():
    """Get order book summary"""
    summary = get_order_book_summary()
    return jsonify(summary)

# ------------------------------------------------------------------
# BLOCKCHAIN API
# ------------------------------------------------------------------

@app.route('/chain')
def get_chain():
    """Get recent blocks"""
    return jsonify([
        {
            'index': b.index,
            'tx_count': len(b.transactions),
            'hash': b.hash,
            'prev': b.previous_hash,
            'timestamp': b.timestamp,
            'has_quantum_tx': any(tx.quantum_payload for tx in b.transactions)
        } for b in blockchain.chain[-10:]
    ])

@app.route('/chain/full')
def get_full_chain():
    """Get complete blockchain"""
    return jsonify({
        'length': len(blockchain.chain),
        'chain': [
            {
                'index': b.index,
                'transactions': [
                    {
                        'sender': tx.sender,
                        'recipient': tx.recipient,
                        'amount': tx.amount,
                        'timestamp': tx.timestamp,
                        'has_quantum_payload': tx.quantum_payload is not None
                    } for tx in b.transactions
                ],
                'hash': b.hash,
                'previous_hash': b.previous_hash,
                'nonce': b.nonce,
                'merkle_root': b.merkle_root,
                'timestamp': b.timestamp
            } for b in blockchain.chain
        ],
        'valid': blockchain.is_chain_valid()
    })

@app.route('/quantum/channel', methods=['POST'])
def establish_channel():
    """Establish quantum channel between participants"""
    data = request.json
    user_a = data.get('user_a')
    user_b = data.get('user_b')
    
    if not user_a or not user_b:
        return jsonify(error="Both user_a and user_b required"), 400
    
    if user_a not in wallets:
        generate_wallet(user_a)
    if user_b not in wallets:
        generate_wallet(user_b)
    
    try:
        channel = blockchain.establish_quantum_channel(user_a, user_b)
        return jsonify(
            status="channel established",
            channel_id=channel.channel_id,
            participants=list(channel.participants),
            created_at=channel.created_at
        )
    except Exception as e:
        return jsonify(error=str(e)), 400

@app.route('/quantum/participants')
def list_participants():
    """List all quantum participants"""
    return jsonify({
        'participants': [
            {'label': p.label, 'address': p.address}
            for p in blockchain.quantum_participants.values()
        ],
        'total': len(blockchain.quantum_participants)
    })

@app.route('/stats')
def get_stats():
    """Get platform statistics"""
    with state_lock:
        total_bids = len(order_book['bids'])
        total_asks = len(order_book['asks'])
    
    stats = {
        'blockchain': {
            'height': len(blockchain.chain),
            'total_transactions': sum(len(b.transactions) for b in blockchain.chain),
            'is_valid': blockchain.is_chain_valid(),
            'quantum_participants': len(blockchain.quantum_participants),
            'quantum_channels': len(blockchain.quantum_channels)
        },
        'order_book': {
            'total_bids': total_bids,
            'total_asks': total_asks,
            'active_orders': total_bids + total_asks
        },
        'wallets': {
            'total_wallets': len(wallets)
        }
    }
    
    if forecast_service and forecast_service.models:
        stats['solar'] = {
            'forecast_available': True,
            'plant_id': PLANT_CONFIG.plant_id,
            'capacity_kw': PLANT_CONFIG.capacity_kw,
            'quantiles': forecast_service.quantiles,
            'models_loaded': len(forecast_service.models)
        }
    
    return jsonify(stats)

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'forecast_service': bool(forecast_service and forecast_service.models),
        'blockchain_height': len(blockchain.chain),
        'blockchain_valid': blockchain.is_chain_valid()
    })

# ------------------------------------------------------------------
# WebSocket Events
# ------------------------------------------------------------------

@socketio.on('connect')
def on_connect():
    """Handle client connection"""
    LOGGER.info(f"Client connected: {request.sid}")
    
    with state_lock:
        initial_data = {
            'market_update': {
                'order_book': {
                    'bids': [(p, q, str(t)) for p, q, t in order_book['bids'][:20]],
                    'asks': [(p, q, str(t)) for p, q, t in order_book['asks'][:20]]
                },
                'blockchain': {
                    'height': len(blockchain.chain),
                    'latest_hash': blockchain.chain[-1].hash[:8] + '...'
                }
            }
        }
        
        # Add forecast if available
        if forecast_service and forecast_service.models:
            try:
                forecast = forecast_service.generate_forecast(hours=2, interval_minutes=15)
                initial_data['solar_forecast'] = {
                    'current_forecast': forecast.get('statistics', {}),
                    'plant_capacity_kw': PLANT_CONFIG.capacity_kw
                }
            except Exception as e:
                LOGGER.error(f"Error generating initial forecast: {e}")
        
        socketio.emit('initial_state', initial_data, room=request.sid)

@socketio.on('disconnect')
def on_disconnect():
    """Handle client disconnection"""
    LOGGER.info(f"Client disconnected: {request.sid}")

@socketio.on('request_forecast')
def on_forecast_request(data):
    """Handle real-time forecast requests"""
    if not forecast_service:
        socketio.emit('forecast_error', {'error': 'Forecast service not available'}, room=request.sid)
        return
    
    try:
        hours = data.get('hours', 24)
        forecast = forecast_service.generate_forecast(hours=hours)
        socketio.emit('forecast_update', forecast, room=request.sid)
    except Exception as e:
        LOGGER.error(f"Forecast request error: {e}")
        socketio.emit('forecast_error', {'error': str(e)}, room=request.sid)

# ------------------------------------------------------------------
# Background Engine
# ------------------------------------------------------------------

def start_background():
    """Start background order processing"""
    set_socketio(socketio)
    t = threading.Thread(target=background_order_engine, daemon=True)
    t.start()
    LOGGER.info("✅ Background order engine started")

# ------------------------------------------------------------------
# Main
# ------------------------------------------------------------------

if __name__ == '__main__':
    print("=" * 70)
    print("  🌞 Solar Energy Trading & Forecasting Platform")
    print("=" * 70)
    print(f"\n📍 Plant: {PLANT_CONFIG.plant_id} ({PLANT_CONFIG.capacity_kw} kW)")
    print(f"   Location: {PLANT_CONFIG.latitude}°, {PLANT_CONFIG.longitude}°")
    print(f"   Timezone: {PLANT_CONFIG.timezone}")
    
    print(f"\n🔗 Blockchain:")
    print(f"   Difficulty: {blockchain.difficulty}")
    print(f"   Height: {len(blockchain.chain)}")
    print(f"   Valid: {blockchain.is_chain_valid()}")
    
    if forecast_service and forecast_service.models:
        print(f"\n🔮 Solar Forecasting:")
        print(f"   ✅ ENABLED")
        print(f"   Models: {len(forecast_service.models)}")
        print(f"   Quantiles: {forecast_service.quantiles}")
        print(f"   Model Type: Quantile Residual (YOUR architecture)")
    else:
        print(f"\n🔮 Solar Forecasting:")
        print(f"   ⚠️  DISABLED (no models found in {MODEL_DIR})")
        print(f"   Run: python train.py to train models")
    
    print(f"\n🚀 Starting server on http://0.0.0.0:5000")
    print("=" * 70)
    
    start_background()
    socketio.run(app, host='0.0.0.0', port=5000, debug=False)
