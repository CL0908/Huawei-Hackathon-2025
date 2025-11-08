import hashlib
import hmac
import time
import json
import pickle
import threading
import secrets
from typing import List, Dict, Any, Optional, Tuple
from collections import deque


class QuantumHybridChannel:
    def __init__(self, participant_a: str, participant_b: str):
        participants = tuple(sorted((participant_a, participant_b)))
        self.participants: Tuple[str, str] = participants
        # Combining high entropy randomness with the participant identities to
        # emulate a unique quantum-shared secret.
        entropy = secrets.token_bytes(32)
        seed = ("::".join(participants)).encode() + entropy
        self.session_key = hashlib.sha256(seed).digest()
        self.channel_id = hashlib.sha256(self.session_key).hexdigest()
        self.created_at = time.time()

    def _derive_stream(self, nonce: bytes) -> bytes:
        return hashlib.sha256(self.session_key + nonce).digest()

    def encrypt(self, payload: bytes) -> Dict[str, str]:
        nonce = secrets.token_bytes(16)
        stream = self._derive_stream(nonce)
        ciphertext = bytes(b ^ stream[i % len(stream)] for i, b in enumerate(payload))
        integrity = hashlib.sha256(ciphertext + stream).hexdigest()
        return {
            "channel_id": self.channel_id,
            "ciphertext": ciphertext.hex(),
            "nonce": nonce.hex(),
            "integrity": integrity
        }

    def decrypt(self, envelope: Dict[str, str]) -> bytes:
        if envelope.get("channel_id") != self.channel_id:
            raise ValueError("Quantum channel mismatch during decryption")
        nonce = bytes.fromhex(envelope["nonce"])
        stream = self._derive_stream(nonce)
        ciphertext = bytes.fromhex(envelope["ciphertext"])
        expected_integrity = hashlib.sha256(ciphertext + stream).hexdigest()
        if envelope.get("integrity") != expected_integrity:
            raise ValueError("Quantum channel integrity check failed")
        return bytes(c ^ stream[i % len(stream)] for i, c in enumerate(ciphertext))


class SimpleSigningKey:

    def __init__(self):
        self._private = secrets.token_bytes(32)

    def sign(self, data: bytes) -> bytes:
        return hmac.new(self._private, data, hashlib.sha256).digest()

    def get_verifying_key(self) -> "SimpleVerifyingKey":
        return SimpleVerifyingKey(self._private)


class SimpleVerifyingKey:
    def __init__(self, private_material: bytes):
        self._private = private_material
        self._public = hashlib.sha256(private_material).digest()

    def verify(self, signature: bytes, data: bytes) -> bool:
        expected = hmac.new(self._private, data, hashlib.sha256).digest()
        return hmac.compare_digest(signature, expected)

    def to_string(self) -> bytes:
        return self._public


class QuantumParticipant:

    def __init__(self, label: str):
        self.label = label
        self._signing_key = SimpleSigningKey()
        self.verifying_key = self._signing_key.get_verifying_key()
        self.address = self.verifying_key.to_string().hex()

    @property
    def signing_key(self) -> SimpleSigningKey:
        return self._signing_key


class Transaction:
    def __init__(self, sender: str, recipient: str, amount: float, signature: bytes = None,
                 quantum_payload: Optional[Dict[str, str]] = None):
        self.sender = sender
        self.recipient = recipient
        self.amount = amount
        self.signature = signature
        self.timestamp = time.time()
        self.quantum_payload = quantum_payload

    def to_dict(self) -> Dict[str, Any]:
        data = {
            "sender": self.sender,
            "recipient": self.recipient,
            "amount": self.amount,
            "timestamp": self.timestamp
        }
        if self.quantum_payload:
            data["quantum_payload"] = self.quantum_payload
        return data

    def sign_transaction(self, private_key: SimpleSigningKey):
        # Sign the transaction using the lightweight signer
        transaction_string = json.dumps(self.to_dict(), sort_keys=True)
        self.signature = private_key.sign(transaction_string.encode())

    def verify_signature(self, public_key: SimpleVerifyingKey) -> bool:
        # Verify the transaction signature
        try:
            transaction_string = json.dumps(self.to_dict(), sort_keys=True)
            return public_key.verify(self.signature, transaction_string.encode())
        except Exception:
            return False

    def attach_quantum_payload(self, channel: QuantumHybridChannel):
        context = {
            "amount": self.amount,
            "recipient": self.recipient,
            "sender": self.sender,
            "timestamp": self.timestamp
        }
        message = json.dumps(context, sort_keys=True).encode()
        self.quantum_payload = channel.encrypt(message)

    def decrypt_quantum_payload(self, channel: QuantumHybridChannel) -> Dict[str, Any]:
        if not self.quantum_payload:
            raise ValueError("No quantum payload present on this transaction")
        message = channel.decrypt(self.quantum_payload)
        return json.loads(message.decode())
        
    

class Block:
    def __init__(self, index: int, transactions: List[Transaction], timestamp: float, previous_hash: str, nonce: int = 0):
        self.index = index
        self.transactions = transactions
        self.timestamp = timestamp
        self.previous_hash = previous_hash
        self.nonce = nonce
        self.merkle_root = self.calculate_merkle_root()
        self.hash = self.calculate_hash()

    def calculate_merkle_root(self) -> str:
        # Calculate Merkle root for transactions
        if not self.transactions:
            return ""
        leaves = [hashlib.sha256(json.dumps(tx.to_dict(), sort_keys=True).encode()).hexdigest() for tx in self.transactions]
        while len(leaves) > 1:
            temp_leaves = []
            for i in range(0, len(leaves), 2):
                if i + 1 < len(leaves):
                    combined = leaves[i] + leaves[i + 1]
                    temp_leaves.append(hashlib.sha256(combined.encode()).hexdigest())
                else:
                    temp_leaves.append(leaves[i])
            leaves = temp_leaves
        return leaves[0]

    def calculate_hash(self) -> str:
        # Compute SHA-256 hash including Merkle root
        block_string = json.dumps({
            "index": self.index,
            "merkle_root": self.merkle_root,
            "timestamp": self.timestamp,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()

class Blockchain:
    def __init__(self, difficulty: int = 4, max_block_transactions: int = 10):
        self.chain: List[Block] = []
        self.difficulty = difficulty
        self.max_block_transactions = max_block_transactions
        self.mempool: deque = deque()  # Pending transactions
        self.nodes: set = set()  # Set of peer nodes (URLs or IDs)
        self.lock = threading.RLock()  # Thread-safe operations
        self.identity_registry: Dict[str, SimpleVerifyingKey] = {}
        self.quantum_participants: Dict[str, QuantumParticipant] = {}
        self.quantum_channels: Dict[Tuple[str, str], QuantumHybridChannel] = {}
        self.create_genesis_block()
        self._bootstrap_quantum_demo_participants()

    def _bootstrap_quantum_demo_participants(self):
        # Default Alice/Bob identities showcase the quantum-hybrid handshake
        alice = QuantumParticipant("Alice")
        bob = QuantumParticipant("Bob")
        self.register_quantum_participant(alice)
        self.register_quantum_participant(bob)
        self.establish_quantum_channel(alice.label, bob.label)

    def register_quantum_participant(self, participant: QuantumParticipant):
        self.quantum_participants[participant.label] = participant
        # Allow addressing by human-readable label or raw public key hex
        self.identity_registry[participant.label] = participant.verifying_key
        self.identity_registry[participant.address] = participant.verifying_key
        self.nodes.add(participant.label)

    def establish_quantum_channel(self, label_a: str, label_b: str) -> QuantumHybridChannel:
        if label_a not in self.quantum_participants or label_b not in self.quantum_participants:
            raise ValueError("Both participants must be registered before establishing a channel")
        pair = tuple(sorted((label_a, label_b)))
        channel = self.quantum_channels.get(pair)
        if channel is None:
            channel = QuantumHybridChannel(label_a, label_b)
            self.quantum_channels[pair] = channel
        return channel

    def get_quantum_channel(self, label_a: str, label_b: str) -> Optional[QuantumHybridChannel]:
        pair = tuple(sorted((label_a, label_b)))
        return self.quantum_channels.get(pair)

    def create_quantum_transaction(self, sender_label: str, recipient_label: str, amount: float) -> Transaction:
        if sender_label not in self.quantum_participants:
            raise ValueError(f"Unknown quantum participant: {sender_label}")
        if recipient_label not in self.quantum_participants:
            raise ValueError(f"Unknown quantum participant: {recipient_label}")
        channel = self.establish_quantum_channel(sender_label, recipient_label)
        transaction = Transaction(sender_label, recipient_label, amount)
        transaction.attach_quantum_payload(channel)
        transaction.sign_transaction(self.quantum_participants[sender_label].signing_key)
        return transaction

    def decrypt_quantum_transaction(self, transaction: Transaction, label_a: str, label_b: str) -> Dict[str, Any]:
        channel = self.get_quantum_channel(label_a, label_b)
        if channel is None:
            raise ValueError("Requested channel is not established for decryption")
        return transaction.decrypt_quantum_payload(channel)

    def create_genesis_block(self):
        # Create the first block
        genesis_block = Block(0, [], time.time(), "0")
        genesis_block.hash = self.proof_of_work(genesis_block)
        self.chain.append(genesis_block)

    def proof_of_work(self, block: Block) -> str:
        # Enhanced Proof of Work with difficulty adjustment
        while True:
            if block.hash[:self.difficulty] == "0" * self.difficulty:
                return block.hash
            block.nonce += 1
            block.merkle_root = block.calculate_merkle_root()
            block.hash = block.calculate_hash()

    def add_transaction(self, transaction: Transaction) -> bool:
        # Validate and add transaction to mempool
        if not self.validate_transaction(transaction):
            return False
        with self.lock:
            self.mempool.append(transaction)
            if len(self.mempool) >= self.max_block_transactions:
                self.mine_pending_transactions()
            return True

    def validate_transaction(self, transaction: Transaction) -> bool:
        # Basic transaction validation (extend as needed)
        if transaction.amount <= 0:
            return False
        # Verify signature if sender is not "network" (e.g., mining reward)
        if transaction.sender != "network":
            public_key = self.get_public_key(transaction.sender)
            if not public_key or not transaction.verify_signature(public_key):
                return False
        return True

    def get_public_key(self, address: str) -> Optional[SimpleVerifyingKey]:
        # Retrieve public key from registry if available
        return self.identity_registry.get(address)

    def mine_pending_transactions(self):
        # Mine a new block with transactions from mempool
        with self.lock:
            transactions = []
            while self.mempool and len(transactions) < self.max_block_transactions:
                transactions.append(self.mempool.popleft())
            # Add mining reward
            reward_transaction = Transaction("network", "miner_address", 10.0)
            transactions.insert(0, reward_transaction)
            self.add_block(transactions)

    def add_block(self, transactions: List[Transaction]):
        # Create and add a new block
        previous_block = self.chain[-1]
        new_block = Block(len(self.chain), transactions, time.time(), previous_block.hash)
        new_block.hash = self.proof_of_work(new_block)
        with self.lock:
            self.chain.append(new_block)
            self.broadcast_block(new_block)

    def is_chain_valid(self) -> bool:
        # Validate the entire chain
        for i in range(1, len(self.chain)):
            current = self.chain[i]
            previous = self.chain[i - 1]
            # Verify current block's hash
            if current.hash != current.calculate_hash():
                print(f"Invalid hash in block {i}")
                return False
            # Verify chain linkage
            if current.previous_hash != previous.hash:
                print(f"Invalid previous hash in block {i}")
                return False
            # Verify Proof of Work
            if current.hash[:self.difficulty] != "0" * self.difficulty:
                print(f"Invalid Proof of Work in block {i}")
                return False
            # Verify transactions
            for tx in current.transactions:
                if not self.validate_transaction(tx):
                    print(f"Invalid transaction in block {i}")
                    return False
        return True

    def broadcast_block(self, block: Block):
        # Simulate broadcasting to other nodes (extend for real P2P)
        for node in self.nodes:
            print(f"Broadcasting block {block.index} to node {node}")

    def add_node(self, node: str):
        # Add a peer node
        self.nodes.add(node)

    def save_chain(self, filename: str):
        # Serialize and save the blockchain
        with open(filename, 'wb') as f:
            pickle.dump(self.chain, f)

    def load_chain(self, filename: str) -> bool:
        # Load blockchain from file
        try:
            with open(filename, 'rb') as f:
                self.chain = pickle.load(f)
            return self.is_chain_valid()
        except Exception as e:
            print(f"Error loading chain: {e}")
            return False



def trade_to_transaction(trade: Dict, buyer_id: str, seller_id: str) -> Transaction:
    # Payload: energy kWh, price per kWh, total USD
    amount_usd = trade['price'] * trade['qty']
    tx = Transaction(
        sender=seller_id,
        recipient=buyer_id,
        amount=amount_usd
    )
    return tx
