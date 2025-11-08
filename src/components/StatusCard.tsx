import { LucideIcon } from 'lucide-react';

interface StatusCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  trend?: string;
  darkMode?: boolean;
  accent?: boolean;
}

export function StatusCard({ icon: Icon, value, label, trend, darkMode = false, accent = false }: StatusCardProps) {
  return (
    <div 
      className={`rounded-2xl p-4 flex flex-col gap-2 transition-all hover:scale-105 ${accent ? 'transform translate-y-[-4px]' : ''}`}
      style={{
        background: darkMode 
          ? 'rgba(58, 92, 74, 0.6)' 
          : 'rgba(200, 230, 201, 0.5)',
        border: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
      }}
    >
      <Icon className="w-6 h-6" style={{ color: darkMode ? '#10B981' : '#14B8A6' }} />
      <div className="flex flex-col">
        <span className="text-3xl data-value" style={{ 
          color: darkMode ? '#FFFFFF' : '#000000',
          fontWeight: 'var(--font-weight-bold)'
        }}>{value}</span>
        <span className="text-xs data-label" style={{ 
          color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#000000',
          fontWeight: 'var(--font-weight-light)'
        }}>{label}</span>
        {trend && (
          <span className="text-xs mt-1" style={{
            color: darkMode ? '#10B981' : '#14B8A6',
            fontWeight: 'var(--font-weight-semibold)'
          }}>{trend}</span>
        )}
      </div>
    </div>
  );
}
