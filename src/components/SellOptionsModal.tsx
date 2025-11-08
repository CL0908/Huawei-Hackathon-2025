import { X } from 'lucide-react';

interface SellOptionsModalProps {
  onClose: () => void;
  onSellToGrid: () => void;
  onPlaceInMarket: () => void;
  darkMode?: boolean;
}

export function SellOptionsModal({ 
  onClose, 
  onSellToGrid, 
  onPlaceInMarket,
  darkMode = false 
}: SellOptionsModalProps) {
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
          borderRadius: '10px',
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

        {/* Title */}
        <h2 className="text-2xl mb-6" style={{ 
          color: darkMode ? '#FFFFFF' : '#000000',
          fontWeight: 'var(--font-weight-bold)',
          letterSpacing: '-0.01em'
        }}>
          Sell Your Energy
        </h2>

        {/* Sell to Grid Card */}
        <div 
          className="mb-4 p-5"
          style={{
            background: darkMode ? 'rgba(42, 64, 53, 0.85)' : '#FFFFFF',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
        >
          <h3 className="mb-2" style={{ 
            color: darkMode ? '#FFFFFF' : '#000000',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: '18px'
          }}>
            Sell to Grid
          </h3>
          <p className="text-3xl mb-4" style={{ 
            color: darkMode ? '#FFFFFF' : '#000000',
            fontWeight: 'var(--font-weight-bold)',
            letterSpacing: '-0.02em'
          }}>
            ~$0.10 / kWh
          </p>
          <p className="text-sm mb-4" style={{ 
            color: darkMode ? '#FFFFFF' : '#000000',
            opacity: 0.7
          }}>
            Fixed
          </p>
          <button
            onClick={onSellToGrid}
            className="w-full py-3 rounded-lg transition-all hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #FF7043 0%, #f97316 100%)',
              color: '#FFFFFF',
              fontWeight: 'var(--font-weight-bold)'
            }}
          >
            Sell Now
          </button>
        </div>

        {/* Sell to Community Card */}
        <div 
          className="p-5"
          style={{
            background: darkMode ? 'rgba(42, 64, 53, 0.85)' : '#FFFFFF',
            borderRadius: '10px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
          }}
        >
          <h3 className="mb-2" style={{ 
            color: darkMode ? '#FFFFFF' : '#000000',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: '18px'
          }}>
            Sell to Community
          </h3>
          <p className="text-3xl mb-2" style={{ 
            color: darkMode ? '#FFFFFF' : '#000000',
            fontWeight: 'var(--font-weight-bold)',
            letterSpacing: '-0.02em'
          }}>
            ~$0.13 / kWh
          </p>
          <p className="text-sm mb-3" style={{ 
            color: darkMode ? '#FFFFFF' : '#000000',
            opacity: 0.7
          }}>
            Dynamic
          </p>
          <p className="text-sm mb-4" style={{ 
            color: darkMode ? '#FFFFFF' : '#000000',
            lineHeight: '1.5'
          }}>
            Place your energy for sale on the P2P market. Set your ask price and quantity.
          </p>
          <button
            onClick={onPlaceInMarket}
            className="w-full py-3 rounded-lg transition-all hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #FF7043 0%, #f97316 100%)',
              color: '#FFFFFF',
              fontWeight: 'var(--font-weight-bold)'
            }}
          >
            Place Sell Order
          </button>
        </div>
      </div>
    </div>
  );
}
