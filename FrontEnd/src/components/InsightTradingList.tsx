import { useState, useEffect } from 'react';
import { TradeSuggestionCard } from './TradeSuggestionCard';
import { Sun, Sparkles } from 'lucide-react';

interface InsightTradingListProps {
  darkMode?: boolean;
  onAutoSchedule?: () => void;
}

export function InsightTradingList({ darkMode = false, onAutoSchedule }: InsightTradingListProps) {
  const [state, setState] = useState<'loading' | 'success'>('loading');
  const textColor = darkMode ? 'text-white' : 'text-black';
  const cardBg = darkMode 
    ? 'linear-gradient(90deg, #2A4035, #355A46)'
    : 'linear-gradient(90deg, rgba(98, 191, 212, 0.4) 0%, rgba(241, 221, 118, 0.4) 100%)';

  // Auto-transition from loading to success after 1500ms
  useEffect(() => {
    if (state === 'loading') {
      const timer = setTimeout(() => {
        setState('success');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state]);

  if (state === 'loading') {
    return (
      <div 
        className="rounded-xl p-8 flex flex-col items-center justify-center min-h-[200px]"
        style={{ background: cardBg }}
      >
        <div className="animate-spin mb-4">
          <Sun className={`w-8 h-8 ${darkMode ? 'text-lime-400' : 'text-teal-600'}`} />
        </div>
        <p className={`text-sm ${textColor}`}>
          Analyzing community energy flow...
        </p>
      </div>
    );
  }

  // Success state with full trading opportunities
  return (
    <div className="space-y-4">
      {/* Trading Opportunities Cards */}
      <div className="space-y-3">
        <TradeSuggestionCard
          houseName="North Neighbor"
          priceValue="8 CO₂/kWh"
          changeText="+8%"
          trend="up"
          darkMode={darkMode}
        />
        <TradeSuggestionCard
          houseName="East Grid"
          priceValue="8 CO₂/kWh"
          changeText="-3%"
          trend="down"
          darkMode={darkMode}
        />
        <TradeSuggestionCard
          houseName="Community Pool"
          priceValue="8 CO₂/kWh"
          changeText="+12%"
          trend="up"
          darkMode={darkMode}
        />
      </div>

      {/* Best Sell Time Recommendation */}
      <div 
        className="rounded-xl p-5"
        style={{ 
          background: darkMode ? 'linear-gradient(90deg, #2A4035, #355A46)' : cardBg,
          opacity: darkMode ? 0.8 : 1
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: '#FFFFFF' }} />
            <h4 style={{ color: '#FFFFFF' }}>Best Sell Time</h4>
          </div>
          <span className="text-sm" style={{ color: darkMode ? '#FFFFFF' : '#6b7280' }}>
            Today, 2:00 PM - 4:00 PM
          </span>
        </div>
        
        <div className="rounded-xl p-4 mb-3" style={{
          background: darkMode ? '#2D4A3E' : 'rgba(255, 255, 255, 0.8)',
          opacity: darkMode ? 0.9 : 1
        }}>
          <p className="text-sm mb-1" style={{ color: darkMode ? '#FFFFFF' : '#6b7280' }}>Recommend</p>
          <p className="text-2xl" style={{ color: darkMode ? '#FFFFFF' : '#000000' }}>1.8 kWh</p>
          <p className="text-sm mt-1" style={{ color: darkMode ? '#FFFFFF' : '#6b7280' }}>Expected revenue: 2 CO₂</p>
        </div>

        {/* Auto Schedule Button */}
        <button
          onClick={onAutoSchedule}
          className="w-full bg-gradient-to-r from-teal-500 to-lime-500 text-white py-3 rounded-xl transition-all hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Auto Schedule</span>
        </button>
      </div>
    </div>
  );
}
