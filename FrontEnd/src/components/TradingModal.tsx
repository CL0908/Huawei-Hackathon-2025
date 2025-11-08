import { useState } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

interface TradingModalProps {
  mode: 'buy' | 'sell';
  onClose: () => void;
  onConfirm: (price: string, amount: string) => void;
  darkMode?: boolean;
  price?: string;
  priceType?: string;
  priceLabel?: string;
  maxPurchase?: number;
}

export function TradingModal({ 
  mode, 
  onClose, 
  onConfirm, 
  darkMode = false,
  price = '0.12',
  priceType = 'Fixed',
  priceLabel = 'Grid',
  maxPurchase = 100
}: TradingModalProps) {
  const [amount, setAmount] = useState('50');
  const [error, setError] = useState('');

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    if (mode === 'buy' && numValue > maxPurchase) {
      setError(`Cannot exceed ${maxPurchase.toFixed(1)} kWh (battery capacity limit)`);
    } else {
      setError('');
    }
    setAmount(value);
  };

  const handleConfirm = () => {
    const numAmount = parseFloat(amount) || 0;
    if (mode === 'buy' && numAmount > maxPurchase) {
      setError(`Cannot exceed ${maxPurchase.toFixed(1)} kWh (battery capacity limit)`);
      return;
    }
    onConfirm(price, amount);
    onClose();
  };

  const isBuy = mode === 'buy';
  const Icon = isBuy ? TrendingUp : TrendingDown;
  const iconColor = isBuy 
    ? (darkMode ? '#39FFDA' : '#00A398')
    : (darkMode ? '#00CCFF' : '#FF7043');
  const buttonGradient = isBuy 
    ? `linear-gradient(135deg, ${darkMode ? '#39FFDA' : '#00A398'} 0%, #84cc16 100%)`
    : `linear-gradient(135deg, ${darkMode ? '#00CCFF' : '#FF7043'} 0%, #f97316 100%)`;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 z-50" style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
      <div 
        className="w-full max-w-md rounded-xl p-6 relative"
        style={{
          background: darkMode ? 'rgba(45, 74, 62, 0.9)' : 'rgba(255, 250, 219, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: darkMode 
            ? '0 20px 60px rgba(0, 0, 0, 0.5)' 
            : '0 20px 60px rgba(0, 0, 0, 0.15)'
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" style={{ color: darkMode ? '#FFFFFF' : 'var(--text-secondary)' }} />
        </button>

        <div className="flex flex-col gap-6 pt-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-full" style={{
              background: darkMode ? 'rgba(16, 185, 129, 0.2)' : (isBuy 
                ? 'rgba(0, 163, 152, 0.15)'
                : 'rgba(255, 112, 67, 0.15)')
            }}>
              <Icon className="w-6 h-6" style={{ color: darkMode ? '#FFFFFF' : iconColor }} />
            </div>
            <h2 className="text-xl capitalize" style={{ 
              color: darkMode ? '#FFFFFF' : 'var(--text-primary)',
              fontWeight: 'var(--font-weight-bold)'
            }}>{mode} Energy</h2>
          </div>

          <div className="flex flex-col gap-4">
            {/* Price Display (Non-editable) */}
            <div className="rounded-xl p-4" style={{
              background: darkMode ? '#3A5C4A' : 'rgba(243, 244, 246, 1)',
              border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(209, 213, 219, 1)'}`
            }}>
              <p className="text-sm mb-1 data-label" style={{ 
                color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-secondary)',
                fontWeight: 'var(--font-weight-light)'
              }}>Price</p>
              <p className="text-xl" style={{ 
                color: darkMode ? '#FFFFFF' : 'var(--text-primary)',
                fontWeight: 'var(--font-weight-bold)',
                letterSpacing: '-0.01em'
              }}>
                8 CO₂/kWh ({priceType})
              </p>
            </div>

            <div>
              <label className="text-sm block mb-2 data-label" style={{ 
                color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-secondary)',
                fontWeight: 'var(--font-weight-light)'
              }}>Amount (kWh)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="w-full rounded-xl px-4 py-3 border transition-all focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                style={{
                  background: darkMode ? '#3A5C4A' : 'rgba(243, 244, 246, 1)',
                  borderColor: error 
                    ? '#ef4444' 
                    : (darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(209, 213, 219, 1)'),
                  color: darkMode ? '#FFFFFF' : 'var(--text-primary)'
                }}
              />
              {mode === 'buy' && (
                <p className="text-xs mt-2" style={{ 
                  color: error ? '#ef4444' : (darkMode ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-secondary)'),
                  fontWeight: 'var(--font-weight-light)'
                }}>
                  {error || `Max purchase: ${maxPurchase.toFixed(1)} kWh (Battery capacity limit)`}
                </p>
              )}
            </div>

            <div className="rounded-xl p-4" style={{
              background: darkMode ? '#3A5C4A' : 'rgba(243, 244, 246, 1)',
              border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
            }}>
              <div className="flex justify-between items-center">
                <span className="text-sm data-label" style={{ 
                  color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-secondary)',
                  fontWeight: 'var(--font-weight-light)'
                }}>Total</span>
                <span className="text-xl data-value" style={{ 
                  color: darkMode ? '#FFFFFF' : 'var(--text-primary)',
                  fontWeight: 'var(--font-weight-bold)'
                }}>${(parseFloat(price) * parseFloat(amount)).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl py-4 transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
              style={{
                background: darkMode ? '#3A5C4A' : 'rgba(229, 231, 235, 1)',
                color: darkMode ? '#FFFFFF' : 'var(--text-primary)',
                fontWeight: 'var(--font-weight-semibold)'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 text-white rounded-xl py-4 transition-all hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center"
              style={{
                background: buttonGradient,
                fontWeight: 'var(--font-weight-semibold)'
              }}
            >
              Confirm {mode === 'buy' ? 'Buy' : 'Sell'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
