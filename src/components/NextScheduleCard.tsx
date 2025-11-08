import { Calendar, Clock } from 'lucide-react';

interface NextScheduleCardProps {
  darkMode?: boolean;
  daysUntil?: number;
  onBookAppointment?: () => void;
}

export function NextScheduleCard({ 
  darkMode = false, 
  daysUntil = 14,
  onBookAppointment 
}: NextScheduleCardProps) {
  
  const cardBg = darkMode 
    ? 'linear-gradient(90deg, rgba(42, 64, 53, 0.4), rgba(53, 90, 70, 0.4))' 
    : 'linear-gradient(90deg, rgba(98, 191, 212, 0.4) 0%, rgba(241, 221, 118, 0.4) 100%)';

  return (
    <div 
      className="rounded-2xl p-5 glass-card card-shadow"
      style={{
        background: cardBg,
        border: '1px solid rgba(255, 255, 255, 0.18)'
      }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="p-2.5 rounded-xl"
          style={{
            background: darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 163, 152, 0.15)'
          }}
        >
          <Calendar className="w-5 h-5" style={{ color: darkMode ? '#10B981' : '#00a398' }} />
        </div>
        <h3 style={{ 
          color: darkMode ? '#FFFFFF' : '#000000',
          fontWeight: 'var(--font-weight-semibold)',
          letterSpacing: '-0.01em'
        }}>Next Schedule</h3>
      </div>

      <div 
        className="rounded-xl p-6 mb-4 text-center"
        style={{
          background: darkMode ? 'rgba(45, 74, 62, 0.6)' : 'rgba(255, 255, 255, 0.85)',
          border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)'
        }}
      >
        <p className="mb-4" style={{ 
          color: darkMode ? 'rgba(255, 255, 255, 0.9)' : '#374151',
          fontWeight: 'var(--font-weight-normal)',
          lineHeight: '1.5'
        }}>Your next maintenance will be in</p>
        
        <p className="text-5xl" style={{ 
          color: darkMode ? '#10B981' : '#00a398',
          fontWeight: 'var(--font-weight-bold)',
          letterSpacing: '-0.03em',
          lineHeight: '1.2'
        }}>{daysUntil} days</p>
      </div>

      <button 
        onClick={onBookAppointment}
        className="w-full text-white py-3.5 px-4 rounded-xl transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        style={{ 
          background: darkMode ? '#10B981' : 'linear-gradient(to right, #10B981, #84cc16)',
          fontWeight: 'var(--font-weight-semibold)',
          letterSpacing: '0.01em'
        }}
      >
        <Calendar className="w-4 h-4" />
        Book Appointment
      </button>
    </div>
  );
}
