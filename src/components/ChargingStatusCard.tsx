import { Battery, BatteryCharging } from 'lucide-react';

interface ChargingStatusCardProps {
  darkMode?: boolean;
  percentage?: number;
  remainingTime?: string;
  capacity?: number;
}

export function ChargingStatusCard({ 
  darkMode = false,
  percentage = 82,
  remainingTime = '1hr 10min remained',
  capacity = 4500
}: ChargingStatusCardProps) {
  
  const cardBg = darkMode 
    ? 'linear-gradient(90deg, #2A4035, #355A46)'
    : 'linear-gradient(90deg, rgba(98, 191, 212, 0.5) 0%, rgba(241, 221, 118, 0.5) 100%)';

  return (
    <div 
      className="rounded-2xl p-6 glass-card card-shadow relative overflow-hidden"
      style={{
        background: cardBg,
        opacity: darkMode ? 0.8 : 1,
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      {/* Futuristic Background Glow */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: darkMode ? '#10B981' : '#059669'
        }}
      />
      
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div>
          <h3 className="mb-2" style={{ 
            color: darkMode ? '#FFFFFF' : '#000000',
            fontWeight: 'var(--font-weight-semibold)',
            letterSpacing: '-0.01em',
            fontSize: '1.25rem'
          }}>Charging</h3>
          <div className="text-sm flex items-center gap-1.5" style={{ 
            color: darkMode ? 'rgba(255, 255, 255, 0.85)' : '#6B7280',
            fontWeight: 'var(--font-weight-light)'
          }}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{
              background: darkMode ? '#10B981' : '#059669'
            }} />
            {remainingTime}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <BatteryCharging className="w-7 h-7" style={{ color: darkMode ? '#10B981' : '#059669' }} />
          <div className="text-right">
            <p className="text-4xl" style={{ 
              color: darkMode ? '#FFFFFF' : '#000000',
              fontWeight: 'var(--font-weight-bold)',
              letterSpacing: '-0.03em',
              lineHeight: '1'
            }}>{percentage}%</p>
            <p className="text-xs mt-1" style={{ 
              color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#9CA3AF',
              fontWeight: 'var(--font-weight-light)'
            }}>{capacity}kW cap</p>
          </div>
        </div>
      </div>

      {/* Futuristic Battery Visualization */}
      <div className="relative">
        {/* Battery Container */}
        <div 
          className="rounded-2xl p-1.5 relative overflow-hidden"
          style={{
            background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Progress Fill */}
          <div 
            className="rounded-xl h-10 relative overflow-hidden transition-all duration-1000"
            style={{
              width: `${percentage}%`,
              background: darkMode 
                ? 'linear-gradient(90deg, #059669, #10B981, #34D399)'
                : 'linear-gradient(90deg, #047857, #059669, #10B981)',
              boxShadow: darkMode 
                ? '0 0 20px rgba(16, 185, 129, 0.4)'
                : '0 0 15px rgba(5, 150, 105, 0.3)'
            }}
          >
            {/* Animated Shine Effect */}
            <div 
              className="absolute inset-0 opacity-30"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
                animation: 'shine 2s infinite'
              }}
            />
          </div>
          
          {/* Energy Segments Overlay */}
          <div className="absolute inset-0 flex items-center gap-1 px-1.5 pointer-events-none">
            {Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
                className="flex-1 h-8 rounded"
                style={{
                  background: index < Math.floor(percentage / 5) 
                    ? 'transparent'
                    : (darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'),
                  border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'}`
                }}
              />
            ))}
          </div>
        </div>

        {/* Percentage Label */}
        <div className="flex justify-between items-center mt-3 px-1">
          <span className="text-xs" style={{ 
            color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#9CA3AF',
            fontWeight: 'var(--font-weight-light)'
          }}>0%</span>
          <span className="text-xs" style={{ 
            color: darkMode ? '#10B981' : '#059669',
            fontWeight: 'var(--font-weight-semibold)'
          }}>{percentage}%</span>
          <span className="text-xs" style={{ 
            color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#9CA3AF',
            fontWeight: 'var(--font-weight-light)'
          }}>100%</span>
        </div>
      </div>

      <style>{`
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
}
