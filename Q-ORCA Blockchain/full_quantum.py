from qiskit import QuantumCircuit, Aer, execute
import numpy as np


def qrng(num_bits=32):
    qc = QuantumCircuit(1, 1)
    backend = Aer.get_backend('qasm_simulator')

    bits = []
    for _ in range(num_bits):
        qc = QuantumCircuit(1, 1)
        qc.h(0)         
        qc.measure(0, 0) 
        job = execute(qc, backend=backend, shots=1)
        res = job.result().get_counts()
        bit = 0 if '0' in res else 1
        bits.append(bit)
    return bits  



def bb84_qkd(num_qubits=32):
    
    backend = Aer.get_backend('qasm_simulator')

    alice_bits = np.random.randint(0, 2, num_qubits)     
    alice_bases = np.random.randint(0, 2, num_qubits)    

    bob_bases = np.random.randint(0, 2, num_qubits)

    bob_results = []

    for i in range(num_qubits):
        qc = QuantumCircuit(1, 1)

        if alice_bases[i] == 0:
            if alice_bits[i] == 1:
                qc.x(0)   
        else:
            if alice_bits[i] == 0:
                qc.h(0)   
            else:
                qc.x(0)
                qc.h(0)     

        if bob_bases[i] == 1:
            qc.h(0)  

        qc.measure(0, 0)
        job = execute(qc, backend=backend, shots=1)
        res = job.result().get_counts()
        bit = 0 if '0' in res else 1
        bob_results.append(bit)


    alice_sifted = []
    bob_sifted = []
    for i in range(num_qubits):
        if alice_bases[i] == bob_bases[i]:
            alice_sifted.append(int(alice_bits[i]))
            bob_sifted.append(int(bob_results[i]))

    return alice_sifted, bob_sifted, alice_bases, bob_bases


def hadamard_matrix(n: int):
    if n == 1:
        return np.array([[1]])
    Hn_1 = hadamard_matrix(n // 2)
    top = np.hstack((Hn_1, Hn_1))
    bottom = np.hstack((Hn_1, -Hn_1))
    return np.vstack((top, bottom))

def orca_encode(messages, H):

    m = np.array(messages, dtype=float)
    return H.dot(m)

def orca_decode(encoded_vec, H, receiver_idx):
    col = H[:, receiver_idx]
    N = H.shape[0]
    return float(np.dot(encoded_vec, col) / N)


def kdf_from_qkd(sifted_key, label=b"enc", out_len=32):

    if len(sifted_key) == 0:
        raise ValueError("no sifted key from QKD")
    bitstring = ''.join(str(b) for b in sifted_key)
    as_int = int(bitstring, 2)
    as_bytes = as_int.to_bytes((as_int.bit_length() + 7) // 8, 'big')
    return (hashlib.sha256(as_bytes + label).digest())[:out_len]


if __name__ == "__main__":
    import hashlib

    print("=== 1) QRNG: real qubit-based randomness (simulated by Qiskit) ===")
    qrng_bits = qrng(16)
    print("QRNG bits:", qrng_bits)

    print("\n=== 2) QKD (BB84) over Qiskit ===")
    alice_sifted, bob_sifted, ab, bb = bb84_qkd(48)
    print("Alice sifted:", alice_sifted)
    print("Bob   sifted:", bob_sifted)
    # 计算误码率
    mismatches = sum(1 for a, b in zip(alice_sifted, bob_sifted) if a != b)
    qber = mismatches / len(alice_sifted) if alice_sifted else 1.0
    print("QBER:", qber)

    if qber > 0.1:
        print("QBER too high, abort key use.")
    else:
        # 从QKD派生真正要用的对称密钥
        shared_key = kdf_from_qkd(alice_sifted)
        print("Derived shared key (hex):", shared_key.hex())

        # 你这里就可以用 shared_key 去加密区块链里的 quantum_payload 了
        # 比如：
        plaintext = b"secret payload in blockchain"
        stream = hashlib.sha256(shared_key + b"nonce123").digest()
        ciphertext = bytes([plaintext[i] ^ stream[i % len(stream)] for i in range(len(plaintext))])
        print("Ciphertext(hex):", ciphertext.hex())

    print("\n=== 3) ORCA encoding (classic) ===")
    # 假设有4个接收者的消息
    H = hadamard_matrix(4)
    msgs = np.array([3, 0, 1, 2], dtype=float)
    y = orca_encode(msgs, H)
    print("Encoded ORCA vector y:", y.tolist())
    # 解一个接收者的
    rec2 = orca_decode(y, H, receiver_idx=2)
    print("Receiver 2 decoded:", rec2)
