import { CheckCircle, LucideIcon } from 'lucide-react';

interface NotificationModalProps {
  message: string;
  onClose: () => void;
  icon?: LucideIcon;
  darkMode?: boolean;
}

export function NotificationModal({ message, onClose, icon: Icon = CheckCircle, darkMode = false }: NotificationModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 z-50" style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
      <div 
        className="w-full max-w-md rounded-xl p-8 flex flex-col items-center gap-6"
        style={{
          background: darkMode ? 'rgba(45, 74, 62, 0.9)' : 'rgba(255, 250, 219, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: darkMode 
            ? '0 20px 60px rgba(0, 0, 0, 0.5)' 
            : '0 20px 60px rgba(0, 0, 0, 0.15)'
        }}
      >
        <div className="p-4 rounded-full" style={{
          background: darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 163, 152, 0.15)'
        }}>
          <Icon className="w-12 h-12" style={{ color: darkMode ? '#10B981' : 'var(--accent-success)' }} />
        </div>
        
        <p className="text-center text-lg" style={{ 
          color: darkMode ? '#FFFFFF' : '#000000',
          fontWeight: '400'
        }}>
          {message}
        </p>

        <button
          onClick={onClose}
          className="w-full text-white py-4 rounded-xl transition-all hover:shadow-lg hover:scale-105 active:scale-95 flex items-center justify-center"
          style={{ 
            background: darkMode ? '#10B981' : 'linear-gradient(135deg, var(--accent-success) 0%, #84cc16 100%)',
            fontWeight: 'var(--font-weight-semibold)'
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}
