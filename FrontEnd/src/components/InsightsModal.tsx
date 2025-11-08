import { X, Zap, TrendingUp } from 'lucide-react';

interface InsightsModalProps {
  onClose: () => void;
  contentType: 'ev' | 'optimize';
  onConfirm: () => void;
  darkMode?: boolean;
}

export function InsightsModal({ onClose, contentType, onConfirm, darkMode = false }: InsightsModalProps) {
  const modalBg = darkMode ? '#2D4A3E' : 'rgba(255, 250, 219, 0.8)';
  const innerCardBg = darkMode ? '#2A4035' : '#FFFFFF';
  const textPrimary = darkMode ? '#FFFFFF' : '#000000';
  const textSecondary = darkMode ? '#FFFFFF' : '#6b7280';

  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 z-50" style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
      <div 
        className="w-full max-w-md relative rounded-xl p-6"
        style={{
          background: darkMode ? 'rgba(45, 74, 62, 0.9)' : modalBg,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: darkMode 
            ? '0 20px 60px rgba(0, 0, 0, 0.5)' 
            : '0 20px 60px rgba(0, 0, 0, 0.15)'
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full transition-all hover:scale-110 active:scale-95"
          style={{
            background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'
          }}
        >
          <X className="w-5 h-5" style={{ color: textPrimary }} />
        </button>

        {contentType === 'ev' ? (
          <div className="flex flex-col gap-6 pt-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full" style={{
                background: darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 163, 152, 0.15)'
              }}>
                <Zap className="w-6 h-6" style={{ color: darkMode ? '#10B981' : 'var(--accent-success)' }} />
              </div>
              <h2 className="text-xl" style={{ 
                color: textPrimary,
                fontWeight: 'var(--font-weight-bold)'
              }}>Set EV Charging</h2>
            </div>

            <p style={{ 
              color: textPrimary,
              lineHeight: '1.6',
              fontWeight: '400',
              opacity: 0.9
            }}>
              Optimize your electric vehicle charging schedule to take advantage of off-peak rates and solar generation.
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between p-4 rounded-xl" style={{
                background: darkMode ? '#3A5C4A' : innerCardBg
              }}>
                <span style={{ color: textSecondary, opacity: 0.8 }}>Charge Time</span>
                <span style={{ color: textPrimary }}>2:00 AM - 6:00 AM</span>
              </div>
              
              <div className="flex justify-between p-4 rounded-xl" style={{
                background: darkMode ? '#3A5C4A' : innerCardBg
              }}>
                <span style={{ color: textSecondary, opacity: 0.8 }}>Energy Source</span>
                <span style={{ color: textPrimary }}>Grid + Solar</span>
              </div>

              <div className="flex justify-between p-4 rounded-xl" style={{
                background: darkMode ? '#3A5C4A' : innerCardBg
              }}>
                <span style={{ color: textSecondary, opacity: 0.8 }}>Est. Cost</span>
                <span style={{ color: '#10B981' }}>16 CO₂</span>
              </div>
            </div>

            <button 
              onClick={onConfirm}
              className="w-full text-white py-4 rounded-xl transition-all hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center"
              style={{
                background: darkMode ? '#10B981' : 'linear-gradient(135deg, var(--accent-success) 0%, #84cc16 100%)',
                fontWeight: 'var(--font-weight-semibold)'
              }}
            >
              Confirm Schedule
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-6 pt-2">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full" style={{
                background: darkMode ? 'rgba(132, 204, 22, 0.2)' : 'rgba(132, 204, 22, 0.15)'
              }}>
                <TrendingUp className="w-6 h-6" style={{ color: darkMode ? '#84cc16' : '#84cc16' }} />
              </div>
              <h2 className="text-xl" style={{ 
                color: textPrimary,
                fontWeight: 'var(--font-weight-bold)'
              }}>Optimize Now</h2>
            </div>

            <p style={{ 
              color: textPrimary,
              lineHeight: '1.6',
              fontWeight: '400',
              opacity: 0.9
            }}>
              AI-powered optimization to reduce costs and maximize solar efficiency based on weather and usage patterns.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl" style={{
                background: darkMode ? '#3A5C4A' : innerCardBg
              }}>
                <span className="text-sm" style={{ color: textSecondary, opacity: 0.8 }}>Potential Savings</span>
                <p className="text-2xl mt-1" style={{ color: textPrimary }}>$24</p>
                <span className="text-xs" style={{ color: '#10B981' }}>This week</span>
              </div>

              <div className="p-4 rounded-xl" style={{
                background: darkMode ? '#3A5C4A' : innerCardBg
              }}>
                <span className="text-sm" style={{ color: textSecondary, opacity: 0.8 }}>Efficiency Gain</span>
                <p className="text-2xl mt-1" style={{ color: textPrimary }}>18%</p>
                <span className="text-xs" style={{ color: '#0d9488' }}>Projected</span>
              </div>
            </div>

            <div className="p-4 rounded-xl" style={{
              background: darkMode ? '#3A5C4A' : innerCardBg
            }}>
              <span className="text-sm block mb-2" style={{ color: textSecondary, opacity: 0.8 }}>Optimization Actions</span>
              <ul className="space-y-2 text-sm" style={{ color: textPrimary }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#10B981' }}>✓</span>
                  <span>Shift heavy loads to solar peak hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#10B981' }}>✓</span>
                  <span>Reduce grid dependency by 12%</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: '#10B981' }}>✓</span>
                  <span>Schedule battery charging optimally</span>
                </li>
              </ul>
            </div>

            <button 
              onClick={onConfirm}
              className="w-full text-white py-4 rounded-xl transition-all hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center"
              style={{
                background: darkMode ? '#10B981' : 'linear-gradient(135deg, var(--accent-success) 0%, #84cc16 100%)',
                fontWeight: 'var(--font-weight-semibold)'
              }}
            >
              Apply Optimization
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
