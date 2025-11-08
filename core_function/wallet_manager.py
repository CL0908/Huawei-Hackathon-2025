# wallet_manager.py
import ecdsa
import binascii
import hashlib
import json
import threading
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from collections import defaultdict

class EnergyWallet:
    """Individual wallet for energy trading with blockchain integration"""
    
    def __init__(self, user_id: str, huawei_id: str, private_key: ecdsa.SigningKey = None):
        self.user_id = user_id
        self.huawei_id = huawei_id  # Virtual common ID for smart home integration
        
        # Generate or use existing key pair
        if private_key:
            self.private_key = private_key
        else:
            self.private_key = ecdsa.SigningKey.generate(curve=ecdsa.SECP256k1)
        
        self.public_key = self.private_key.verifying_key
        self.address = self._generate_address()
        
        # Balances
        self.energy_balance = 0.0  # kWh
        self.fiat_balance = 1000.0  # USD (initial balance for demo)
        
        # Transaction history
        self.transaction_history: List[Dict] = []
        self.pending_transactions: List[Dict] = []
        
        # Smart home connection status
        self.huawei_connected = False
        self.last_sync_time = None
        
    def _generate_address(self) -> str:
        """Generate wallet address from public key"""
        pub_key_bytes = self.public_key.to_string()
        # Create a hash of the public key
        sha256_hash = hashlib.sha256(pub_key_bytes).digest()
        ripemd160 = hashlib.new('ripemd160', sha256_hash).digest()
        return binascii.hexlify(ripemd160).decode()
    
    def get_private_key_hex(self) -> str:
        """Export private key as hex string"""
        return binascii.hexlify(self.private_key.to_string()).decode()
    
    def get_public_key_hex(self) -> str:
        """Export public key as hex string"""
        return binascii.hexlify(self.public_key.to_string()).decode()
    
    def sign_data(self, data: str) -> bytes:
        """Sign arbitrary data with private key"""
        return self.private_key.sign(data.encode())
    
    def verify_signature(self, data: str, signature: bytes, public_key_hex: str = None) -> bool:
        """Verify signature against data"""
        try:
            if public_key_hex:
                vk = ecdsa.VerifyingKey.from_string(
                    bytes.fromhex(public_key_hex), 
                    curve=ecdsa.SECP256k1
                )
            else:
                vk = self.public_key
            return vk.verify(signature, data.encode())
        except:
            return False
    
    def add_energy(self, amount: float, source: str = "production"):
        """Add energy to wallet (from solar panels, etc.)"""
        if amount > 0:
            self.energy_balance += amount
            self._record_transaction({
                'type': 'energy_deposit',
                'amount': amount,
                'source': source,
                'timestamp': datetime.now().isoformat(),
                'new_balance': self.energy_balance
            })
    
    def deduct_energy(self, amount: float, reason: str = "consumption") -> bool:
        """Deduct energy from wallet"""
        if amount <= self.energy_balance:
            self.energy_balance -= amount
            self._record_transaction({
                'type': 'energy_withdrawal',
                'amount': amount,
                'reason': reason,
                'timestamp': datetime.now().isoformat(),
                'new_balance': self.energy_balance
            })
            return True
        return False
    
    def add_fiat(self, amount: float, source: str = "sale"):
        """Add fiat currency to wallet"""
        if amount > 0:
            self.fiat_balance += amount
            self._record_transaction({
                'type': 'fiat_deposit',
                'amount': amount,
                'source': source,
                'timestamp': datetime.now().isoformat(),
                'new_balance': self.fiat_balance
            })
    
    def deduct_fiat(self, amount: float, reason: str = "purchase") -> bool:
        """Deduct fiat from wallet"""
        if amount <= self.fiat_balance:
            self.fiat_balance -= amount
            self._record_transaction({
                'type': 'fiat_withdrawal',
                'amount': amount,
                'reason': reason,
                'timestamp': datetime.now().isoformat(),
                'new_balance': self.fiat_balance
            })
            return True
        return False
    
    def _record_transaction(self, transaction: Dict):
        """Record transaction in history"""
        transaction['wallet_id'] = self.user_id
        transaction['address'] = self.address
        self.transaction_history.append(transaction)
    
    def get_balance_summary(self) -> Dict:
        """Get current balance summary"""
        return {
            'user_id': self.user_id,
            'huawei_id': self.huawei_id,
            'address': self.address,
            'energy_balance_kwh': round(self.energy_balance, 2),
            'fiat_balance_usd': round(self.fiat_balance, 2),
            'huawei_connected': self.huawei_connected,
            'last_sync': self.last_sync_time
        }
    
    def connect_huawei_smart_home(self, huawei_id: str) -> bool:
        """Connect wallet to Huawei Smart Home system"""
        # In production, this would authenticate with Huawei API
        if huawei_id == self.huawei_id:
            self.huawei_connected = True
            self.last_sync_time = datetime.now().isoformat()
            return True
        return False
    
    def disconnect_huawei_smart_home(self):
        """Disconnect from Huawei Smart Home"""
        self.huawei_connected = False
    
    def to_dict(self) -> Dict:
        """Serialize wallet data"""
        return {
            'user_id': self.user_id,
            'huawei_id': self.huawei_id,
            'address': self.address,
            'public_key': self.get_public_key_hex(),
            'energy_balance': self.energy_balance,
            'fiat_balance': self.fiat_balance,
            'huawei_connected': self.huawei_connected,
            'last_sync_time': self.last_sync_time,
            'transaction_count': len(self.transaction_history)
        }


class WalletManager:
    """Central manager for all energy wallets with P2P transaction support"""
    
    def __init__(self):
        self.wallets: Dict[str, EnergyWallet] = {}
        self.address_to_user: Dict[str, str] = {}
        self.huawei_to_user: Dict[str, str] = {}
        self.lock = threading.Lock()
        
        # P2P transaction tracking
        self.pending_p2p_trades: List[Dict] = []
        self.completed_p2p_trades: List[Dict] = []
    
    def create_wallet(self, user_id: str, huawei_id: str) -> EnergyWallet:
        """Create a new wallet for a user"""
        with self.lock:
            if user_id in self.wallets:
                raise ValueError(f"Wallet already exists for user {user_id}")
            
            if huawei_id in self.huawei_to_user:
                raise ValueError(f"Huawei ID {huawei_id} already registered")
            
            wallet = EnergyWallet(user_id, huawei_id)
            self.wallets[user_id] = wallet
            self.address_to_user[wallet.address] = user_id
            self.huawei_to_user[huawei_id] = user_id
            
            return wallet
    
    def get_wallet(self, user_id: str) -> Optional[EnergyWallet]:
        """Get wallet by user ID"""
        return self.wallets.get(user_id)
    
    def get_wallet_by_address(self, address: str) -> Optional[EnergyWallet]:
        """Get wallet by blockchain address"""
        user_id = self.address_to_user.get(address)
        if user_id:
            return self.wallets.get(user_id)
        return None
    
    def get_wallet_by_huawei_id(self, huawei_id: str) -> Optional[EnergyWallet]:
        """Get wallet by Huawei Smart Home ID"""
        user_id = self.huawei_to_user.get(huawei_id)
        if user_id:
            return self.wallets.get(user_id)
        return None
    
    def execute_p2p_energy_trade(self, 
                                  seller_id: str, 
                                  buyer_id: str, 
                                  energy_kwh: float, 
                                  price_per_kwh: float) -> Tuple[bool, str, Optional[Dict]]:
        """
        Execute P2P energy trade between two users
        Returns: (success, message, transaction_details)
        """
        with self.lock:
            seller_wallet = self.get_wallet(seller_id)
            buyer_wallet = self.get_wallet(buyer_id)
            
            if not seller_wallet:
                return False, f"Seller wallet not found: {seller_id}", None
            
            if not buyer_wallet:
                return False, f"Buyer wallet not found: {buyer_id}", None
            
            total_cost = energy_kwh * price_per_kwh
            
            # Check seller has enough energy
            if seller_wallet.energy_balance < energy_kwh:
                return False, f"Insufficient energy balance. Available: {seller_wallet.energy_balance} kWh", None
            
            # Check buyer has enough fiat
            if buyer_wallet.fiat_balance < total_cost:
                return False, f"Insufficient fiat balance. Available: ${buyer_wallet.fiat_balance}", None
            
            # Execute trade
            seller_wallet.deduct_energy(energy_kwh, f"P2P sale to {buyer_id}")
            buyer_wallet.add_energy(energy_kwh, f"P2P purchase from {seller_id}")
            
            buyer_wallet.deduct_fiat(total_cost, f"P2P energy purchase from {seller_id}")
            seller_wallet.add_fiat(total_cost, f"P2P energy sale to {buyer_id}")
            
            # Record trade
            trade_record = {
                'trade_id': f"P2P-{datetime.now().timestamp()}",
                'seller_id': seller_id,
                'seller_address': seller_wallet.address,
                'buyer_id': buyer_id,
                'buyer_address': buyer_wallet.address,
                'energy_kwh': energy_kwh,
                'price_per_kwh': price_per_kwh,
                'total_cost': total_cost,
                'timestamp': datetime.now().isoformat(),
                'status': 'completed'
            }
            
            self.completed_p2p_trades.append(trade_record)
            
            return True, "Trade executed successfully", trade_record
    
    def create_p2p_trade_offer(self, 
                                seller_id: str, 
                                energy_kwh: float, 
                                price_per_kwh: float,
                                expiry_minutes: int = 30) -> Tuple[bool, str, Optional[str]]:
        """
        Create a P2P trade offer
        Returns: (success, message, offer_id)
        """
        seller_wallet = self.get_wallet(seller_id)
        
        if not seller_wallet:
            return False, f"Seller wallet not found: {seller_id}", None
        
        if seller_wallet.energy_balance < energy_kwh:
            return False, f"Insufficient energy balance. Available: {seller_wallet.energy_balance} kWh", None
        
        offer_id = f"OFFER-{datetime.now().timestamp()}"
        expiry_time = datetime.now().timestamp() + (expiry_minutes * 60)
        
        offer = {
            'offer_id': offer_id,
            'seller_id': seller_id,
            'seller_address': seller_wallet.address,
            'seller_huawei_id': seller_wallet.huawei_id,
            'energy_kwh': energy_kwh,
            'price_per_kwh': price_per_kwh,
            'total_cost': energy_kwh * price_per_kwh,
            'created_at': datetime.now().isoformat(),
            'expiry_timestamp': expiry_time,
            'status': 'pending'
        }
        
        with self.lock:
            self.pending_p2p_trades.append(offer)
        
        return True, "Offer created successfully", offer_id
    
    def accept_p2p_trade_offer(self, offer_id: str, buyer_id: str) -> Tuple[bool, str, Optional[Dict]]:
        """
        Accept a pending P2P trade offer
        Returns: (success, message, transaction_details)
        """
        with self.lock:
            # Find the offer
            offer = None
            for trade in self.pending_p2p_trades:
                if trade['offer_id'] == offer_id and trade['status'] == 'pending':
                    offer = trade
                    break
            
            if not offer:
                return False, "Offer not found or already completed", None
            
            # Check if expired
            if datetime.now().timestamp() > offer['expiry_timestamp']:
                offer['status'] = 'expired'
                return False, "Offer has expired", None
            
            # Execute the trade
            success, message, trade_record = self.execute_p2p_energy_trade(
                offer['seller_id'],
                buyer_id,
                offer['energy_kwh'],
                offer['price_per_kwh']
            )
            
            if success:
                offer['status'] = 'completed'
                offer['buyer_id'] = buyer_id
                offer['completed_at'] = datetime.now().isoformat()
            
            return success, message, trade_record
    
    def get_active_offers(self) -> List[Dict]:
        """Get all active P2P trade offers"""
        current_time = datetime.now().timestamp()
        active_offers = []
        
        with self.lock:
            for offer in self.pending_p2p_trades:
                if offer['status'] == 'pending' and offer['expiry_timestamp'] > current_time:
                    active_offers.append(offer.copy())
        
        return active_offers
    
    def sync_huawei_energy_data(self, user_id: str, produced_kwh: float, consumed_kwh: float) -> bool:
        """
        Sync energy production/consumption data from Huawei Smart Home
        This would connect to Huawei API in production
        """
        wallet = self.get_wallet(user_id)
        
        if not wallet:
            return False
        
        if not wallet.huawei_connected:
            return False
        
        # Net energy calculation
        net_energy = produced_kwh - consumed_kwh
        
        if net_energy > 0:
            # Surplus energy - add to wallet
            wallet.add_energy(net_energy, "Huawei Smart Home - Solar Production")
        else:
            # Deficit - deduct from wallet (if available)
            wallet.deduct_energy(abs(net_energy), "Huawei Smart Home - Consumption")
        
        wallet.last_sync_time = datetime.now().isoformat()
        return True
    
    def get_user_trading_history(self, user_id: str) -> Dict:
        """Get complete trading history for a user"""
        wallet = self.get_wallet(user_id)
        
        if not wallet:
            return {'error': 'Wallet not found'}
        
        # Filter trades where user was buyer or seller
        user_trades = [
            trade for trade in self.completed_p2p_trades
            if trade['seller_id'] == user_id or trade['buyer_id'] == user_id
        ]
        
        return {
            'user_id': user_id,
            'wallet_address': wallet.address,
            'wallet_transactions': wallet.transaction_history[-50:],  # Last 50
            'p2p_trades': user_trades,
            'total_p2p_trades': len(user_trades)
        }
    
    def get_market_statistics(self) -> Dict:
        """Get overall market statistics"""
        with self.lock:
            total_energy = sum(w.energy_balance for w in self.wallets.values())
            total_fiat = sum(w.fiat_balance for w in self.wallets.values())
            
            active_offers_count = len([
                o for o in self.pending_p2p_trades 
                if o['status'] == 'pending' and o['expiry_timestamp'] > datetime.now().timestamp()
            ])
            
            total_volume = sum(t['energy_kwh'] for t in self.completed_p2p_trades)
            total_value = sum(t['total_cost'] for t in self.completed_p2p_trades)
            
            avg_price = total_value / total_volume if total_volume > 0 else 0
        
        return {
            'total_wallets': len(self.wallets),
            'total_energy_in_system_kwh': round(total_energy, 2),
            'total_fiat_in_system_usd': round(total_fiat, 2),
            'active_offers': active_offers_count,
            'completed_trades': len(self.completed_p2p_trades),
            'total_energy_traded_kwh': round(total_volume, 2),
            'total_value_traded_usd': round(total_value, 2),
            'average_price_per_kwh': round(avg_price, 4),
            'timestamp': datetime.now().isoformat()
        }
    
    def list_all_wallets(self) -> List[Dict]:
        """List all wallets with basic info"""
        with self.lock:
            return [wallet.to_dict() for wallet in self.wallets.values()]


# Global wallet manager instance
wallet_manager = WalletManager()
