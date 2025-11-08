import { useState } from 'react';
import { X, TrendingUp, User, Zap, MapPin, AlertCircle } from 'lucide-react';

interface MarketOrder {
  id: string;
  type: 'buy' | 'sell';
  username: string;
  price: number;
  amount: number;
  timestamp: string;
  distance?: string;
}

interface ConfirmMarketOrderModalProps {
  order: MarketOrder;
  onClose: () => void;
  onConfirm: (orderId: string, amount: number) => void;
  darkMode?: boolean;
  maxPurchase?: number;
}

export function ConfirmMarketOrderModal({ 
  order,
  onClose, 
  onConfirm, 
  darkMode = false,
  maxPurchase = 100
}: ConfirmMarketOrderModalProps) {
  const [amount, setAmount] = useState(Math.min(order.amount, maxPurchase).toFixed(1));
  const [error, setError] = useState('');

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    
    if (numValue > maxPurchase) {
      setError(`Cannot exceed ${maxPurchase.toFixed(1)} kWh (battery capacity limit)`);
    } else if (numValue > order.amount) {
      setError(`Cannot exceed ${order.amount.toFixed(1)} kWh (available amount)`);
    } else if (numValue < 0.1) {
      setError('Amount must be at least 0.1 kWh');
    } else {
      setError('');
    }
    setAmount(value);
  };

  const handleConfirm = () => {
    const numAmount = parseFloat(amount) || 0;
    
    if (numAmount > maxPurchase || numAmount > order.amount || numAmount < 0.1) {
      return;
    }
    
    onConfirm(order.id, numAmount);
    onClose();
  };

  const totalCost = (parseFloat(amount) || 0) * order.price;
  const gridPrice = 0.20;
  const savings = ((gridPrice - order.price) * (parseFloat(amount) || 0)).toFixed(2);
  const savingsPercent = (((gridPrice - order.price) / gridPrice) * 100).toFixed(0);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md relative p-6"
        style={{
          background: darkMode ? 'rgba(45, 74, 62, 0.95)' : 'rgba(255, 250, 219, 0.8)',
          borderRadius: '16px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: darkMode 
            ? '0 20px 60px rgba(0, 0, 0, 0.5)' 
            : '0 20px 60px rgba(0, 0, 0, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-all hover:bg-white/10"
        >
          <X className="w-5 h-5" style={{ color: darkMode ? '#FFFFFF' : '#000000' }} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div 
            className="p-3 rounded-full"
            style={{
              background: darkMode ? 'rgba(95, 195, 162, 0.2)' : 'rgba(16, 185, 129, 0.15)'
            }}
          >
            <TrendingUp className="w-6 h-6" style={{ color: darkMode ? '#5FC3A2' : '#10B981' }} />
          </div>
          <div>
            <h2 className="text-xl" style={{ 
              color: darkMode ? '#FFFFFF' : '#000000',
              fontWeight: 'var(--font-weight-bold)',
              letterSpacing: '-0.01em'
            }}>
              Confirm Purchase
            </h2>
            <p className="text-sm" style={{ 
              color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
            }}>
              Buy from community member
            </p>
          </div>
        </div>

        {/* Seller Info Card */}
        <div 
          className="mb-5 p-4 rounded-xl"
          style={{
            background: darkMode ? 'rgba(42, 64, 53, 0.85)' : '#FFFFFF',
            border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(209, 213, 219, 1)'}`
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" style={{ color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }} />
              <span style={{ 
                color: darkMode ? '#FFFFFF' : '#000000',
                fontWeight: 'var(--font-weight-semibold)'
              }}>
                {order.username}
              </span>
            </div>
            {order.distance && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{
                background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
              }}>
                <MapPin className="w-3 h-3" style={{ color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }} />
                <span className="text-xs" style={{ 
                  color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                }}>
                  {order.distance}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs mb-1" style={{ 
                color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
              }}>
                Price per kWh
              </p>
              <p className="text-2xl" style={{ 
                color: darkMode ? '#FFFFFF' : '#000000',
                fontWeight: 'var(--font-weight-bold)',
                letterSpacing: '-0.02em'
              }}>
                8 CO₂
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs mb-1" style={{ 
                color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
              }}>
                Available
              </p>
              <div className="flex items-center gap-1.5 justify-end">
                <Zap className="w-4 h-4" style={{ color: darkMode ? '#FCFFA9' : '#F59E0B' }} />
                <span style={{ 
                  color: darkMode ? '#FFFFFF' : '#000000',
                  fontWeight: 'var(--font-weight-semibold)'
                }}>
                  {order.amount.toFixed(1)} kWh
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-5">
          <label className="text-sm block mb-2" style={{ 
            color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
            fontWeight: 'var(--font-weight-semibold)'
          }}>
            Amount to Purchase (kWh)
          </label>
          <input
            type="number"
            step="0.1"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="w-full rounded-xl px-4 py-3 border transition-all focus:outline-none focus:ring-2 focus:ring-[#10B981]"
            style={{
              background: darkMode ? 'rgba(42, 64, 53, 0.85)' : '#FFFFFF',
              borderColor: error 
                ? '#ef4444' 
                : (darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(209, 213, 219, 1)'),
              color: darkMode ? '#FFFFFF' : '#000000'
            }}
          />
          <div className="mt-2 space-y-1">
            {error ? (
              <p className="text-xs" style={{ color: '#ef4444' }}>
                {error}
              </p>
            ) : (
              <>
                <p className="text-xs" style={{ 
                  color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                }}>
                  Max: {Math.min(order.amount, maxPurchase).toFixed(1)} kWh
                </p>
                {parseFloat(amount) > 0 && order.price < gridPrice && (
                  <p className="text-xs" style={{ 
                    color: darkMode ? '#5FC3A2' : '#10B981' 
                  }}>
                    Save ${savings} ({savingsPercent}% vs grid price)
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Total Cost Display */}
        <div 
          className="rounded-xl p-4 mb-5"
          style={{
            background: darkMode ? 'rgba(42, 64, 53, 0.85)' : 'rgba(243, 244, 246, 1)',
            border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(209, 213, 219, 1)'}`
          }}
        >
          <div className="flex justify-between items-center">
            <span className="text-sm" style={{ 
              color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
              fontWeight: 'var(--font-weight-semibold)'
            }}>
              Total Cost
            </span>
            <span className="text-2xl" style={{ 
              color: darkMode ? '#FFFFFF' : '#000000',
              fontWeight: 'var(--font-weight-bold)'
            }}>
              ${totalCost.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Info Banner - Center-aligned for emphasis */}
        <div 
          className="mb-5 p-3 rounded-lg"
          style={{
            background: darkMode ? 'rgba(95, 195, 162, 0.15)' : 'rgba(16, 185, 129, 0.1)',
            border: `1px solid ${darkMode ? 'rgba(95, 195, 162, 0.3)' : 'rgba(16, 185, 129, 0.2)'}`
          }}
        >
          <div className="flex flex-col items-center text-center gap-2">
            <AlertCircle className="w-4 h-4" style={{ 
              color: darkMode ? '#5FC3A2' : '#10B981' 
            }} />
            <p className="text-xs" style={{ 
              color: darkMode ? '#FFFFFF' : '#000000',
              lineHeight: '1.5'
            }}>
              This purchase will be completed directly with {order.username}. Funds will be transferred upon confirmation.
            </p>
          </div>
        </div>

        {/* Action Buttons - Third-Tier Container Footer (Center-aligned) */}
        <div className="flex justify-center items-center">
          <div className="flex gap-3 justify-center" style={{ width: '100%' }}>
            <button
              onClick={onClose}
              className="rounded-xl py-3.5 px-8 transition-all hover:scale-105 active:scale-95"
              style={{
                background: darkMode ? 'rgba(42, 64, 53, 0.85)' : 'rgba(229, 231, 235, 1)',
                color: darkMode ? '#FFFFFF' : '#000000',
                fontWeight: 'var(--font-weight-semibold)'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!!error || parseFloat(amount) <= 0}
              className="rounded-xl py-3.5 px-8 transition-all hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                fontWeight: 'var(--font-weight-semibold)'
              }}
            >
              Confirm Purchase
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
