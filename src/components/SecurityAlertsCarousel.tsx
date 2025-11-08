import { CheckCircle, Shield, Lock } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';

interface SecurityAlertsCarouselProps {
  darkMode?: boolean;
  onAlertClick?: (alertId: number) => void;
}

export function SecurityAlertsCarousel({ darkMode = false, onAlertClick }: SecurityAlertsCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // System Health cards - Default SAFE/GOOD status with Luméa's green/teal brand colors
  const alerts = [
    {
      id: 1,
      icon: CheckCircle,
      title: 'Energy Flow Stable',
      description: 'All energy systems are operating normally. Data flow is consistent and predictive models are accurate.',
      gradientBg: darkMode 
        ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.20) 0%, rgba(13, 148, 136, 0.20) 100%)'
        : 'linear-gradient(90deg, rgba(16, 185, 129, 0.28) 0%, rgba(13, 148, 136, 0.28) 100%)',
      iconColor: darkMode ? '#10B981' : '#0d9488',
      borderColor: darkMode ? 'rgba(16, 185, 129, 0.35)' : 'rgba(13, 148, 136, 0.45)',
      statusLabel: 'GOOD',
      bgOverlay: darkMode ? 'rgba(16, 185, 129, 0.05)' : 'rgba(13, 148, 136, 0.08)',
    },
    {
      id: 2,
      icon: Shield,
      title: 'Data Integrity Good',
      description: 'Blockchain verification complete. All data records are secure and verified with no tampering detected.',
      gradientBg: darkMode 
        ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.20) 0%, rgba(13, 148, 136, 0.20) 100%)'
        : 'linear-gradient(90deg, rgba(16, 185, 129, 0.28) 0%, rgba(13, 148, 136, 0.28) 100%)',
      iconColor: darkMode ? '#10B981' : '#0d9488',
      borderColor: darkMode ? 'rgba(16, 185, 129, 0.35)' : 'rgba(13, 148, 136, 0.45)',
      statusLabel: 'SAFE',
      bgOverlay: darkMode ? 'rgba(16, 185, 129, 0.05)' : 'rgba(13, 148, 136, 0.08)',
    },
    {
      id: 3,
      icon: Lock,
      title: 'Quantum Security Stable',
      description: 'Advanced quantum encryption is active. All transactions are protected and system integrity is maintained.',
      gradientBg: darkMode 
        ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.20) 0%, rgba(13, 148, 136, 0.20) 100%)'
        : 'linear-gradient(90deg, rgba(16, 185, 129, 0.28) 0%, rgba(13, 148, 136, 0.28) 100%)',
      iconColor: darkMode ? '#10B981' : '#0d9488',
      borderColor: darkMode ? 'rgba(16, 185, 129, 0.35)' : 'rgba(13, 148, 136, 0.45)',
      statusLabel: 'SECURE',
      bgOverlay: darkMode ? 'rgba(16, 185, 129, 0.05)' : 'rgba(13, 148, 136, 0.08)',
    },
  ];

  // Track scroll position to update indicator
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        const cardWidth = scrollContainerRef.current.offsetWidth - 48; // Account for padding
        const index = Math.round(scrollLeft / cardWidth);
        setCurrentIndex(index);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToCard = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.offsetWidth - 48;
      scrollContainerRef.current.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative" style={{ zIndex: 20 }}>
      {/* Horizontal Scrolling Container */}
      <div 
        ref={scrollContainerRef}
        className="overflow-x-auto overflow-y-hidden scrollbar-hide px-6 pb-1"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="flex gap-3" style={{ width: 'max-content' }}>
          {alerts.map((alert, index) => {
            const IconComponent = alert.icon;
            
            return (
              <button
                key={alert.id}
                onClick={() => onAlertClick?.(alert.id)}
                className="rounded-xl glass-card transition-all flex-shrink-0 hover:scale-105 active:scale-95 cursor-pointer"
                style={{
                  width: 'calc(100vw - 72px)', // Compact width
                  maxWidth: '340px',
                  scrollSnapAlign: 'start',
                  background: alert.gradientBg,
                  border: `1.5px solid ${alert.borderColor}`,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  padding: '14px 16px',
                }}
              >
                {/* Compact Banner Layout - Single Row */}
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div 
                    className="p-2 rounded-lg flex-shrink-0"
                    style={{
                      background: darkMode ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    <IconComponent 
                      className="w-5 h-5" 
                      style={{ 
                        color: alert.iconColor,
                        strokeWidth: 2.5
                      }} 
                    />
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0 text-left">
                    <h3 
                      className="truncate"
                      style={{ 
                        color: darkMode ? '#FFFFFF' : '#000000',
                        fontWeight: 'var(--font-weight-bold)',
                        fontSize: '14px',
                        letterSpacing: '-0.01em',
                        lineHeight: '1.3'
                      }}
                    >
                      {alert.title}
                    </h3>
                  </div>

                  {/* Status Badge */}
                  <div 
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{
                      background: darkMode ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.5)',
                    }}
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ 
                        background: alert.iconColor,
                        boxShadow: `0 0 6px ${alert.iconColor}`
                      }}
                    />
                    <span 
                      className="text-xs whitespace-nowrap"
                      style={{ 
                        color: alert.iconColor,
                        fontWeight: 'var(--font-weight-bold)',
                        fontSize: '10px',
                        letterSpacing: '0.03em'
                      }}
                    >
                      {alert.statusLabel}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Carousel Indicators */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {alerts.map((alert, index) => (
          <button
            key={alert.id}
            onClick={() => scrollToCard(index)}
            className="transition-all"
            style={{
              width: currentIndex === index ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: currentIndex === index 
                ? alert.iconColor
                : darkMode 
                  ? 'rgba(255, 255, 255, 0.3)' 
                  : 'rgba(0, 0, 0, 0.2)',
              boxShadow: currentIndex === index 
                ? `0 0 8px ${alert.iconColor}`
                : 'none',
              transition: 'all 0.3s ease',
            }}
            aria-label={`View alert ${index + 1}`}
          />
        ))}
      </div>

      {/* Hide scrollbar styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
