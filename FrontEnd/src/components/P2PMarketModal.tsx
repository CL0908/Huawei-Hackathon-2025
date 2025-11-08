import { useState } from 'react';
import { X, TrendingUp, TrendingDown, User, Clock, Zap } from 'lucide-react';

interface MarketOrder {
  id: string;
  type: 'buy' | 'sell';
  username: string;
  price: number;
  amount: number;
  timestamp: string;
  distance?: string;
}

interface P2PMarketModalProps {
  onClose: () => void;
  onSelectOrder: (order: MarketOrder) => void;
  darkMode?: boolean;
}

export function P2PMarketModal({ 
  onClose, 
  onSelectOrder,
  darkMode = false 
}: P2PMarketModalProps) {
  const [activeTab, setActiveTab] = useState<'sell' | 'buy'>('sell');

  // Mock market orders - In production, this would come from your backend/Supabase
  const sellOrders: MarketOrder[] = [
    { id: '1', type: 'sell', username: 'Sarah M.', price: 0.16, amount: 15.5, timestamp: '2 min ago', distance: '0.3 km' },
    { id: '2', type: 'sell', username: 'John D.', price: 0.17, amount: 22.0, timestamp: '5 min ago', distance: '0.5 km' },
    { id: '3', type: 'sell', username: 'Emily R.', price: 0.18, amount: 18.5, timestamp: '12 min ago', distance: '0.8 km' },
    { id: '4', type: 'sell', username: 'Mike W.', price: 0.19, amount: 10.0, timestamp: '15 min ago', distance: '1.2 km' },
  ];

  const buyOrders: MarketOrder[] = [
    { id: '5', type: 'buy', username: 'Lisa P.', price: 0.15, amount: 20.0, timestamp: '3 min ago', distance: '0.4 km' },
    { id: '6', type: 'buy', username: 'David K.', price: 0.14, amount: 25.5, timestamp: '8 min ago', distance: '0.7 km' },
    { id: '7', type: 'buy', username: 'Anna S.', price: 0.13, amount: 30.0, timestamp: '10 min ago', distance: '1.0 km' },
    { id: '8', type: 'buy', username: 'Tom H.', price: 0.12, amount: 15.0, timestamp: '18 min ago', distance: '1.5 km' },
  ];

  const currentOrders = activeTab === 'sell' ? sellOrders : buyOrders;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)'
      }}
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl relative"
        style={{
          background: darkMode ? 'rgba(45, 74, 62, 0.95)' : 'rgba(255, 250, 219, 0.8)',
          borderRadius: '16px',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: darkMode 
            ? '0 20px 60px rgba(0, 0, 0, 0.5)' 
            : '0 20px 60px rgba(0, 0, 0, 0.15)',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full transition-all hover:bg-white/10"
          >
            <X className="w-5 h-5" style={{ color: darkMode ? '#FFFFFF' : '#000000' }} />
          </button>

          <h2 className="text-2xl mb-2" style={{ 
            color: darkMode ? '#FFFFFF' : '#000000',
            fontWeight: 'var(--font-weight-bold)',
            letterSpacing: '-0.01em'
          }}>
            P2P Energy Market
          </h2>
          
          <p className="text-sm mb-4" style={{ 
            color: darkMode ? '#FFFFFF' : '#000000',
            opacity: 0.7
          }}>
            Browse and accept orders from your neighbors
          </p>

          {/* Tabs - Second-Tier Container (Center-aligned) */}
          <div className="flex justify-center items-center">
            <div className="flex gap-2" style={{
              background: darkMode ? 'rgba(42, 64, 53, 0.5)' : 'rgba(0, 0, 0, 0.05)',
              padding: '4px',
              borderRadius: '10px'
            }}>
              <button
                onClick={() => setActiveTab('sell')}
                className="py-2.5 px-6 rounded-lg transition-all"
                style={{
                  background: activeTab === 'sell' 
                    ? (darkMode ? 'rgba(95, 195, 162, 0.3)' : '#FFFFFF')
                    : 'transparent',
                  color: darkMode ? '#FFFFFF' : '#000000',
                  fontWeight: activeTab === 'sell' ? 'var(--font-weight-bold)' : 'var(--font-weight-regular)',
                  border: activeTab === 'sell' ? `2px solid ${darkMode ? '#5FC3A2' : '#10B981'}` : '2px solid transparent'
                }}
              >
                Sell Orders (Ask)
              </button>
              <button
                onClick={() => setActiveTab('buy')}
                className="py-2.5 px-6 rounded-lg transition-all"
                style={{
                  background: activeTab === 'buy' 
                    ? (darkMode ? 'rgba(243, 170, 170, 0.3)' : '#FFFFFF')
                    : 'transparent',
                  color: darkMode ? '#FFFFFF' : '#000000',
                  fontWeight: activeTab === 'buy' ? 'var(--font-weight-bold)' : 'var(--font-weight-regular)',
                  border: activeTab === 'buy' ? `2px solid ${darkMode ? '#F3AAAA' : '#F44336'}` : '2px solid transparent'
                }}
              >
                Buy Orders (Bid)
              </button>
            </div>
          </div>
        </div>

        {/* Order Book */}
        <div 
          className="flex-1 overflow-y-auto px-6 pb-6"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: darkMode ? 'rgba(255, 255, 255, 0.3) transparent' : 'rgba(0, 0, 0, 0.2) transparent'
          }}
        >
          <div className="space-y-3">
            {currentOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 rounded-xl transition-all hover:scale-[1.02] cursor-pointer"
                style={{
                  background: darkMode ? 'rgba(42, 64, 53, 0.85)' : '#FFFFFF',
                  border: `2px solid ${
                    activeTab === 'sell' 
                      ? (darkMode ? '#5FC3A2' : '#10B981')
                      : (darkMode ? '#F3AAAA' : '#F44336')
                  }`,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                }}
                onClick={() => onSelectOrder(order)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-full"
                      style={{
                        background: activeTab === 'sell'
                          ? (darkMode ? 'rgba(95, 195, 162, 0.2)' : 'rgba(16, 185, 129, 0.15)')
                          : (darkMode ? 'rgba(243, 170, 170, 0.2)' : 'rgba(244, 67, 54, 0.15)')
                      }}
                    >
                      {activeTab === 'sell' ? (
                        <TrendingDown className="w-4 h-4" style={{ color: darkMode ? '#5FC3A2' : '#10B981' }} />
                      ) : (
                        <TrendingUp className="w-4 h-4" style={{ color: darkMode ? '#F3AAAA' : '#F44336' }} />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-3.5 h-3.5" style={{ color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }} />
                        <span className="text-sm" style={{ 
                          color: darkMode ? '#FFFFFF' : '#000000',
                          fontWeight: 'var(--font-weight-semibold)'
                        }}>
                          {order.username}
                        </span>
                        {order.distance && (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{
                            background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                            color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)'
                          }}>
                            {order.distance}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" style={{ color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' }} />
                        <span className="text-xs" style={{ 
                          color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
                        }}>
                          {order.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl mb-1" style={{ 
                      color: darkMode ? '#FFFFFF' : '#000000',
                      fontWeight: 'var(--font-weight-bold)',
                      letterSpacing: '-0.02em'
                    }}>
                      ${order.price.toFixed(2)}
                    </div>
                    <div className="text-xs" style={{ 
                      color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
                    }}>
                      per kWh
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3" style={{
                  borderTop: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
                }}>
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4" style={{ color: darkMode ? '#FCFFA9' : '#F59E0B' }} />
                    <span className="text-sm" style={{ 
                      color: darkMode ? '#FFFFFF' : '#000000',
                      fontWeight: 'var(--font-weight-semibold)'
                    }}>
                      {order.amount.toFixed(1)} kWh
                    </span>
                  </div>
                  <div className="text-sm" style={{ 
                    color: darkMode ? '#FFFFFF' : '#000000',
                    fontWeight: 'var(--font-weight-bold)'
                  }}>
                    Total: ${(order.price * order.amount).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentOrders.length === 0 && (
            <div className="text-center py-12">
              <p style={{ 
                color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'
              }}>
                No {activeTab} orders available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
