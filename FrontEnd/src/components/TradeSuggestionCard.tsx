import { TrendingUp, TrendingDown, Home } from 'lucide-react';

interface TradeSuggestionCardProps {
  houseName: string;
  priceValue: string;
  changeText: string;
  trend: 'up' | 'down';
  darkMode?: boolean;
}

export function TradeSuggestionCard({
  houseName,
  priceValue,
  changeText,
  trend,
  darkMode = false,
}: TradeSuggestionCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trend === 'up' 
    ? (darkMode ? '#39FFDA' : '#00A398')
    : (darkMode ? '#00CCFF' : '#FF7043');
  const bgColor = trend === 'up' 
    ? (darkMode ? 'rgba(57, 255, 218, 0.15)' : 'rgba(0, 163, 152, 0.1)') 
    : (darkMode ? 'rgba(0, 204, 255, 0.15)' : 'rgba(255, 112, 67, 0.1)');

  return (
    <div 
      className="rounded-xl p-5 flex items-center gap-4 glass-card card-shadow hover:scale-102 transition-transform"
      style={{
        background: darkMode 
          ? 'linear-gradient(90deg, #2A4035, #355A46)'
          : 'linear-gradient(90deg, rgba(98, 191, 212, 0.4) 0%, rgba(241, 221, 118, 0.4) 100%)',
        opacity: darkMode ? 0.8 : 1,
        border: '1px solid rgba(255, 255, 255, 0.18)'
      }}
    >
      <div 
        className="p-3 rounded-lg glass-card" 
        style={{ 
          background: darkMode ? '#2D4A3E' : 'rgba(255, 255, 255, 0.8)',
          opacity: darkMode ? 0.9 : 1,
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <Home className="w-6 h-6" style={{ color: darkMode ? '#FFFFFF' : 'var(--accent-success)' }} />
      </div>
      
      <div className="flex-1">
        <h4 style={{ 
          color: darkMode ? '#FFFFFF' : 'var(--text-primary)',
          fontWeight: 'var(--font-weight-semibold)'
        }}>{houseName}</h4>
        <p className="text-sm mt-1 data-label" style={{ 
          color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'var(--text-secondary)',
          fontWeight: 'var(--font-weight-light)'
        }}>{priceValue}</p>
      </div>

      <div 
        className="flex items-center gap-1.5 px-4 py-2 rounded-full"
        style={{ background: bgColor }}
      >
        <TrendIcon className="w-4 h-4" style={{ color: trendColor }} />
        <span className="text-sm" style={{ 
          color: trendColor,
          fontWeight: 'var(--font-weight-semibold)'
        }}>{changeText}</span>
      </div>
    </div>
  );
}
