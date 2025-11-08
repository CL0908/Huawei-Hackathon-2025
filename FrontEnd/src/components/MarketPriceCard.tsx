import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * MarketPriceCard - Dynamic Market Price Display
 * 
 * All data is controllable via props from backend:
 * 
 * @param mainPrice - Main display price at top (e.g., 1.3892)
 * @param currentPrice - Current market price in green card (e.g., 0.11)
 * @param peakPrice - Peak price for the day (e.g., 0.15)
 * @param lowPrice - Lowest price for the day (e.g., 0.08)
 * @param avgPrice - Average price for today (e.g., 0.11)
 * @param priceChange - Absolute price change (e.g., 0.0082)
 * @param percentageChange - Percentage change (e.g., 1.72)
 * @param isPositive - Whether the change is positive (true) or negative (false)
 * @param unit - Price unit (e.g., "kWh")
 * @param currency - Currency symbol (e.g., "$")
 */
interface MarketPriceCardProps {
  mainPrice: number;
  currentPrice: number;
  peakPrice?: number;
  lowPrice?: number;
  avgPrice?: number;
  priceChange?: number;
  percentageChange?: number;
  isPositive?: boolean;
  unit?: string;
  currency?: string;
  darkMode?: boolean;
}

export function MarketPriceCard({ 
  mainPrice,
  currentPrice,
  peakPrice,
  lowPrice,
  avgPrice,
  priceChange,
  percentageChange,
  isPositive = true,
  unit = 'kWh',
  currency = '$',
  darkMode = false 
}: MarketPriceCardProps) {
  
  const changeColor = isPositive 
    ? (darkMode ? '#10B981' : '#059669') 
    : (darkMode ? '#EF4444' : '#DC2626');
  
  const TrendIcon = isPositive ? TrendingUp : TrendingDown;
  
  // Green gradient background for the main price card
  const cardGradient = darkMode 
    ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)'
    : 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)';
  
  return (
    <div className="space-y-4">
      {/* Main Price Display - Token Balance with Visual Hierarchy */}
      <div className="text-center">
        <div className="flex flex-col items-center gap-1">
          <span 
            style={{ 
              color: isPositive ? '#4CAF50' : '#F44336',
              fontWeight: 'var(--font-weight-bold)',
              fontSize: '5rem',
              letterSpacing: '-0.04em',
              lineHeight: '1',
              textShadow: isPositive 
                ? '0 4px 20px rgba(76, 175, 80, 0.3)' 
                : '0 4px 20px rgba(244, 67, 54, 0.3)'
            }}
          >
            {mainPrice.toLocaleString()}
          </span>
          <span 
            style={{ 
              color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.8)',
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: '1.5rem',
              letterSpacing: '0.01em',
              lineHeight: '1'
            }}
          >
            {currency} Tokens
          </span>
        </div>
      </div>

      {/* Token Balance Change Indicator */}
      {priceChange !== undefined && percentageChange !== undefined && (
        <div className="flex items-center justify-center gap-2">
          <TrendIcon 
            className="w-6 h-6" 
            style={{ color: changeColor }}
          />
          <span 
            style={{ 
              color: changeColor,
              fontWeight: 'var(--font-weight-semibold)',
              fontSize: '1.25rem',
              letterSpacing: '-0.01em'
            }}
          >
            {isPositive ? '+' : ''}{priceChange} ({isPositive ? '+' : ''}{percentageChange.toFixed(2)}%)
          </span>
        </div>
      )}

      {/* Green Card - Current Market Price */}
      <div 
        className="rounded-3xl p-8 transition-all relative overflow-hidden"
        style={{
          background: cardGradient,
          boxShadow: darkMode 
            ? '0 8px 32px rgba(16, 185, 129, 0.3), 0 0 60px rgba(16, 185, 129, 0.15)'
            : '0 8px 32px rgba(34, 197, 94, 0.3), 0 0 60px rgba(34, 197, 94, 0.15)',
          border: darkMode 
            ? '1px solid rgba(255, 255, 255, 0.2)' 
            : '1px solid rgba(255, 255, 255, 0.4)'
        }}
      >
        {/* Decorative glow effect */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at top right, rgba(255, 255, 255, 0.4) 0%, transparent 60%)',
          }}
        />

        {/* Animated shine effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(110deg, transparent 40%, rgba(255, 255, 255, 0.15) 50%, transparent 60%)',
            animation: 'shine 3s ease-in-out infinite'
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Label */}
          <p 
            className="text-sm mb-3"
            style={{ 
              color: 'rgba(255, 255, 255, 0.9)',
              fontWeight: 'var(--font-weight-normal)',
              letterSpacing: '0.02em'
            }}
          >
            Current Market Price
          </p>
          
          {/* Main Price Display */}
          <div className="flex items-baseline gap-2 mb-8">
            <span 
              className="text-5xl"
              style={{ 
                color: '#FFFFFF',
                fontWeight: 'var(--font-weight-bold)',
                letterSpacing: '-0.02em',
                lineHeight: '1',
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
              }}
            >
              {currentPrice}
            </span>
            <span 
              className="text-2xl"
              style={{ 
                color: 'rgba(255, 255, 255, 0.95)',
                fontWeight: 'var(--font-weight-medium)',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
            >
              {currency}/{unit}
            </span>
          </div>
          
          {/* Price Breakdown - Three Column Grid */}
          {(peakPrice !== undefined || lowPrice !== undefined || avgPrice !== undefined) && (
            <div className="grid grid-cols-3 gap-4">
              {/* Peak Price */}
              {peakPrice !== undefined && (
                <div>
                  <p 
                    className="text-xs mb-2"
                    style={{ 
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontWeight: 'var(--font-weight-light)',
                      textTransform: 'capitalize',
                      letterSpacing: '0.03em'
                    }}
                  >
                    Peak Price
                  </p>
                  <p 
                    className="text-xl"
                    style={{ 
                      color: '#FFFFFF',
                      fontWeight: 'var(--font-weight-semibold)',
                      letterSpacing: '-0.01em',
                      textShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    {peakPrice} {currency}
                  </p>
                </div>
              )}
              
              {/* Low Price */}
              {lowPrice !== undefined && (
                <div>
                  <p 
                    className="text-xs mb-2"
                    style={{ 
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontWeight: 'var(--font-weight-light)',
                      textTransform: 'capitalize',
                      letterSpacing: '0.03em'
                    }}
                  >
                    Low Price
                  </p>
                  <p 
                    className="text-xl"
                    style={{ 
                      color: '#FFFFFF',
                      fontWeight: 'var(--font-weight-semibold)',
                      letterSpacing: '-0.01em',
                      textShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    {lowPrice} {currency}
                  </p>
                </div>
              )}
              
              {/* Average Today */}
              {avgPrice !== undefined && (
                <div>
                  <p 
                    className="text-xs mb-2"
                    style={{ 
                      color: 'rgba(255, 255, 255, 0.85)',
                      fontWeight: 'var(--font-weight-light)',
                      textTransform: 'capitalize',
                      letterSpacing: '0.03em'
                    }}
                  >
                    Avg Today
                  </p>
                  <p 
                    className="text-xl"
                    style={{ 
                      color: '#FFFFFF',
                      fontWeight: 'var(--font-weight-semibold)',
                      letterSpacing: '-0.01em',
                      textShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                    }}
                  >
                    {avgPrice} {currency}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Corner decorative elements */}
        <div 
          className="absolute bottom-0 right-0 w-32 h-32 opacity-10 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.6) 0%, transparent 70%)',
            transform: 'translate(30%, 30%)'
          }}
        />
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%) rotate(10deg); }
          100% { transform: translateX(200%) rotate(10deg); }
        }
      `}</style>
    </div>
  );
}
