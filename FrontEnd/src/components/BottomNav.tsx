import { Home, TrendingUp, DollarSign, Settings } from 'lucide-react';

interface BottomNavProps {
  activePage: 'home' | 'insights' | 'transaction' | 'settings';
  onNavigate: (page: 'home' | 'insights' | 'transaction' | 'settings') => void;
}

const navItems = [
  { id: 'home' as const, label: 'Home', Icon: Home },
  { id: 'insights' as const, label: 'Insights', Icon: TrendingUp },
  { id: 'transaction' as const, label: 'Trade', Icon: DollarSign },
  { id: 'settings' as const, label: 'Settings', Icon: Settings },
];

export function BottomNav({ activePage, onNavigate }: BottomNavProps) {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 border-t px-4 pb-6 pt-3 glass-card-medium"
      style={{ 
        background: 'linear-gradient(90deg, rgba(98, 191, 212, 0.4) 0%, rgba(241, 221, 118, 0.4) 100%)',
        borderColor: 'rgba(128, 128, 128, 0.15)',
        backdropFilter: 'blur(15px)'
      }}
    >
      <div className="flex justify-around items-center max-w-[430px] mx-auto">
        {navItems.map(({ id, label, Icon }) => {
          const isActive = activePage === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center gap-1.5 min-w-0 flex-1 transition-all duration-200 ${
                isActive 
                  ? 'transform -translate-y-2 scale-110' 
                  : 'hover:-translate-y-1 hover:scale-105 active:translate-y-0 active:scale-95'
              }`}
            >
              <div 
                className={`transition-all duration-200 rounded-2xl ${
                  isActive ? 'p-2.5 shadow-lg' : 'p-2.5'
                }`}
                style={isActive ? {
                  background: 'linear-gradient(135deg, var(--accent-success) 0%, #84cc16 100%)'
                } : undefined}
              >
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-white' : ''
                  }`}
                  style={{ color: isActive ? undefined : 'var(--text-secondary)' }}
                />
              </div>
              <span
                className="text-[11px] transition-all duration-200"
                style={{ 
                  color: isActive ? 'var(--accent-success)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)'
                }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
