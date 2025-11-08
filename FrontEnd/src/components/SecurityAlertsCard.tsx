import { Zap, AlertTriangle, LinkIcon, ShieldAlert } from 'lucide-react';

interface SecurityAlertsCardProps {
  darkMode?: boolean;
  alertType?: 1 | 2 | 3; // 1 = Energy Fluctuation, 2 = Data Integrity Risk, 3 = Dataset Compromise
}

export function SecurityAlertsCard({ 
  darkMode = false,
  alertType = 1
}: SecurityAlertsCardProps) {
  
  // Define alert configurations with swapping logic
  const alerts = {
    1: {
      icon: Zap,
      title: 'Energy Balance Disrupted',
      description: 'Current data flow is inconsistent. Check predictive model accuracy.',
      gradientBg: darkMode 
        ? 'linear-gradient(90deg, rgba(251, 146, 60, 0.22) 0%, rgba(234, 88, 12, 0.22) 100%)'
        : 'linear-gradient(90deg, rgba(251, 146, 60, 0.35) 0%, rgba(234, 88, 12, 0.35) 100%)',
      iconColor: darkMode ? '#FB923C' : '#EA580C',
      borderColor: darkMode ? 'rgba(251, 146, 60, 0.35)' : 'rgba(251, 146, 60, 0.5)',
      statusLabel: 'FLUCTUATION',
    },
    2: {
      icon: LinkIcon,
      title: 'Blockchain Integrity Risk',
      description: 'Unauthorized local data tampering attempt detected. System metrics are unstable.',
      gradientBg: darkMode 
        ? 'linear-gradient(90deg, rgba(234, 179, 8, 0.22) 0%, rgba(239, 68, 68, 0.22) 100%)'
        : 'linear-gradient(90deg, rgba(234, 179, 8, 0.35) 0%, rgba(239, 68, 68, 0.35) 100%)',
      iconColor: darkMode ? '#FBBF24' : '#DC2626',
      borderColor: darkMode ? 'rgba(234, 179, 8, 0.35)' : 'rgba(239, 68, 68, 0.5)',
      statusLabel: 'DATA RISK',
    },
    3: {
      icon: ShieldAlert,
      title: 'CRITICAL: Quantum Dataset Compromise',
      description: 'Severe attack detected. Immediate system lockdown is recommended.',
      gradientBg: darkMode 
        ? 'linear-gradient(90deg, rgba(220, 38, 38, 0.30) 0%, rgba(127, 29, 29, 0.30) 100%)'
        : 'linear-gradient(90deg, rgba(220, 38, 38, 0.45) 0%, rgba(127, 29, 29, 0.45) 100%)',
      iconColor: darkMode ? '#DC2626' : '#7F1D1D',
      borderColor: darkMode ? 'rgba(220, 38, 38, 0.45)' : 'rgba(220, 38, 38, 0.6)',
      statusLabel: 'CRITICAL',
    },
  };

  const currentAlert = alerts[alertType];
  const IconComponent = currentAlert.icon;

  return (
    <div 
      className="rounded-xl px-4 py-3.5 glass-card transition-all"
      style={{
        background: currentAlert.gradientBg,
        border: `1.5px solid ${currentAlert.borderColor}`,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      {/* Compact Banner Layout */}
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
              color: currentAlert.iconColor,
              strokeWidth: 2.5
            }} 
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-0.5">
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
              {currentAlert.title}
            </h3>
          </div>
          <p 
            className="text-xs line-clamp-1"
            style={{ 
              color: darkMode ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.7)',
              fontWeight: 'var(--font-weight-normal)',
              lineHeight: '1.4'
            }}
          >
            {currentAlert.description}
          </p>
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
              background: currentAlert.iconColor,
              boxShadow: `0 0 6px ${currentAlert.iconColor}`
            }}
          />
          <span 
            className="text-xs whitespace-nowrap"
            style={{ 
              color: currentAlert.iconColor,
              fontWeight: 'var(--font-weight-bold)',
              fontSize: '10px',
              letterSpacing: '0.03em'
            }}
          >
            {currentAlert.statusLabel}
          </span>
        </div>
      </div>
    </div>
  );
}
