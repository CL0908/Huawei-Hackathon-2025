from __future__ import annotations

import json
import math
import random
from dataclasses import dataclass, field
from typing import Dict, List, Tuple, Optional, Any

import numpy as np
import matplotlib.pyplot as plt
try:
    import networkx as nx
except ImportError:  # pragma: no cover - fallback when networkx missing
    nx = None

from block_chain_templates import QuantumBlockchain, ALERT_RECIPIENTS, next_power_of_two


TRADING_RECIPIENTS = [
    "CommunityDAO",
    "MicrogridOperator",
    "MunicipalUtility",
    "RegulatoryAuditor",
]


@dataclass
class CommunityProsumer:
    label: str
    base_generation: float  # kW
    base_load: float        # kW
    storage_capacity: float = 4.0  # kWh
    storage_state: float = 2.0
    risk_aversion: float = 0.2
    locality: str = "cluster-A"
    profile_seed: int = field(default_factory=lambda: random.randint(1, 10_000))

    def _daylight_factor(self, t: int, steps_per_day: int) -> float:
        x = (t % steps_per_day) / steps_per_day
        return max(0.0, math.sin(math.pi * x)) ** 1.4

    def forecast(self, t: int, steps_per_day: int, weather_scale: float) -> Dict[str, float]:
        rng = random.Random(self.profile_seed + t)
        daylight = self._daylight_factor(t, steps_per_day) * weather_scale
        generation = max(0.0, self.base_generation * daylight * rng.uniform(0.85, 1.05))
        demand = self.base_load * rng.uniform(0.9, 1.1)

        net = generation - demand
        price_bias = 0.12 * (0.5 - self.risk_aversion) + rng.uniform(-0.01, 0.01)
        willingness = 0.18 + price_bias
        willingness = max(0.08, min(0.35, willingness))

        storage_delta = 0.0
        if net > 0 and self.storage_state < self.storage_capacity:
            charge = min(net, self.storage_capacity - self.storage_state)
            self.storage_state += charge
            net -= charge
            storage_delta = charge
        elif net < 0 and self.storage_state > 0:
            discharge = min(-net, self.storage_state)
            self.storage_state -= discharge
            net += discharge
            storage_delta = -discharge

        return {
            "generation": generation,
            "demand": demand,
            "net": net,
            "willingness": willingness,
            "storage_state": self.storage_state,
            "storage_delta": storage_delta,
        }


class TradingEngine:
    def __init__(self, participants: List[CommunityProsumer], periods: int = 48):
        self.participants = participants
        self.periods = periods
        self.steps_per_day = periods

        orca_size = next_power_of_two(max(len(TRADING_RECIPIENTS), len(ALERT_RECIPIENTS)))
        self.blockchain = QuantumBlockchain(difficulty=2, orca_size=orca_size)
        self._register_participants()

    def _register_participants(self):
        self.blockchain.register_participant("GridClearingHouse")
        for label in set(TRADING_RECIPIENTS + ALERT_RECIPIENTS):
            self.blockchain.register_participant(label)
        for prosumer in self.participants:
            self.blockchain.register_participant(prosumer.label)

    def _weather_scale(self, t: int) -> float:
        # simulate clouds and weather volatility
        storm = math.sin(2 * math.pi * t / self.periods * random.uniform(0.8, 1.2))
        return max(0.4, 0.9 + 0.15 * storm + random.uniform(-0.05, 0.05))

    def _clear_market(self, offers: List[Dict[str, float]], bids: List[Dict[str, float]]) -> Tuple[List[Dict], float]:
        offers_sorted = sorted(offers, key=lambda x: x["price"])
        bids_sorted = sorted(bids, key=lambda x: x["price"], reverse=True)
        trades = []
        clearing_price = None
        o_idx = b_idx = 0
        while o_idx < len(offers_sorted) and b_idx < len(bids_sorted):
            offer = offers_sorted[o_idx]
            bid = bids_sorted[b_idx]
            if offer["price"] > bid["price"]:
                break
            volume = min(offer["energy"], bid["energy"])
            price = (offer["price"] + bid["price"]) / 2.0
            trades.append({
                "seller": offer["seller"],
                "buyer": bid["buyer"],
                "energy": volume,
                "price": price,
                "offer_price": offer["price"],
                "bid_price": bid["price"],
            })
            offer["energy"] -= volume
            bid["energy"] -= volume
            clearing_price = price
            if offer["energy"] <= 1e-6:
                o_idx += 1
            if bid["energy"] <= 1e-6:
                b_idx += 1
        return trades, clearing_price if clearing_price is not None else 0.0

    def _orca_payload(self, price_signal: float, congestion_ratio: float) -> List[float]:
        base = [
            round(price_signal * (1.05 + 0.05 * idx), 4)
            for idx in range(len(TRADING_RECIPIENTS))
        ]
        padding = max(0, self.blockchain.orca.H.shape[0] - len(base))
        base.extend([congestion_ratio] * padding)
        return base[: self.blockchain.orca.H.shape[0]]

    def _broadcast_trade(self, trade: Dict[str, float], t: int,
                         price_signal: float, congestion: float):
        metadata = {
            "event_type": "community_energy_trade",
            "interval": t,
            "energy_kwh": round(trade["energy"], 3),
            "price_per_kwh": round(trade["price"], 4),
            "seller_offer": round(trade["offer_price"], 4),
            "buyer_bid": round(trade["bid_price"], 4),
            "price_signal": round(price_signal, 4),
            "congestion_ratio": round(congestion, 4),
            "participants": {
                "seller": trade["seller"],
                "buyer": trade["buyer"],
            },
            "governance_recipients": TRADING_RECIPIENTS,
        }
        orca_msg = self._orca_payload(price_signal, congestion)
        tx = self.blockchain.create_quantum_tx(
            sender=trade["seller"],
            recipient=trade["buyer"],
            amount=trade["price"] * trade["energy"],
            orca_msg=orca_msg,
            metadata=metadata,
            logical_recipients=TRADING_RECIPIENTS,
        )
        return tx

    def run(self) -> Dict[str, Any]:
        ledger: List[Dict[str, float]] = []
        bc_transactions: List = []
        history: Dict[str, Any] = {
            "times": list(range(self.periods)),
            "price": [],
            "congestion": [],
            "sold_energy": [],
            "demand_energy": [],
            "net_balance": [],
            "weather": [],
            "trade_counts": [],
            "contingency": [],
            "prosumer_net": {p.label: [] for p in self.participants},
            "prosumer_storage": {p.label: [] for p in self.participants},
        }

        for t in range(self.periods):
            weather_scale = self._weather_scale(t)
            offers = []
            bids = []
            net_balance = 0.0

            for peer in self.participants:
                forecast = peer.forecast(t, self.steps_per_day, weather_scale)
                net_balance += forecast["net"]
                price = forecast["willingness"]
                history["prosumer_net"][peer.label].append(forecast["net"])
                history["prosumer_storage"][peer.label].append(peer.storage_state)
                if forecast["net"] > 0.05:
                    offers.append({
                        "seller": peer.label,
                        "energy": forecast["net"],
                        "price": price * (0.9 + 0.2 * peer.risk_aversion),
                    })
                elif forecast["net"] < -0.05:
                    bids.append({
                        "buyer": peer.label,
                        "energy": -forecast["net"],
                        "price": price * (1.05 + 0.15 * (1 - peer.risk_aversion)),
                    })

            trades, clearing_price = self._clear_market(offers, bids)
            sold_energy = sum(trade["energy"] for trade in trades)
            demand_energy = sum(b["energy"] for b in bids)
            congestion = 0.0 if demand_energy <= 1e-6 else min(1.0, sold_energy / demand_energy)
            history["price"].append(float(clearing_price))
            history["congestion"].append(float(congestion))
            history["sold_energy"].append(float(sold_energy))
            history["demand_energy"].append(float(demand_energy))
            history["net_balance"].append(float(net_balance))
            history["weather"].append(float(weather_scale))
            history["trade_counts"].append(len(trades))

            for trade in trades:
                tx = self._broadcast_trade(trade, t, clearing_price, congestion)
                bc_transactions.append(tx)
                ledger.append(trade)

            imbalance_flag = abs(net_balance) > 1.5
            if imbalance_flag:
                contingency_msg = self._orca_payload(
                    price_signal=clearing_price or 0.2,
                    congestion_ratio=congestion or 0.1,
                )
                metadata = {
                    "event_type": "contingency_broadcast",
                    "interval": t,
                    "net_balance_kwh": round(net_balance, 3),
                    "price_hint": round(clearing_price, 4),
                    "message": "Grid support dispatch required",
                    "logical_recipients": TRADING_RECIPIENTS,
                }
                tx = self.blockchain.create_quantum_tx(
                    sender="GridClearingHouse",
                    recipient="CommunityDAO",
                    amount=0.0,
                    orca_msg=contingency_msg,
                    metadata=metadata,
                    logical_recipients=TRADING_RECIPIENTS,
                )
                bc_transactions.append(tx)
            history["contingency"].append(bool(imbalance_flag))

        if bc_transactions:
            self.blockchain.add_block(bc_transactions)

        summary = {
            "total_trades": len(ledger),
            "energy_exchanged_kwh": round(sum(t["energy"] for t in ledger), 3),
            "avg_price": round(np.mean([t["price"] for t in ledger]) if ledger else 0.0, 4),
            "blockchain_valid": self.blockchain.is_valid(),
            "last_block_txs": len(bc_transactions),
        }
        history["ledger"] = ledger
        return {"summary": summary, "history": history}


def visualize_trading(history: Dict[str, Any], summary: Dict[str, Any]):
    times = history["times"]
    fig, axs = plt.subplots(2, 2, figsize=(14, 8), sharex=True)
    fig.suptitle("Community Quantum Blockchain Energy Trading", fontsize=14)

    ax_price = axs[0][0]
    ax_cong = ax_price.twinx()
    ax_price.plot(times, history["price"], color="tab:blue", label="Clearing price (credits/kWh)")
    ax_cong.plot(times, history["congestion"], color="tab:orange", label="Congestion ratio", linestyle="--")
    for t, flag in enumerate(history["contingency"]):
        if flag:
            ax_price.axvspan(t - 0.4, t + 0.4, color="red", alpha=0.1)
    ax_price.set_ylabel("Price (credits/kWh)")
    ax_cong.set_ylabel("Congestion")
    ax_price.set_title("Market price vs congestion (ORCA broadcast signal)")
    handles1, labels1 = ax_price.get_legend_handles_labels()
    handles2, labels2 = ax_cong.get_legend_handles_labels()
    ax_price.legend(handles1 + handles2, labels1 + labels2, loc="upper right")

    ax_energy = axs[0][1]
    ax_energy.bar(times, history["sold_energy"], color="tab:green", alpha=0.7, label="Cleared supply (kWh)")
    ax_energy.plot(times, history["demand_energy"], color="tab:red", marker="o", linewidth=1.2, label="Total demand bids (kWh)")
    ax_energy.plot(times, history["net_balance"], color="tab:purple", linestyle=":", label="Net community balance (kWh)")
    ax_energy.set_title("Energy volumes & community imbalance")
    ax_energy.set_ylabel("kWh")
    ax_energy.legend()

    ax_net = axs[1][0]
    for label, series in history["prosumer_net"].items():
        ax_net.plot(times, series, label=label)
    ax_net.axhline(0.0, color="black", linewidth=0.8)
    ax_net.set_title("Prosumer net injections (generation - load)")
    ax_net.set_ylabel("kWh per interval")
    ax_net.legend(loc="upper right", ncol=2, fontsize=8)

    ax_storage = axs[1][1]
    for label, series in history["prosumer_storage"].items():
        ax_storage.plot(times, series, label=f"{label} storage")
    ax_storage.set_title("Distributed storage state of charge")
    ax_storage.set_xlabel("Trading interval")
    ax_storage.set_ylabel("kWh in storage")
    ax_storage.legend(loc="upper right", ncol=2, fontsize=8)

    footer_text = (
        f"Trades: {summary['total_trades']} | Energy exchanged: {summary['energy_exchanged_kwh']} kWh | "
        f"Avg price: {summary['avg_price']} credits/kWh | Blockchain valid: {summary['blockchain_valid']}"
    )
    fig.text(0.5, 0.02, footer_text, ha="center", fontsize=10)
    plt.tight_layout(rect=(0, 0.04, 1, 0.96))
    plt.show()


def visualize_network_flow(history: Dict[str, Any]):
    ledger = history.get("ledger", [])
    if not ledger:
        print("No trades recorded; skipping network flow visualization.")
        return
    flow_totals: Dict[Tuple[str, str], float] = {}
    nodes = set()
    for trade in ledger:
        key = (trade["seller"], trade["buyer"])
        flow_totals[key] = flow_totals.get(key, 0.0) + trade["energy"]
        nodes.add(trade["seller"])
        nodes.add(trade["buyer"])

    orca_hub = "ORCA Broadcast Hub"
    recipients = TRADING_RECIPIENTS
    nodes.update(recipients)
    nodes.add(orca_hub)

    fig, ax = plt.subplots(figsize=(10, 8))
    ax.set_title("Network Flow Visualization – Quantum-Secured Community Trading", fontsize=13)

    if nx:
        G = nx.DiGraph()
        for node in nodes:
            G.add_node(node)
        for (seller, buyer), energy in flow_totals.items():
            G.add_edge(seller, buyer, weight=energy)
        base_pos = nx.circular_layout([n for n in nodes if n not in recipients and n != orca_hub], scale=2.0)
        # place ORCA hub at top, recipients along bottom arc
        base_pos[orca_hub] = np.array([0.0, 2.6])
        recipient_angles = np.linspace(-np.pi / 2, np.pi / 2, len(recipients))
        for angle, recipient in zip(recipient_angles, recipients):
            base_pos[recipient] = np.array([2.8 * np.cos(angle), -2.4 + 0.8 * np.sin(angle)])

        prosumer_nodes = [n for n in nodes if n not in recipients and n != orca_hub]
        nx.draw_networkx_nodes(G, base_pos, nodelist=prosumer_nodes, node_color="#69b3a2", node_size=800, label="Prosumers", ax=ax)
        nx.draw_networkx_nodes(G, base_pos, nodelist=[orca_hub], node_color="#ffdd57", node_size=900, label="ORCA Hub", ax=ax)
        nx.draw_networkx_nodes(G, base_pos, nodelist=recipients, node_color="#ff8fab", node_shape="s", node_size=600, label="Stakeholders", ax=ax)

        widths = [1.5 + 6.0 * G[u][v]["weight"] / max(flow_totals.values()) for u, v in G.edges()]
        nx.draw_networkx_edges(G, base_pos, width=widths, arrows=True, arrowstyle="-|>", arrowsize=12, edge_color="#4a4a4a", ax=ax)
        nx.draw_networkx_labels(G, base_pos, font_size=9, ax=ax)
    else:
        # fallback drawing without networkx
        circle_nodes = [n for n in nodes if n not in recipients and n != orca_hub]
        angle_step = 2 * np.pi / max(1, len(circle_nodes))
        positions = {}
        for idx, node in enumerate(circle_nodes):
            angle = idx * angle_step
            positions[node] = np.array([2.2 * np.cos(angle), 2.2 * np.sin(angle)])
        positions[orca_hub] = np.array([0.0, 2.8])
        for idx, recipient in enumerate(recipients):
            positions[recipient] = np.array([3.0 * np.cos(idx), -2.5 + 0.6 * idx])
        for node, pos in positions.items():
            ax.scatter(*pos, s=800 if node == orca_hub else 600, color="#69b3a2")
            ax.text(pos[0], pos[1] + 0.2, node, ha="center")
        max_flow = max(flow_totals.values())
        for (seller, buyer), energy in flow_totals.items():
            start = positions.get(seller, np.zeros(2))
            end = positions.get(buyer, np.zeros(2))
            ax.annotate(
                "",
                xy=end,
                xytext=start,
                arrowprops=dict(arrowstyle="->", linewidth=1.2 + 5.0 * energy / max_flow, color="#4a4a4a"),
            )

    # Draw ORCA broadcast arrows
    hub_pos = (0.0, 2.6) if nx else positions[orca_hub]
    for recipient in recipients:
        if nx:
            rec_pos = base_pos[recipient]
        else:
            rec_pos = positions[recipient]
        ax.annotate(
            "",
            xy=rec_pos,
            xytext=hub_pos,
            arrowprops=dict(arrowstyle="->", color="#ff6600", linewidth=1.5, linestyle="--"),
        )
    ax.text(
        0.0,
        -3.2,
        "Each node trades verified kWh through ORCA channels — quantum-secured broadcast enables trust among multiple participants simultaneously.",
        ha="center",
        fontsize=10,
        wrap=True,
    )
    ax.axis("off")
    plt.show()


def run_energy_trading_demo():
    peers = [
        CommunityProsumer("HomeA", base_generation=3.5, base_load=2.2, locality="cluster-A"),
        CommunityProsumer("HomeB", base_generation=4.2, base_load=1.8, locality="cluster-A"),
        CommunityProsumer("CoopGarden", base_generation=5.5, base_load=1.2, locality="cluster-B"),
        CommunityProsumer("EVHub", base_generation=2.4, base_load=3.6, storage_capacity=6.5, locality="cluster-B"),
        CommunityProsumer("Library", base_generation=3.0, base_load=4.0, storage_capacity=8.0, locality="cluster-C"),
    ]
    engine = TradingEngine(participants=peers, periods=48)
    result = engine.run()
    summary = result["summary"]
    history = result["history"]
    print("Community energy trading summary:")
    print(json.dumps(summary, indent=2))
    visualize_trading(history, summary)
    visualize_network_flow(history)


if __name__ == "__main__":
    run_energy_trading_demo()
