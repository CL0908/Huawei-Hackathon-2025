import { useState } from 'react';
import { X, TrendingUp } from 'lucide-react';

interface PlaceBuyOrderModalProps {
  onClose: () => void;
  onConfirm: (price: string, amount: string) => void;
  darkMode?: boolean;
  maxPurchase?: number;
}

export function PlaceBuyOrderModal({ 
  onClose, 
  onConfirm, 
  darkMode = false,
  maxPurchase = 5.0
}: PlaceBuyOrderModalProps) {
  const [amount, setAmount] = useState('10');
  const [errors, setErrors] = useState({ amount: '' });
  
  // Fixed market price set by Luméa (in CO₂ tokens per kWh)
  const marketSellPrice = 8;

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    if (numValue < 1) {
      setErrors(prev => ({ ...prev, amount: 'Amount must be at least 1 kWh' }));
    } else if (numValue > maxPurchase) {
      setErrors(prev => ({ ...prev, amount: `Amount cannot exceed ${maxPurchase.toFixed(1)} kWh (Battery full)` }));
    } else {
      setErrors(prev => ({ ...prev, amount: '' }));
    }
    setAmount(value);
  };

  const handleConfirm = () => {
    const numAmount = parseFloat(amount) || 0;
    
    if (numAmount < 1 || numAmount > maxPurchase) {
      setErrors(prev => ({ ...prev, amount: 'Please enter a valid amount' }));
      return;
    }
    
    onConfirm(marketSellPrice.toString(), amount);
    onClose();
  };

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
              Buy Energy from Market
            </h2>
          </div>
        </div>

        {/* Market Price Display */}
        <div 
          className="mb-5 p-4 rounded-xl"
          style={{
            background: darkMode ? 'rgba(42, 64, 53, 0.85)' : 'rgba(243, 244, 246, 1)',
            border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(209, 213, 219, 1)'}`
          }}
        >
          <p className="text-sm mb-1" style={{ 
            color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            fontWeight: 'var(--font-weight-normal)'
          }}>
            Community Sell Price
          </p>
          <p className="text-2xl" style={{ 
            color: darkMode ? '#FFFFFF' : '#000000',
            fontWeight: 'var(--font-weight-bold)',
            letterSpacing: '-0.02em'
          }}>
            {marketSellPrice} CO₂/kWh
          </p>
          <p className="text-xs mt-1" style={{ 
            color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)'
          }}>
            (Set by market)
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4 mb-5">
          {/* Amount Input */}
          <div>
            <label className="text-sm block mb-2" style={{ 
              color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
              fontWeight: 'var(--font-weight-semibold)'
            }}>
              Amount (kWh)
            </label>
            <input
              type="number"
              step="0.1"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              className="w-full rounded-xl px-4 py-3 border transition-all focus:outline-none focus:ring-2 focus:ring-[#10B981]"
              style={{
                background: darkMode ? 'rgba(42, 64, 53, 0.85)' : '#FFFFFF',
                borderColor: errors.amount 
                  ? '#ef4444' 
                  : (darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(209, 213, 219, 1)'),
                color: darkMode ? '#FFFFFF' : '#000000'
              }}
            />
            {errors.amount ? (
              <p className="text-xs mt-1.5" style={{ color: '#ef4444' }}>
                {errors.amount}
              </p>
            ) : (
              <p className="text-xs mt-1.5" style={{ 
                color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)'
              }}>
                Max purchase: {maxPurchase.toFixed(1)} kWh (Battery full)
              </p>
            )}
          </div>

          {/* Total Cost Display */}
          <div 
            className="rounded-xl p-4"
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
              <span className="text-xl" style={{ 
                color: darkMode ? '#FFFFFF' : '#000000',
                fontWeight: 'var(--font-weight-bold)'
              }}>
                {Math.round(marketSellPrice * (parseFloat(amount) || 0))} CO₂
              </span>
            </div>
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
              className="rounded-xl py-3.5 px-8 transition-all hover:shadow-lg hover:scale-105 active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#FFFFFF',
                fontWeight: 'var(--font-weight-semibold)'
              }}
            >
              Confirm Buy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
