import { useState } from 'react';
import { InsightsModal } from './InsightsModal';
import { NotificationModal } from './NotificationModal';
import { InsightTradingList } from './InsightTradingList';
import { MarketPriceCard } from './MarketPriceCard';
import { Sparkles, Zap, TrendingUp, BarChart3 } from 'lucide-react';

interface InsightsPageProps {
  darkMode?: boolean;
}

const chartData = [
  { hour: '00', value: 12 },
  { hour: '04', value: 8 },
  { hour: '08', value: 22 },
  { hour: '12', value: 35 },
  { hour: '16', value: 28 },
  { hour: '20', value: 18 },
];

export function InsightsPage({ darkMode = false }: InsightsPageProps) {
  const cardBg = darkMode 
    ? 'linear-gradient(90deg, #2A4035, #355A46)'
    : 'linear-gradient(90deg, rgba(98, 191, 212, 0.5) 0%, rgba(241, 221, 118, 0.5) 100%)';
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<'ev' | 'optimize'>('optimize');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'suggestions'>('overview');
  
  // TODO: Replace with actual backend API call
  // Example API call:
  // const marketData = await fetch('/api/market-price').then(res => res.json());
  
  // Simulated backend data - this should come from your backend API
  const marketData = {
    mainPrice: 1248,            // Main balance display (CO₂ tokens)
    currentPrice: 8,            // Current market price (CO₂ per kWh)
    peakPrice: 10,              // Peak price for the day (CO₂ per kWh)
    lowPrice: 5,                // Lowest price for the day (CO₂ per kWh)
    avgPrice: 8,                // Average price today (CO₂ per kWh)
    priceChange: 120,           // Token balance change (from backend)
    percentageChange: 1.72,     // Percentage change (from backend)
    isPositive: true,           // Whether change is positive or negative (from backend)
    unit: 'kWh',                // Price unit (from backend or config)
    currency: 'CO₂'             // Currency symbol (from backend or config)
  };

  const openModal = (type: 'ev' | 'optimize') => {
    setModalContent(type);
    setShowModal(true);
  };

  const handleConfirm = () => {
    setShowModal(false);
    if (modalContent === 'ev') {
      setNotificationMessage('You have successfully set EV now!');
    } else {
      setNotificationMessage('You have successfully apply optimization!');
    }
    setShowNotification(true);
  };

  const handleAutoSchedule = () => {
    setNotificationMessage('You have successfully scheduled the transaction!');
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
          }}>Energy Insights</h1>
          <p className="mt-2 text-sm" style={{ 
            color: 'var(--text-secondary)',
            fontWeight: 'var(--font-weight-light)',
            letterSpacing: '0.02em'
          }}>AI-powered trading recommendations</p>
        </div>

        {/* Market Price Card - Backend Controlled */}
        <MarketPriceCard
          mainPrice={marketData.mainPrice}
          currentPrice={marketData.currentPrice}
          peakPrice={marketData.peakPrice}
          lowPrice={marketData.lowPrice}
          avgPrice={marketData.avgPrice}
          priceChange={marketData.priceChange}
          percentageChange={marketData.percentageChange}
          isPositive={marketData.isPositive}
          unit={marketData.unit}
          currency={marketData.currency}
          darkMode={darkMode}
        />

        {/* Tabs - Like Transaction Page */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex-1 py-3 rounded-xl transition-all hover:scale-105 active:scale-95"
            style={activeTab === 'overview' ? {
              background: darkMode 
                ? 'linear-gradient(90deg, #2A4035, #355A46)'
                : 'linear-gradient(135deg, var(--accent-success) 0%, #84cc16 100%)',
              opacity: darkMode ? 0.8 : 1,
              color: '#FFFFFF',
              fontWeight: 'var(--font-weight-semibold)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            } : {
              background: darkMode ? 'rgba(42, 64, 53, 0.3)' : '#f3f4f6',
              color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#6b7280'
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>Overview</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className="flex-1 py-3 rounded-xl transition-all hover:scale-105 active:scale-95"
            style={activeTab === 'suggestions' ? {
              background: darkMode 
                ? 'linear-gradient(90deg, #2A4035, #355A46)'
                : 'linear-gradient(135deg, var(--accent-success) 0%, #84cc16 100%)',
              opacity: darkMode ? 0.8 : 1,
              color: '#FFFFFF',
              fontWeight: 'var(--font-weight-semibold)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            } : {
              background: darkMode ? 'rgba(42, 64, 53, 0.3)' : '#f3f4f6',
              color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#6b7280'
            }}
          >
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>AI Insights</span>
            </div>
          </button>
        </div>

        {/* Volume Indicator Chart - Mirror of Transaction Page */}
        <div 
          className="rounded-xl p-6"
          style={{
            background: cardBg
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 style={{ color: 'var(--text-primary)' }}>Market Activity</h3>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-teal-600" />
                <span style={{ color: 'var(--text-secondary)' }}>Volume</span>
              </div>
            </div>
          </div>

          {/* Chart Visualization */}
          <div className="relative h-48">
            <div className="absolute inset-0 flex items-end justify-between gap-3">
              {chartData.map((data, index) => {
                const maxValue = 35;
                const height = (data.value / maxValue) * 100;
                
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full">
                    <div className="w-full relative flex-1 flex items-end">
                      <div
                        className="w-full bg-gradient-to-t from-teal-600 to-teal-400 rounded-t-lg"
                        style={{ height: `${height}%` }}
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
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Peak Volume</p>
              <p className="mt-1" style={{ color: 'var(--text-primary)' }}>35 kWh</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Avg Volume</p>
              <p className="mt-1" style={{ color: 'var(--text-primary)' }}>20 kWh</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Total</p>
              <p className="text-teal-600 mt-1">123 kWh</p>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <>
            {/* AI Recommendations */}
            <div>
              <h3 className="mb-3" style={{ color: 'var(--text-primary)' }}>Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => openModal('optimize')}
                  className="w-full text-left rounded-xl p-4 hover:opacity-90 transition-all active:scale-98"
                  style={{ background: cardBg }}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-lime-100 rounded-lg mt-1">
                      <Sparkles className="w-4 h-4 text-lime-600" />
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--text-primary)' }}>Optimize Energy Usage</h4>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Save up to 120 CO₂ this week with AI optimization
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => openModal('ev')}
                  className="w-full text-left rounded-xl p-4 hover:opacity-90 transition-all active:scale-98"
                  style={{ background: cardBg }}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-teal-100 rounded-lg mt-1">
                      <Zap className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <h4 style={{ color: 'var(--text-primary)' }}>Schedule EV Charging</h4>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Charge during off-peak hours for best rates
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Weekly Summary */}
            <div 
              className="rounded-xl p-6"
              style={{
                background: cardBg
              }}
            >
              <h3 className="mb-4" style={{ color: 'var(--text-primary)' }}>This Week's Impact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Energy Saved</p>
                  <p className="text-2xl mt-1" style={{ color: 'var(--text-primary)' }}>142 kWh</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Cost Reduction</p>
                  <p className="text-2xl mt-1" style={{ color: 'var(--text-primary)' }}>90 CO₂</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Solar Generated</p>
                  <p className="text-2xl mt-1" style={{ color: 'var(--text-primary)' }}>285 kWh</p>
                </div>
                <div>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Grid Exported</p>
                  <p className="text-2xl mt-1" style={{ color: 'var(--text-primary)' }}>98 kWh</p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'suggestions' && (
          <>
            {/* Luméa's Suggestion - Now with Dynamic Loading */}
            <div>
              <h3 className="mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Sparkles className={`w-5 h-5 ${darkMode ? 'text-lime-400' : 'text-lime-600'}`} />
                Luméa's Suggestion
              </h3>
              
              {/* Insight_Trading_List Component with Loading State */}
              <InsightTradingList darkMode={darkMode} onAutoSchedule={handleAutoSchedule} />
            </div>
          </>
        )}
      </div>

      {showModal && (
        <InsightsModal
          onClose={() => setShowModal(false)}
          contentType={modalContent}
          onConfirm={handleConfirm}
          darkMode={darkMode}
        />
      )}

      {showNotification && (
        <NotificationModal
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
          darkMode={darkMode}
        />
      )}
    </>
  );
}
