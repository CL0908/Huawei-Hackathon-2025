import { useState, useRef, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

interface SystemData {
  title: string;
  lastCheck: string;
  technicianName: string;
  status: 'good' | 'warning';
}

interface SystemCarouselProps {
  darkMode?: boolean;
  systems?: SystemData[];
}

export function SystemCarousel({ 
  darkMode = false,
  systems = [
    {
      title: 'System Overview',
      lastCheck: 'Oct 15, 2025',
      technicianName: 'John Smith',
      status: 'good'
    },
    {
      title: 'Solar Panel Status',
      lastCheck: 'Oct 18, 2025',
      technicianName: 'Sarah Johnson',
      status: 'good'
    },
    {
      title: 'Battery System',
      lastCheck: 'Sep 28, 2025',
      technicianName: 'Mike Davis',
      status: 'warning'
    }
  ]
}: SystemCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  const cardBg = darkMode 
    ? 'linear-gradient(90deg, #2A4035, #355A46)'
    : 'linear-gradient(90deg, rgba(98, 191, 212, 0.5) 0%, rgba(241, 221, 118, 0.5) 100%)';

  // Touch/Mouse event handlers for swipe functionality
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grabbing';
    }
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const currentPosition = clientX;
    const diff = currentPosition - startX;
    setCurrentTranslate(prevTranslate + diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const movedBy = currentTranslate - prevTranslate;
    
    // Determine swipe direction and threshold (50px minimum swipe)
    if (movedBy < -50 && activeIndex < systems.length - 1) {
      // Swipe left - next slide
      goToSlide(activeIndex + 1);
    } else if (movedBy > 50 && activeIndex > 0) {
      // Swipe right - previous slide
      goToSlide(activeIndex - 1);
    } else {
      // Return to current slide
      setCurrentTranslate(prevTranslate);
    }
    
    if (carouselRef.current) {
      carouselRef.current.style.cursor = 'grab';
    }
  };

  const goToSlide = (index: number) => {
    if (index < 0 || index >= systems.length) return;
    setActiveIndex(index);
    const translateValue = -index * 100;
    setPrevTranslate(translateValue);
    setCurrentTranslate(translateValue);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  // Arrow navigation
  const handlePrev = () => {
    if (activeIndex > 0) {
      goToSlide(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex < systems.length - 1) {
      goToSlide(activeIndex + 1);
    }
  };

  useEffect(() => {
    const translateValue = -activeIndex * 100;
    setPrevTranslate(translateValue);
    setCurrentTranslate(translateValue);
  }, [activeIndex]);

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        disabled={activeIndex === 0}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: darkMode ? 'rgba(45, 74, 62, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          border: darkMode ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
          opacity: activeIndex === 0 ? 0.3 : 1,
          pointerEvents: activeIndex === 0 ? 'none' : 'auto',
          boxShadow: darkMode 
            ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
          transform: 'translateX(-50%) translateY(-50%)',
          left: '8px'
        }}
        aria-label="Previous slide"
      >
        <ChevronLeft 
          className="w-5 h-5" 
          style={{ color: darkMode ? '#10B981' : '#059669' }} 
        />
      </button>

      <button
        onClick={handleNext}
        disabled={activeIndex === systems.length - 1}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
        style={{
          background: darkMode ? 'rgba(45, 74, 62, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          border: darkMode ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(0, 0, 0, 0.1)',
          opacity: activeIndex === systems.length - 1 ? 0.3 : 1,
          pointerEvents: activeIndex === systems.length - 1 ? 'none' : 'auto',
          boxShadow: darkMode 
            ? '0 4px 12px rgba(0, 0, 0, 0.3)' 
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
          transform: 'translateX(50%) translateY(-50%)',
          right: '8px'
        }}
        aria-label="Next slide"
      >
        <ChevronRight 
          className="w-5 h-5" 
          style={{ color: darkMode ? '#10B981' : '#059669' }} 
        />
      </button>

      {/* Carousel Container */}
      <div 
        className="relative overflow-hidden rounded-2xl"
        style={{ 
          touchAction: 'pan-y',
          userSelect: 'none'
        }}
      >
        <div 
          ref={carouselRef}
          className="flex transition-transform ease-out"
          style={{
            transform: `translateX(${currentTranslate}%)`,
            transitionDuration: isDragging ? '0ms' : '500ms',
            cursor: 'grab'
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {systems.map((system, index) => (
            <div 
              key={index}
              className="min-w-full px-1"
              style={{ pointerEvents: isDragging ? 'none' : 'auto' }}
            >
              <div 
                className="rounded-2xl p-6 glass-card card-shadow relative overflow-hidden"
                style={{
                  background: cardBg,
                  opacity: darkMode ? 0.8 : 1,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: darkMode 
                    ? '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                    : '0 4px 20px rgba(0, 0, 0, 0.08)'
                }}
              >
                {/* Futuristic corner accents */}
                {darkMode && (
                  <>
                    <div 
                      className="absolute top-0 left-0 w-12 h-12"
                      style={{
                        borderTop: '2px solid rgba(16, 185, 129, 0.3)',
                        borderLeft: '2px solid rgba(16, 185, 129, 0.3)',
                        borderTopLeftRadius: '16px'
                      }}
                    />
                    <div 
                      className="absolute top-0 right-0 w-12 h-12"
                      style={{
                        borderTop: '2px solid rgba(16, 185, 129, 0.3)',
                        borderRight: '2px solid rgba(16, 185, 129, 0.3)',
                        borderTopRightRadius: '16px'
                      }}
                    />
                  </>
                )}

                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 style={{ 
                      color: darkMode ? '#FFFFFF' : '#000000',
                      fontWeight: 'var(--font-weight-semibold)',
                      letterSpacing: '-0.01em',
                      fontSize: '1.125rem',
                      textShadow: darkMode ? '0 2px 8px rgba(0, 0, 0, 0.3)' : 'none'
                    }}>{system.title}</h3>
                    
                    {/* Slide counter */}
                    <p 
                      className="text-xs mt-1"
                      style={{
                        color: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                        fontWeight: 'var(--font-weight-light)',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {index + 1} / {systems.length}
                    </p>
                  </div>
                  
                  <div 
                    className="p-2 rounded-full"
                    style={{
                      background: system.status === 'good'
                        ? (darkMode ? 'rgba(16, 185, 129, 0.15)' : 'rgba(5, 150, 105, 0.1)')
                        : (darkMode ? 'rgba(251, 146, 60, 0.15)' : 'rgba(234, 88, 12, 0.1)'),
                      border: system.status === 'good'
                        ? (darkMode ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(5, 150, 105, 0.2)')
                        : (darkMode ? '1px solid rgba(251, 146, 60, 0.3)' : '1px solid rgba(234, 88, 12, 0.2)'),
                      boxShadow: system.status === 'good' && darkMode
                        ? '0 0 16px rgba(16, 185, 129, 0.3)'
                        : system.status === 'warning' && darkMode
                        ? '0 0 16px rgba(251, 146, 60, 0.3)'
                        : 'none'
                    }}
                  >
                    {system.status === 'good' ? (
                      <CheckCircle2 className="w-6 h-6" style={{ color: darkMode ? '#10B981' : '#059669' }} />
                    ) : (
                      <AlertTriangle className="w-6 h-6" style={{ color: darkMode ? '#fb923c' : '#ea580c' }} />
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div 
                    className="pb-3"
                    style={{
                      borderBottom: darkMode 
                        ? '1px solid rgba(255, 255, 255, 0.1)' 
                        : '1px solid rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <p className="text-xs mb-1.5" style={{ 
                      color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#6B7280',
                      fontWeight: 'var(--font-weight-light)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Last Check</p>
                    <p style={{ 
                      color: darkMode ? '#FFFFFF' : '#000000',
                      fontWeight: 'var(--font-weight-medium)',
                      fontSize: '0.9375rem'
                    }}>{system.lastCheck}</p>
                  </div>

                  <div 
                    className="pb-3"
                    style={{
                      borderBottom: darkMode 
                        ? '1px solid rgba(255, 255, 255, 0.1)' 
                        : '1px solid rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <p className="text-xs mb-1.5" style={{ 
                      color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#6B7280',
                      fontWeight: 'var(--font-weight-light)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Technician</p>
                    <p style={{ 
                      color: darkMode ? '#FFFFFF' : '#000000',
                      fontWeight: 'var(--font-weight-medium)',
                      fontSize: '0.9375rem'
                    }}>{system.technicianName}</p>
                  </div>

                  <div>
                    <p className="text-xs mb-1.5" style={{ 
                      color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#6B7280',
                      fontWeight: 'var(--font-weight-light)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Status</p>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2.5 h-2.5 rounded-full"
                        style={{
                          background: system.status === 'good' 
                            ? (darkMode ? '#10B981' : '#059669') 
                            : (darkMode ? '#fb923c' : '#ea580c'),
                          boxShadow: darkMode 
                            ? `0 0 8px ${system.status === 'good' ? '#10B981' : '#fb923c'}`
                            : 'none',
                          animation: darkMode ? 'pulse 2s ease-in-out infinite' : 'none'
                        }}
                      />
                      <span style={{ 
                        color: system.status === 'good' 
                          ? (darkMode ? '#10B981' : '#059669') 
                          : (darkMode ? '#fb923c' : '#ea580c'),
                        fontWeight: 'var(--font-weight-semibold)',
                        textTransform: 'capitalize',
                        fontSize: '0.9375rem'
                      }}>
                        {system.status === 'good' ? 'All Good' : 'Attention Needed'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Dot Indicators */}
      <div className="flex items-center justify-center gap-2.5 mt-5">
        {systems.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="transition-all duration-300 hover:scale-110 active:scale-95"
            style={{
              width: activeIndex === index ? '32px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: activeIndex === index 
                ? (darkMode ? '#10B981' : '#00a398')
                : (darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)'),
              border: activeIndex === index && darkMode
                ? '1px solid rgba(16, 185, 129, 0.5)'
                : 'none',
              boxShadow: activeIndex === index && darkMode
                ? '0 0 12px rgba(16, 185, 129, 0.4)'
                : 'none'
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Swipe hint indicator (only show for first few seconds) */}
      <style>{`
        @keyframes swipeHint {
          0%, 100% { transform: translateX(0); opacity: 0.6; }
          50% { transform: translateX(10px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
