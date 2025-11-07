import random
import math
import numpy as np
import matplotlib.pyplot as plt
from typing import List, Dict

# =========================
# 1. ORCA 工具（经典正交编码）
# =========================
def hadamard_matrix(n: int):
    if n == 1:
        return np.array([[1]])
    h = hadamard_matrix(n // 2)
    top = np.hstack((h, h))
    bottom = np.hstack((h, -h))
    return np.vstack((top, bottom))

def orca_encode(messages: List[int], H: np.ndarray) -> List[float]:
    v = np.array(messages, dtype=float)
    return (H @ v).tolist()

# =========================
# 2. 模拟一个节点的传感数据
# =========================
class SimulatedNode:
    def __init__(self, node_id: str,
                 base_current: float = 5.0,
                 qrng_base_len: int = 128,
                 anomaly_time: int = None,
                 anomaly_type: str = None):
        """
        anomaly_type:
          - 'current_spike'   电流突然大波动
          - 'entropy_flat'    熵突然不变
          - 'entropy_noise'   熵乱跳
        """
        self.node_id = node_id
        self.base_current = base_current
        self.qrng_base_len = qrng_base_len
        self.anomaly_time = anomaly_time
        self.anomaly_type = anomaly_type

    def generate_series(self, T: int = 100) -> Dict[str, List[float]]:
        currents = []
        entropies = []
        for t in range(T):
            # 正常电流：围绕 base_current 上下抖动
            if self.anomaly_type == 'current_spike' and self.anomaly_time is not None and t > self.anomaly_time:
                # 故意让它不稳定
                current = self.base_current + random.uniform(-3.0, 3.0)
            else:
                current = self.base_current + random.uniform(-0.3, 0.3)

            # 正常熵长度：围绕 qrng_base_len 上下2~3字符波动
            if self.anomaly_type == 'entropy_flat' and self.anomaly_time is not None and t > self.anomaly_time:
                entropy_len = self.qrng_base_len  # 一直不变 → 可疑
            elif self.anomaly_type == 'entropy_noise' and self.anomaly_time is not None and t > self.anomaly_time:
                entropy_len = self.qrng_base_len + random.randint(-20, 20)  # 乱跳
            else:
                entropy_len = self.qrng_base_len + random.randint(-3, 3)

            currents.append(current)
            entropies.append(entropy_len)

        return {"current": currents, "entropy_len": entropies}

# =========================
# 3. 安全指数计算
# =========================
def rolling_volatility(data: List[float], window: int = 5) -> List[float]:
    vols = []
    for i in range(len(data)):
        start = max(0, i - window + 1)
        window_data = data[start:i+1]
        vols.append(np.std(window_data))
    return vols

def compute_safety_score(curr_vol: float, ent_vol: float,
                         alpha: float = 2.0, beta: float = 1.0) -> float:
    """
    简单可讲的安全分数：
      score = 1 / (1 + α*curr_vol + β*ent_vol)
    波动越大，分数越低
    """
    return 1.0 / (1.0 + alpha * curr_vol + beta * ent_vol)

# =========================
# 4. 主模拟流程
# =========================
def simulate_system():
    T = 120  # 时间长度
    # 三个节点：一个正常，一个电流异常，一个量子熵异常
    nodes = [
        SimulatedNode("socket-1", base_current=5.0, anomaly_time=None, anomaly_type=None),
        SimulatedNode("pv-string-2", base_current=6.0, anomaly_time=50, anomaly_type="current_spike"),
        SimulatedNode("inverter-3", base_current=4.5, anomaly_time=70, anomaly_type="entropy_flat"),
    ]

    all_series = {}
    for n in nodes:
        all_series[n.node_id] = n.generate_series(T)

    # 计算每个节点的波动率 & 安全分数
    safety_scores = {}
    for node_id, series in all_series.items():
        curr = series["current"]
        ent = series["entropy_len"]
        curr_vols = rolling_volatility(curr, window=6)
        ent_vols = rolling_volatility(ent, window=6)
        scores = []
        for cv, ev in zip(curr_vols, ent_vols):
            s = compute_safety_score(cv, ev, alpha=2.0, beta=0.05)  # 电流权重大一点
            scores.append(s)
        safety_scores[node_id] = {
            "curr": curr,
            "ent": ent,
            "curr_vol": curr_vols,
            "ent_vol": ent_vols,
            "score": scores
        }

    # 找出低于阈值的节点，准备 ORCA 告警
    THRESH = 0.4
    risky_nodes = []
    for node_id, data in safety_scores.items():
        if min(data["score"]) < THRESH:
            risky_nodes.append(node_id)

    # 用 ORCA 把 risky 节点打包（最多4个）
    H = hadamard_matrix(4)
    # 简单约定：每个位置 1 代表这个节点高危，0 代表正常
    msg_vec = [0, 0, 0, 0]
    for i, nid in enumerate(risky_nodes[:4]):
        msg_vec[i] = 1
    orca_payload = orca_encode(msg_vec, H)

    print("Risky nodes detected:", risky_nodes)
    print("ORCA encoded alert payload:", orca_payload)

    # =========================
    # 5. 可视化
    # =========================
    fig, axs = plt.subplots(3, 2, figsize=(12, 9))
    time_axis = list(range(T))

    for idx, (node_id, data) in enumerate(safety_scores.items()):
        r = idx  # row
        # 电流
        axs[r][0].plot(time_axis, data["curr"], label="current (A)")
        axs[r][0].set_title(f"{node_id} - current")
        axs[r][0].legend()

        # 安全分数
        axs[r][1].plot(time_axis, data["score"], label="safety score")
        axs[r][1].axhline(THRESH, color='red', linestyle='--', label='threshold')
        axs[r][1].set_ylim(0, 1.1)
        axs[r][1].set_title(f"{node_id} - safety score")
        axs[r][1].legend()

    plt.tight_layout()
    plt.show()


if __name__ == "__main__":
    simulate_system()
