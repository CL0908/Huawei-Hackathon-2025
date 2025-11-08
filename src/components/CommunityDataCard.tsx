import { LucideIcon } from 'lucide-react';

interface CommunityDataCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  subtitle?: string;
  darkMode?: boolean;
  color?: string;
}

export function CommunityDataCard({
  icon: Icon,
  label,
  value,
  subtitle,
  darkMode = false,
  color,
}: CommunityDataCardProps) {
  const accentColor = color || (darkMode ? '#5FC3A2' : '#10B981');

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: darkMode
          ? 'linear-gradient(90deg, rgba(42, 64, 53, 0.8), rgba(53, 90, 70, 0.8))'
          : 'linear-gradient(90deg, rgba(98, 191, 212, 0.4) 0%, rgba(241, 221, 118, 0.4) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div
          className="p-2 rounded-lg"
          style={{
            background: darkMode
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(255, 255, 255, 0.5)',
          }}
        >
          <Icon className="w-4 h-4" style={{ color: accentColor }} />
        </div>
        <p
          className="text-sm"
          style={{
            color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            fontWeight: 'var(--font-weight-light)',
          }}
        >
          {label}
        </p>
      </div>
      <p
        className="text-2xl mb-1"
        style={{
          color: darkMode ? '#FFFFFF' : '#000000',
          fontWeight: 'var(--font-weight-bold)',
          letterSpacing: '-0.01em',
        }}
      >
        {value}
      </p>
      {subtitle && (
        <p
          className="text-xs"
          style={{
            color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
