/**
 * GaugeDial - Futuristic Solar/Battery Status Gauge
 * 
 * All visual aspects are controllable via props from backend:
 * 
 * @param value - Battery level display value (e.g., "4.2")
 * @param percentage - Gauge fill percentage 0-100 (controls arc fill)
 * @param status - Status text: 'Charging', 'Idle', 'Discharging', etc.
 * @param showSun - Show/hide sun icon based on solar panel activity
 * @param isCharging - Controls sun brightness and status color
 * @param gradientColors - Customize arc gradient colors
 */
interface GaugeDialProps {
  value: string;
  label?: string;
  percentage?: number;
  darkMode?: boolean;
  status?: string;
  showSun?: boolean;
  isCharging?: boolean;
  gradientColors?: {
    start: string;
    middle: string;
    end: string;
  };
}

export function GaugeDial({ 
  value, 
  label = 'Total Usage', 
  percentage = 65, 
  darkMode = false, 
  status = 'Charging',
  showSun = true,
  isCharging = true,
  gradientColors = {
    start: '#FCD34D',
    middle: '#FDE68A',
    end: '#86EFAC'
  }
}: GaugeDialProps) {
  const radius = 100;
  const strokeWidth = 16;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  // Dynamic colors based on charging state
  const sunColor = isCharging ? '#FCD34D' : (darkMode ? '#6B7280' : '#9CA3AF');
  const statusColor = isCharging ? (darkMode ? '#10B981' : '#059669') : (darkMode ? '#6B7280' : '#374151');
  const glowColor = isCharging ? (darkMode ? '#10B981' : '#059669') : 'transparent';

  return (
    <div className="flex flex-col items-center gap-2 py-6">
      <div className="relative" style={{ width: radius * 2 + 60, height: radius + 80 }}>
        {/* Outer glow ring */}
        <div 
          className="absolute inset-0 rounded-t-full opacity-40"
          style={{
            background: darkMode 
              ? `radial-gradient(ellipse at center top, ${glowColor}20, transparent 70%)`
              : 'transparent',
            filter: 'blur(20px)',
            animation: isCharging ? 'pulse 3s ease-in-out infinite' : 'none'
          }}
        />

        {/* Background container with tech border */}
        <div 
          className="absolute rounded-t-full overflow-hidden"
          style={{
            inset: '10px',
            background: darkMode 
              ? 'linear-gradient(180deg, rgba(45, 74, 62, 0.4) 0%, rgba(58, 92, 74, 0.6) 100%)'
              : 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: darkMode 
              ? `1px solid ${isCharging ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`
              : '1px solid rgba(0, 0, 0, 0.05)',
            boxShadow: darkMode 
              ? `0 0 30px ${isCharging ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 0, 0, 0.3)'}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
              : '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}
        />

        {/* Tech corner accents */}
        {darkMode && (
          <>
            {/* Top left accent */}
            <div 
              className="absolute z-10"
              style={{
                top: '10px',
                left: '10px',
                width: '20px',
                height: '20px',
                borderTop: `2px solid ${isCharging ? '#10B981' : 'rgba(255, 255, 255, 0.2)'}`,
                borderLeft: `2px solid ${isCharging ? '#10B981' : 'rgba(255, 255, 255, 0.2)'}`,
                borderTopLeftRadius: '4px',
                opacity: 0.6
              }}
            />
            {/* Top right accent */}
            <div 
              className="absolute z-10"
              style={{
                top: '10px',
                right: '10px',
                width: '20px',
                height: '20px',
                borderTop: `2px solid ${isCharging ? '#10B981' : 'rgba(255, 255, 255, 0.2)'}`,
                borderRight: `2px solid ${isCharging ? '#10B981' : 'rgba(255, 255, 255, 0.2)'}`,
                borderTopRightRadius: '4px',
                opacity: 0.6
              }}
            />
          </>
        )}
        
        {/* Semi-circle SVG with animated elements */}
        <svg 
          height={radius + 60} 
          width={radius * 2 + 60} 
          className="relative z-10"
          style={{ overflow: 'visible' }}
        >
          {/* Outer ring - subtle decoration */}
          <path
            d={`M ${30 + strokeWidth/2 - 12} ${radius + 30} A ${normalizedRadius + 12} ${normalizedRadius + 12} 0 0 1 ${radius * 2 + 30 - strokeWidth/2 + 12} ${radius + 30}`}
            stroke={darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)'}
            fill="transparent"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="4 8"
          />

          {/* Background arc with glow */}
          <path
            d={`M ${30 + strokeWidth/2} ${radius + 30} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 + 30 - strokeWidth/2} ${radius + 30}`}
            stroke={darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          
          {/* Progress arc with gradient and glow */}
          <path
            d={`M ${30 + strokeWidth/2} ${radius + 30} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 + 30 - strokeWidth/2} ${radius + 30}`}
            stroke="url(#solarGradient)"
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ 
              strokeDashoffset,
              filter: darkMode && isCharging ? 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))' : 'none',
              transition: 'stroke-dashoffset 1s ease-out'
            }}
            strokeLinecap="round"
          />

          {/* Animated progress indicator dots */}
          {darkMode && isCharging && percentage > 0 && (
            <>
              {[0, 1, 2].map((i) => {
                const angle = Math.PI - (percentage / 100) * Math.PI + (i * 0.02);
                const x = 30 + radius + normalizedRadius * Math.cos(angle);
                const y = 30 + radius - normalizedRadius * Math.sin(angle);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#10B981"
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.8))',
                      animation: `pulse 1.5s ease-in-out infinite ${i * 0.2}s`
                    }}
                  />
                );
              })}
            </>
          )}
          
          <defs>
            <linearGradient id="solarGradient" x1="0%" y1="50%" x2="100%" y2="50%">
              <stop offset="0%" stopColor={gradientColors.start} />
              <stop offset="50%" stopColor={gradientColors.middle} />
              <stop offset="100%" stopColor={gradientColors.end} />
            </linearGradient>
          </defs>
        </svg>
        
        {/* Enhanced Sun Icon with glow */}
        {showSun && (
          <div 
            className="absolute z-20 transition-all duration-500"
            style={{
              top: '25px',
              right: '25px',
              width: '40px',
              height: '40px',
              opacity: isCharging ? 1 : 0.3,
              filter: isCharging && darkMode ? 'drop-shadow(0 0 12px rgba(252, 211, 77, 0.6))' : 'none',
              animation: isCharging ? 'spin 20s linear infinite' : 'none'
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="5" fill={sunColor} opacity="0.9" />
              <circle cx="12" cy="12" r="3" fill={sunColor} />
              <g stroke={sunColor} strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </g>
            </svg>
          </div>
        )}
        
        {/* Value display with futuristic styling */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20" style={{ marginTop: '30px' }}>
          {/* Glowing background for value in dark mode */}
          {darkMode && isCharging && (
            <div 
              className="absolute"
              style={{
                width: '120px',
                height: '120px',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
                filter: 'blur(20px)',
                animation: 'pulse 2s ease-in-out infinite'
              }}
            />
          )}
          
          <div className="relative">
            <span 
              className="text-6xl data-value relative z-10" 
              style={{ 
                color: darkMode ? '#FFFFFF' : '#000000',
                fontWeight: 'var(--font-weight-bold)',
                letterSpacing: '-0.04em',
                lineHeight: '1',
                textShadow: darkMode && isCharging 
                  ? '0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.1)' 
                  : 'none'
              }}
            >
              {value}
            </span>
            
            {/* Animated scanline effect */}
            {darkMode && isCharging && (
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(transparent 40%, rgba(16, 185, 129, 0.1) 50%, transparent 60%)',
                  animation: 'scan 3s ease-in-out infinite'
                }}
              />
            )}
          </div>
          
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-sm data-label" style={{ 
              color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#000000',
              fontWeight: 'var(--font-weight-light)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>kWh</span>
            
            {/* Percentage indicator */}
            <div 
              className="px-2 py-0.5 rounded-full text-xs"
              style={{
                background: darkMode 
                  ? `linear-gradient(90deg, ${glowColor}30, ${glowColor}50)`
                  : 'rgba(0, 0, 0, 0.05)',
                color: darkMode ? '#FFFFFF' : '#000000',
                fontWeight: 'var(--font-weight-semibold)',
                border: darkMode ? `1px solid ${glowColor}40` : '1px solid rgba(0, 0, 0, 0.1)'
              }}
            >
              {Math.round(percentage)}%
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced status display */}
      <div className="text-center mt-3 flex items-center gap-2">
        {/* Status indicator dot */}
        <div 
          className="w-2 h-2 rounded-full"
          style={{
            background: statusColor,
            boxShadow: darkMode && isCharging ? `0 0 8px ${statusColor}` : 'none',
            animation: isCharging ? 'pulse 2s ease-in-out infinite' : 'none'
          }}
        />
        
        <div>
          <span style={{ 
            color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#000000',
            fontWeight: 'var(--font-weight-normal)',
            fontSize: '0.875rem'
          }}>Now </span>
          <span style={{ 
            color: statusColor,
            fontWeight: 'var(--font-weight-semibold)',
            fontSize: '0.875rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>{status}</span>
        </div>
      </div>

      {/* Add keyframe animations to global styles */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes scan {
          0%, 100% { transform: translateY(-100%); }
          50% { transform: translateY(100%); }
        }
      `}</style>
    </div>
  );
}
