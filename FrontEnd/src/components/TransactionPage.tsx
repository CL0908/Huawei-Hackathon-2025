import { useState } from 'react';
import { TradingModal } from './TradingModal';
import { NotificationModal } from './NotificationModal';
import { PlaceSellOrderModal } from './PlaceSellOrderModal';
import { PlaceBuyOrderModal } from './PlaceBuyOrderModal';
import { ArrowUpRight, ArrowDownRight, Zap, Battery, Sun } from 'lucide-react';

interface MarketOrder {
  id: string;
  type: 'buy' | 'sell';
  username: string;
  price: number;
  amount: number;
  timestamp: string;
  distance?: string;
}

interface TransactionPageProps {
  darkMode?: boolean;
}

const chartData = [
  { hour: '00', consumption: 8, generation: 0 },
  { hour: '04', consumption: 6, generation: 0 },
  { hour: '08', consumption: 12, generation: 15 },
  { hour: '12', consumption: 18, generation: 28 },
  { hour: '16', consumption: 22, generation: 20 },
  { hour: '20', consumption: 16, generation: 5 },
];

export function TransactionPage({ darkMode = false }: TransactionPageProps) {
  const cardBg = darkMode 
    ? 'linear-gradient(90deg, #2A4035, #355A46)'
    : 'linear-gradient(90deg, rgba(98, 191, 212, 0.4) 0%, rgba(241, 221, 118, 0.4) 100%)';
  
  // Battery and system status
  const batteryLevel = 8.5; // Current battery level in kWh
  const batteryCapacity = 13.5; // Total battery capacity in kWh
  const currentLoad = 3.2; // Current power usage in kWh
  const solarGen = 4.8; // Current solar generation in kWh
  const maxPurchase = batteryCapacity - batteryLevel; // Max energy that can be purchased
  const co2Tokens = 20; // CO2 tokens earned from energy savings
  
  const smallCardBgIncome = darkMode
    ? 'rgba(44, 44, 44, 0.70)'
    : 'rgba(255, 255, 255, 0.7)';
  
  const smallCardBgCost = darkMode
    ? 'rgba(44, 44, 44, 0.70)'
    : 'rgba(255, 255, 255, 0.7)';
  
  const smallCardBgAvailable = darkMode
    ? 'rgba(44, 44, 44, 0.70)'
    : 'rgba(255, 255, 255, 0.7)';
  
  const [showTradingModal, setShowTradingModal] = useState(false);
  const [showPlaceSellOrderModal, setShowPlaceSellOrderModal] = useState(false);
  const [showPlaceBuyOrderModal, setShowPlaceBuyOrderModal] = useState(false);
  const [tradingMode, setTradingMode] = useState<'buy' | 'sell'>('buy');
  const [selectedPrice, setSelectedPrice] = useState('0.12');
  const [selectedPriceType, setSelectedPriceType] = useState('Fixed');
  const [selectedPriceLabel, setSelectedPriceLabel] = useState('Grid');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleOpenSellModal = () => {
    setShowPlaceSellOrderModal(true);
  };

  const handleOpenBuyModal = () => {
    setShowPlaceBuyOrderModal(true);
  };

  const handlePlaceSellOrder = (price: string, amount: string) => {
    setNotificationMessage(`Successfully sold ${amount} kWh to Luméa Market at ${price} CO₂/kWh!`);
    setShowNotification(true);
  };

  const handlePlaceBuyOrder = (price: string, amount: string) => {
    setNotificationMessage(`Successfully purchased ${amount} kWh from Luméa Market at ${price} CO₂/kWh!`);
    setShowNotification(true);
  };

  const handleTradingConfirm = (price: string, amount: string) => {
    const action = tradingMode === 'buy' ? 'purchased' : 'sold';
    setNotificationMessage(`You have successfully ${action} ${amount} kWh at ${price} CO₂/kWh!`);
    setShowNotification(true);
  };

  return (
    <>
      <div className="flex flex-col gap-6 px-6 pt-8" style={{ paddingBottom: '96px' }}>
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl mb-3" style={{ 
            color: '#333333',
            fontWeight: 'var(--font-weight-bold)',
            letterSpacing: '-0.01em',
            fontFamily: "'La Belle Aurore', cursive"
          }}>Luméa</h2>
          <h1 className="text-3xl" style={{ 
            color: 'var(--text-primary)',
            fontWeight: 'var(--font-weight-bold)',
            letterSpacing: '-0.02em'
          }}>Energy Trading</h1>
          <p className="mt-2 text-sm" style={{ 
            color: 'var(--text-secondary)',
            fontWeight: 'var(--font-weight-light)',
            letterSpacing: '0.02em'
          }}>Buy and sell energy</p>
        </div>

        {/* Total Balance Card */}
        <div 
          className="rounded-xl p-6 text-white glass-card"
          style={{
            background: darkMode 
              ? 'linear-gradient(90deg, rgba(42, 64, 53, 0.85), rgba(53, 90, 70, 0.85))'
              : 'linear-gradient(135deg, #10B981 0%, #84cc16 100%)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <p className="text-sm opacity-90 mb-2 data-label" style={{ fontWeight: 'var(--font-weight-light)' }}>Total Balance</p>
          <div className="mb-6 flex flex-col items-center">
            <p className="data-value" style={{ 
              fontWeight: 'var(--font-weight-bold)',
              letterSpacing: '-0.03em',
              fontSize: '4rem',
              lineHeight: '1',
              marginBottom: '0.25rem'
            }}>1,248</p>
            <p style={{ 
              fontWeight: 'var(--font-weight-semibold)',
              letterSpacing: '0.01em',
              fontSize: '1.25rem',
              opacity: 0.95
            }}>CO₂ Tokens</p>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs opacity-75">This Month</p>
              <p className="text-lg mt-1">+120 CO₂</p>
            </div>
            <div>
              <p className="text-xs opacity-75">Exported</p>
              <p className="text-lg mt-1">142 kWh</p>
            </div>
            <div>
              <p className="text-xs opacity-75">Imported</p>
              <p className="text-lg mt-1">58 kWh</p>
            </div>
          </div>
        </div>

        {/* Trading Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleOpenSellModal}
            className="py-6 rounded-xl transition-all hover:shadow-lg hover:scale-105 active:scale-95 flex flex-col items-center justify-center"
            style={{
              background: darkMode 
                ? 'rgba(224, 136, 136, 0.7)'
                : 'rgba(243, 170, 170, 0.7)',
              color: '#FFFFFF',
              fontWeight: 'var(--font-weight-bold)',
              border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
            }}
          >
            <ArrowUpRight className="w-8 h-8 mb-2" style={{ color: '#FFFFFF' }} />
            <span className="block">Sell Energy</span>
          </button>
          
          <button
            onClick={handleOpenBuyModal}
            className="py-6 rounded-xl transition-all hover:shadow-lg hover:scale-105 active:scale-95 flex flex-col items-center justify-center"
            style={{
              background: darkMode 
                ? 'rgba(77, 168, 138, 0.7)'
                : 'rgba(95, 195, 162, 0.7)',
              color: '#FFFFFF',
              fontWeight: 'var(--font-weight-bold)',
              border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
            }}
          >
            <ArrowDownRight className="w-8 h-8 mb-2" style={{ color: '#FFFFFF' }} />
            <span className="block">Buy Energy</span>
          </button>
        </div>

        {/* Power Chart */}
        <div 
          className="rounded-xl p-6"
          style={{
            background: cardBg
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 style={{ color: 'var(--text-primary)' }}>Today's Activity</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ background: darkMode ? '#6BA3E8' : '#7FB4F3' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Generation</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full" style={{ background: darkMode ? '#FFBB85' : '#FFCF9E' }} />
                <span style={{ color: 'var(--text-secondary)' }}>Consumption</span>
              </div>
            </div>
          </div>

          {/* Chart Visualization */}
          <div className="relative h-48">
            <div className="absolute inset-0 flex items-end justify-between gap-3">
              {chartData.map((data, index) => {
                const maxValue = 28;
                const genHeight = (data.generation / maxValue) * 100;
                const conHeight = (data.consumption / maxValue) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full">
                    <div className="w-full relative flex-1 flex items-end gap-1">
                      <div
                        className="flex-1 rounded-t-lg"
                        style={{ 
                          height: `${genHeight}%`,
                          background: darkMode ? '#6BA3E8' : '#7FB4F3'
                        }}
                      />
                      <div
                        className="flex-1 rounded-t-lg"
                        style={{ 
                          height: `${conHeight}%`,
                          background: darkMode ? '#FFBB85' : '#FFCF9E'
                        }}
                      />
                    </div>
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{data.hour}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`grid grid-cols-3 gap-4 mt-6 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Peak Gen</p>
              <p className="mt-1" style={{ color: 'var(--text-primary)' }}>28 kWh</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Peak Use</p>
              <p className="mt-1" style={{ color: 'var(--text-primary)' }}>22 kWh</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Net Export</p>
              <p className="text-green-600 mt-1">+12 kWh</p>
            </div>
          </div>
        </div>

        {/* System Status Overview */}
        <div className="grid grid-cols-3 gap-2">
          <div 
            className="rounded-xl p-2.5 glass-card flex flex-col items-center justify-center text-center"
            style={{
              background: cardBg,
              border: '1px solid rgba(255, 255, 255, 0.18)',
              minHeight: '90px'
            }}
          >
            <Battery className="w-6 h-6 mb-1.5" style={{ color: darkMode ? '#FFFFFF' : '#10B981' }} />
            <p className="data-label" style={{ 
              color: darkMode ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 'var(--font-weight-light)',
              fontSize: '11pt',
              lineHeight: '1.2'
            }}>Battery Level</p>
            <p style={{ 
              color: darkMode ? '#FFFFFF' : 'var(--text-primary)',
              fontWeight: 'var(--font-weight-bold)',
              fontSize: '11pt',
              lineHeight: '1.3',
              marginTop: '2px'
            }}>{batteryLevel} /{batteryCapacity} kWh</p>
          </div>
          
          <div 
            className="rounded-xl p-2.5 glass-card flex flex-col items-center justify-center text-center"
            style={{
              background: cardBg,
              border: '1px solid rgba(255, 255, 255, 0.18)',
              minHeight: '90px'
            }}
          >
            <Zap className="w-6 h-6 mb-1.5" style={{ color: darkMode ? '#FFFFFF' : '#fb923c' }} />
            <p className="data-label" style={{ 
              color: darkMode ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 'var(--font-weight-light)',
              fontSize: '11pt',
              lineHeight: '1.2'
            }}>Current Load</p>
            <p style={{ 
              color: darkMode ? '#FFFFFF' : 'var(--text-primary)',
              fontWeight: 'var(--font-weight-bold)',
              fontSize: '11pt',
              lineHeight: '1.3',
              marginTop: '2px'
            }}>{currentLoad} kWh</p>
          </div>
          
          <div 
            className="rounded-xl p-2.5 glass-card flex flex-col items-center justify-center text-center"
            style={{
              background: cardBg,
              border: '1px solid rgba(255, 255, 255, 0.18)',
              minHeight: '90px'
            }}
          >
            <Sun className="w-6 h-6 mb-1.5" style={{ color: darkMode ? '#FFFFFF' : '#f59e0b' }} />
            <p className="data-label" style={{ 
              color: darkMode ? '#FFFFFF' : 'var(--text-secondary)',
              fontWeight: 'var(--font-weight-light)',
              fontSize: '11pt',
              lineHeight: '1.2'
            }}>Solar Gen</p>
            <p style={{ 
              color: darkMode ? '#FFFFFF' : 'var(--text-primary)',
              fontWeight: 'var(--font-weight-bold)',
              fontSize: '11pt',
              lineHeight: '1.3',
              marginTop: '2px'
            }}>{solarGen} kWh</p>
          </div>
        </div>

      </div>

      {showTradingModal && (
        <TradingModal
          mode={tradingMode}
          onClose={() => setShowTradingModal(false)}
          onConfirm={handleTradingConfirm}
          darkMode={darkMode}
          price={selectedPrice}
          priceType={selectedPriceType}
          priceLabel={selectedPriceLabel}
          maxPurchase={maxPurchase}
        />
      )}

      {showNotification && (
        <NotificationModal
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
          darkMode={darkMode}
        />
      )}

      {showPlaceSellOrderModal && (
        <PlaceSellOrderModal
          onClose={() => setShowPlaceSellOrderModal(false)}
          onConfirm={handlePlaceSellOrder}
          darkMode={darkMode}
          suggestedPrice={0.12}
        />
      )}

      {showPlaceBuyOrderModal && (
        <PlaceBuyOrderModal
          onClose={() => setShowPlaceBuyOrderModal(false)}
          onConfirm={handlePlaceBuyOrder}
          darkMode={darkMode}
          maxPurchase={maxPurchase}
        />
      )}
    </>
  );
}
