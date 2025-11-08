import { X, CheckCircle, Shield, Lock, TrendingUp, Activity, Lightbulb } from 'lucide-react';

interface AlertDetailsModalProps {
  darkMode?: boolean;
  alertId: number | null;
  onClose: () => void;
}

export function AlertDetailsModal({ darkMode = false, alertId, onClose }: AlertDetailsModalProps) {
  if (!alertId) return null;

  // System Health configurations with full details and recommendations
  const alertDetails: Record<number, {
    icon: any;
    title: string;
    description: string;
    severity: string;
    iconColor: string;
    gradientBg: string;
    borderColor: string;
    statusLabel: string;
    recommendations: string[];
    technicalDetails: string;
  }> = {
    1: {
      icon: CheckCircle,
      title: 'Energy Flow Stable',
      description: 'All energy systems are operating normally. Data flow is consistent and predictive models are accurate.',
      severity: 'Optimal',
      iconColor: darkMode ? '#10B981' : '#0d9488',
      gradientBg: darkMode 
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(13, 148, 136, 0.15) 100%)'
        : 'linear-gradient(135deg, rgba(16, 185, 129, 0.20) 0%, rgba(13, 148, 136, 0.20) 100%)',
      borderColor: darkMode ? 'rgba(16, 185, 129, 0.35)' : 'rgba(13, 148, 136, 0.45)',
      statusLabel: 'GOOD',
      recommendations: [
        'Continue current energy usage patterns for optimal efficiency',
        'Solar panels are generating expected output based on weather conditions',
        'Battery charge/discharge cycles are within healthy parameters',
        'Predictive models are accurately forecasting energy needs',
        'All system sensors and meters are calibrated and functioning properly',
      ],
      technicalDetails: 'Energy flow monitoring confirms all systems are operating within optimal parameters. Solar generation matches predictions, battery management is efficient, and consumption patterns are stable. Last system check completed successfully with no anomalies detected.',
    },
    2: {
      icon: Shield,
      title: 'Data Integrity Good',
      description: 'Blockchain verification complete. All data records are secure and verified with no tampering detected.',
      severity: 'Secure',
      iconColor: darkMode ? '#10B981' : '#0d9488',
      gradientBg: darkMode 
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(13, 148, 136, 0.15) 100%)'
        : 'linear-gradient(135deg, rgba(16, 185, 129, 0.20) 0%, rgba(13, 148, 136, 0.20) 100%)',
      borderColor: darkMode ? 'rgba(16, 185, 129, 0.35)' : 'rgba(13, 148, 136, 0.45)',
      statusLabel: 'SAFE',
      recommendations: [
        'All blockchain hashes verified and match distributed ledger',
        'Energy transaction records are immutable and secure',
        'No unauthorized access attempts detected in the last 30 days',
        'Data synchronization with Huawei cloud is functioning correctly',
        'Regular automated security audits are passing all checks',
      ],
      technicalDetails: 'Comprehensive blockchain verification completed successfully. All energy transaction records maintain cryptographic integrity with zero discrepancies between local and distributed ledgers. Security monitoring shows no suspicious activity, and all authentication protocols are functioning as designed.',
    },
    3: {
      icon: Lock,
      title: 'Quantum Security Stable',
      description: 'Advanced quantum encryption is active. All transactions are protected and system integrity is maintained.',
      severity: 'Protected',
      iconColor: darkMode ? '#10B981' : '#0d9488',
      gradientBg: darkMode 
        ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(13, 148, 136, 0.15) 100%)'
        : 'linear-gradient(135deg, rgba(16, 185, 129, 0.20) 0%, rgba(13, 148, 136, 0.20) 100%)',
      borderColor: darkMode ? 'rgba(16, 185, 129, 0.35)' : 'rgba(13, 148, 136, 0.45)',
      statusLabel: 'SECURE',
      recommendations: [
        'Quantum encryption keys are current and properly rotated',
        'Advanced threat detection systems show no suspicious activity',
        'All network connections are encrypted with quantum-resistant algorithms',
        'System firewalls and intrusion detection are operating normally',
        'Regular security patches and updates are applied automatically',
      ],
      technicalDetails: 'Quantum-level security protocols are fully operational. All energy transactions benefit from advanced quantum encryption that protects against both current and future computing threats. Security infrastructure includes multi-layer protection with continuous monitoring, automated threat response, and zero-trust architecture.',
    },
  };

  const alert = alertDetails[alertId];
  if (!alert) return null;

  const IconComponent = alert.icon;
  const bgColor = darkMode ? '#0F172A' : '#FFFFFF';
  const textPrimary = darkMode ? '#FFFFFF' : '#1F2937';
  const textSecondary = darkMode ? 'rgba(255, 255, 255, 0.7)' : '#6B7280';

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black transition-opacity"
        style={{ 
          opacity: 0.6,
          zIndex: 50 
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="fixed inset-x-0 bottom-0 mx-auto max-w-[430px] transition-transform"
        style={{ 
          zIndex: 51,
          transform: 'translateY(0)',
        }}
      >
        <div 
          className="rounded-t-3xl shadow-2xl overflow-hidden"
          style={{
            background: bgColor,
            maxHeight: '85vh',
          }}
        >
          {/* Header */}
          <div 
            className="sticky top-0 px-6 py-4 flex items-center justify-between border-b"
            style={{
              background: alert.gradientBg,
              borderColor: alert.borderColor,
              backdropFilter: 'blur(10px)',
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="p-2.5 rounded-xl"
                style={{
                  background: darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.7)',
                }}
              >
                <IconComponent 
                  className="w-6 h-6" 
                  style={{ 
                    color: alert.iconColor,
                    strokeWidth: 2.5
                  }} 
                />
              </div>
              <div>
                <h2 
                  className="font-bold"
                  style={{ 
                    color: textPrimary,
                    fontSize: '18px',
                    letterSpacing: '-0.01em'
                  }}
                >
                  System Health Details
                </h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <div 
                    className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ 
                      background: alert.iconColor,
                      boxShadow: `0 0 6px ${alert.iconColor}`
                    }}
                  />
                  <span 
                    style={{ 
                      color: alert.iconColor,
                      fontWeight: 'var(--font-weight-bold)',
                      fontSize: '11px',
                      letterSpacing: '0.03em'
                    }}
                  >
                    {alert.statusLabel}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-black/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" style={{ color: textPrimary }} />
            </button>
          </div>

          {/* Content */}
          <div 
            className="overflow-y-auto px-6 py-6 space-y-6"
            style={{
              maxHeight: 'calc(85vh - 88px)',
            }}
          >
            {/* Alert Title & Description */}
            <div>
              <h3 
                className="mb-2"
                style={{ 
                  color: textPrimary,
                  fontWeight: 'var(--font-weight-bold)',
                  fontSize: '20px',
                  letterSpacing: '-0.02em'
                }}
              >
                {alert.title}
              </h3>
              <p 
                className="leading-relaxed"
                style={{ 
                  color: textSecondary,
                  fontSize: '15px'
                }}
              >
                {alert.description}
              </p>
            </div>

            {/* Status Badge */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{
                background: alert.gradientBg,
                border: `1px solid ${alert.borderColor}`,
              }}
            >
              <Activity 
                className="w-4 h-4" 
                style={{ color: alert.iconColor }} 
              />
              <span style={{ 
                color: textPrimary,
                fontWeight: 'var(--font-weight-semibold)',
                fontSize: '14px'
              }}>
                Status: {alert.severity}
              </span>
            </div>

            {/* Technical Details */}
            <div 
              className="p-4 rounded-xl"
              style={{
                background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                border: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
              }}
            >
              <h4 
                className="mb-2 flex items-center gap-2"
                style={{ 
                  color: textPrimary,
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: '15px'
                }}
              >
                <TrendingUp className="w-4 h-4" style={{ color: alert.iconColor }} />
                System Overview
              </h4>
              <p 
                className="text-sm leading-relaxed"
                style={{ color: textSecondary }}
              >
                {alert.technicalDetails}
              </p>
            </div>

            {/* System Recommendations */}
            <div>
              <h4 
                className="mb-3 flex items-center gap-2"
                style={{ 
                  color: textPrimary,
                  fontWeight: 'var(--font-weight-bold)',
                  fontSize: '16px'
                }}
              >
                <CheckCircle 
                  className="w-5 h-5" 
                  style={{ 
                    color: darkMode ? '#10B981' : '#059669'
                  }} 
                />
                Current Status & Recommendations
              </h4>
              <div className="space-y-3">
                {alert.recommendations.map((solution, index) => (
                  <div 
                    key={index}
                    className="flex gap-3 p-3 rounded-lg transition-colors hover:bg-black/5"
                    style={{
                      background: darkMode ? 'rgba(16, 185, 129, 0.05)' : 'rgba(5, 150, 105, 0.05)',
                      border: `1px solid ${darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(5, 150, 105, 0.2)'}`,
                    }}
                  >
                    <CheckCircle 
                      className="w-5 h-5 flex-shrink-0 mt-0.5" 
                      style={{ 
                        color: darkMode ? '#10B981' : '#059669'
                      }} 
                    />
                    <p 
                      className="text-sm leading-relaxed"
                      style={{ color: textPrimary }}
                    >
                      {solution}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button 
              onClick={onClose}
              className="w-full py-4 rounded-xl transition-all hover:shadow-lg active:scale-98"
              style={{
                background: darkMode 
                  ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' 
                  : 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
                border: darkMode 
                  ? '1.5px solid rgba(16, 185, 129, 0.4)' 
                  : '1.5px solid rgba(13, 148, 136, 0.3)',
                color: '#FFFFFF',
                fontWeight: 'var(--font-weight-semibold)',
                fontSize: '16px',
                letterSpacing: '0.01em',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
