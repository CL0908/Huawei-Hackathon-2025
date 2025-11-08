import { useState } from 'react';
import { ChevronLeft, ChevronRight, Wind, Tv, Lightbulb, MonitorPlay } from 'lucide-react';

interface Device {
  name: string;
  consumption: number;
  icon: 'air' | 'computer' | 'tv' | 'lights';
}

interface ConsumptionCardProps {
  darkMode?: boolean;
  devices?: Device[];
}

export function ConsumptionCard({ 
  darkMode = false,
  devices = [
    { name: 'Air condition', consumption: 1.5, icon: 'air' as const },
    { name: 'Computer', consumption: 0.2, icon: 'computer' as const },
    { name: 'Smart TV', consumption: 2.5, icon: 'tv' as const },
    { name: 'Lights', consumption: 0.18, icon: 'lights' as const },
  ]
}: ConsumptionCardProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const itemWidth = 140;
  const maxScroll = Math.max(0, (devices.length - 2.5) * itemWidth);
  
  const cardBg = darkMode 
    ? 'linear-gradient(90deg, #2A4035, #355A46)'
    : 'linear-gradient(90deg, rgba(98, 191, 212, 0.5) 0%, rgba(241, 221, 118, 0.5) 100%)';

  // Calculate total consumption
  const totalConsumption = devices.reduce((sum, device) => sum + device.consumption, 0);

  const scrollLeft = () => {
    setScrollPosition(Math.max(0, scrollPosition - itemWidth));
  };

  const scrollRight = () => {
    setScrollPosition(Math.min(maxScroll, scrollPosition + itemWidth));
  };

  // Calculate dots for scroll indicator
  const numDots = Math.ceil(devices.length / 2.5);
  const currentDot = Math.round(scrollPosition / itemWidth);

  const getDeviceIcon = (icon: string) => {
    switch (icon) {
      case 'air':
        return <Wind className="w-8 h-8" style={{ color: darkMode ? '#10B981' : '#059669' }} />;
      case 'computer':
        return <MonitorPlay className="w-8 h-8" style={{ color: darkMode ? '#10B981' : '#059669' }} />;
      case 'tv':
        return <Tv className="w-8 h-8" style={{ color: darkMode ? '#10B981' : '#059669' }} />;
      case 'lights':
        return <Lightbulb className="w-8 h-8" style={{ color: darkMode ? '#10B981' : '#059669' }} />;
      default:
        return <Wind className="w-8 h-8" style={{ color: darkMode ? '#10B981' : '#059669' }} />;
    }
  };

  // Format display value - show in W if less than 1 kW
  const formatConsumption = (value: number) => {
    if (value < 1) {
      return `${(value * 1000).toFixed(0)} W`;
    }
    return `${value.toFixed(1)} kW`;
  };

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
        className="absolute bottom-0 left-0 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{
          background: darkMode ? '#10B981' : '#059669'
        }}
      />

      <h3 className="mb-6 relative z-10" style={{ 
        color: darkMode ? '#FFFFFF' : '#000000',
        fontWeight: 'var(--font-weight-semibold)',
        letterSpacing: '-0.01em',
        fontSize: '1.25rem'
      }}>Consumption</h3>

      {/* Total Consumption Display - Replaces Donut Chart */}
      <div className="flex flex-col items-center justify-center mb-8 relative z-10">
        {/* Large consumption number with animated glow */}
        <div className="relative">
          {/* Animated pulse glow */}
          <div 
            className="absolute inset-0 flex items-center justify-center opacity-20"
            style={{
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}
          >
            <div 
              className="w-32 h-32 rounded-full"
              style={{
                background: darkMode ? '#10B981' : '#059669',
                filter: 'blur(40px)'
              }}
            />
          </div>
          
          {/* Main number */}
          <div className="relative z-10 text-center">
            <span className="text-7xl" style={{ 
              color: darkMode ? '#FFFFFF' : '#000000',
              fontWeight: 'var(--font-weight-bold)',
              letterSpacing: '-0.04em',
              textShadow: darkMode ? '0 0 30px rgba(16, 185, 129, 0.4)' : 'none'
            }}>{totalConsumption.toFixed(1)}</span>
            <span className="text-3xl ml-2" style={{ 
              color: darkMode ? '#10B981' : '#059669',
              fontWeight: 'var(--font-weight-semibold)',
              letterSpacing: '-0.02em'
            }}>kW</span>
          </div>
        </div>
        
        {/* "Live Usage" subtitle */}
        <p className="mt-4 text-sm" style={{ 
          color: darkMode ? 'rgba(255, 255, 255, 0.85)' : '#6B7280',
          fontWeight: 'var(--font-weight-medium)',
          letterSpacing: '0.05em',
          textTransform: 'uppercase'
        }}>Live Usage</p>
      </div>

      {/* Device Carousel */}
      <div className="relative">
        {/* Left Arrow */}
        {scrollPosition > 0 && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all hover:scale-110"
            style={{
              background: darkMode 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(52, 211, 153, 0.9))' 
                : 'linear-gradient(135deg, rgba(5, 150, 105, 0.9), rgba(16, 185, 129, 0.9))',
              boxShadow: darkMode ? '0 4px 12px rgba(16, 185, 129, 0.4)' : '0 4px 12px rgba(5, 150, 105, 0.3)'
            }}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        )}

        {/* Scrollable Container */}
        <div className="overflow-hidden px-8">
          <div 
            className="flex gap-3 transition-transform duration-300 ease-out"
            style={{
              transform: `translateX(-${scrollPosition}px)`
            }}
          >
            {devices.map((device, index) => (
              <div
                key={index}
                className="flex-shrink-0 rounded-xl p-4 text-center transition-all hover:scale-105 relative overflow-hidden"
                style={{
                  width: `${itemWidth - 12}px`,
                  background: darkMode 
                    ? 'linear-gradient(135deg, rgba(45, 74, 62, 0.6), rgba(58, 92, 74, 0.6))'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.7), rgba(240, 253, 244, 0.7))',
                  border: darkMode ? '1px solid rgba(255, 255, 255, 0.15)' : '1px solid rgba(0, 0, 0, 0.08)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                {/* Small glow effect */}
                <div 
                  className="absolute top-0 right-0 w-16 h-16 rounded-full blur-2xl opacity-20 pointer-events-none"
                  style={{
                    background: darkMode ? '#10B981' : '#059669'
                  }}
                />
                
                <div 
                  className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center relative z-10"
                  style={{
                    background: darkMode 
                      ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.15))'
                      : 'linear-gradient(135deg, rgba(220, 252, 231, 0.8), rgba(187, 247, 208, 0.8))',
                    border: darkMode ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(5, 150, 105, 0.2)'
                  }}
                >
                  {getDeviceIcon(device.icon)}
                </div>
                <p className="text-sm mb-1.5 relative z-10" style={{ 
                  color: darkMode ? '#FFFFFF' : '#000000',
                  fontWeight: 'var(--font-weight-medium)'
                }}>{device.name}</p>
                <p className="text-lg relative z-10" style={{ 
                  color: darkMode ? '#10B981' : '#059669',
                  fontWeight: 'var(--font-weight-bold)'
                }}>{formatConsumption(device.consumption)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow */}
        {scrollPosition < maxScroll && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full transition-all hover:scale-110"
            style={{
              background: darkMode 
                ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.9), rgba(52, 211, 153, 0.9))' 
                : 'linear-gradient(135deg, rgba(5, 150, 105, 0.9), rgba(16, 185, 129, 0.9))',
              boxShadow: darkMode ? '0 4px 12px rgba(16, 185, 129, 0.4)' : '0 4px 12px rgba(5, 150, 105, 0.3)'
            }}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      {/* Scroll Indicator Dots */}
      <div className="flex justify-center gap-2 mt-4 relative z-10">
        {Array.from({ length: numDots }).map((_, index) => (
          <div
            key={index}
            className="rounded-full transition-all duration-300"
            style={{
              width: currentDot === index ? '24px' : '8px',
              height: '8px',
              background: currentDot === index 
                ? darkMode ? '#10B981' : '#059669'
                : darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
              opacity: currentDot === index ? 1 : 0.5
            }}
          />
        ))}
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
