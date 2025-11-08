import { FileText, Shield, BookOpen, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';

interface UserGuidelinesPageProps {
  darkMode?: boolean;
  onBackToSettings?: () => void;
}

export function UserGuidelinesPage({ darkMode = false, onBackToSettings }: UserGuidelinesPageProps) {
  const cardBg = darkMode 
    ? 'linear-gradient(90deg, rgba(42, 64, 53, 0.85), rgba(53, 90, 70, 0.85))'
    : 'linear-gradient(90deg, rgba(98, 191, 212, 0.4) 0%, rgba(241, 221, 118, 0.4) 100%)';
  
  const innerCardBg = darkMode ? 'rgba(45, 74, 62, 0.85)' : '#FFFFFF';
  const textPrimary = darkMode ? '#FFFFFF' : 'var(--text-primary)';
  const textSecondary = darkMode ? '#FFFFFF' : 'var(--text-secondary)';

  return (
    <div className="flex flex-col gap-6 pb-24 px-6 pt-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl" style={{ color: textPrimary }}>User Guidelines</h1>
        <p className="mt-1" style={{ color: darkMode ? textPrimary : '#000000' }}>Important information about using the app</p>
      </div>

      {/* Introduction */}
      <div 
        className="rounded-xl p-6"
        style={{ 
          background: cardBg
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full" style={{
            background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(13, 148, 136, 0.15)'
          }}>
            <FileText className="w-5 h-5" style={{ color: darkMode ? '#FFFFFF' : '#0d9488' }} />
          </div>
          <h3 style={{ color: textPrimary }}>Welcome to Energy Manager</h3>
        </div>
        
        <p style={{ color: darkMode ? textPrimary : '#000000' }} className="leading-relaxed">
          This application helps you monitor, manage, and optimize your home energy usage. 
          Please read these guidelines carefully to make the most of all features.
        </p>
      </div>

      {/* Getting Started */}
      <div 
        className="rounded-xl p-6"
        style={{ 
          background: cardBg
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full" style={{
            background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(132, 204, 22, 0.15)'
          }}>
            <BookOpen className="w-5 h-5" style={{ color: darkMode ? '#FFFFFF' : '#84cc16' }} />
          </div>
          <h3 style={{ color: textPrimary }}>Getting Started</h3>
        </div>

        <div className="space-y-4">
          <div className="rounded-xl p-4" style={{
            background: innerCardBg
          }}>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: darkMode ? '#10B981' : '#059669' }} />
              <div>
                <h4 style={{ color: textPrimary }}>Monitor Your Usage</h4>
                <p className="text-sm mt-1" style={{ color: darkMode ? textPrimary : '#000000' }}>
                  Track real-time energy consumption and solar generation from the Home dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-4" style={{
            background: innerCardBg
          }}>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: darkMode ? '#10B981' : '#059669' }} />
              <div>
                <h4 style={{ color: textPrimary }}>Optimize Performance</h4>
                <p className="text-sm mt-1" style={{ color: darkMode ? textPrimary : '#000000' }}>
                  Use AI-powered insights to reduce costs and maximize efficiency
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl p-4" style={{
            background: innerCardBg
          }}>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: darkMode ? '#10B981' : '#059669' }} />
              <div>
                <h4 style={{ color: textPrimary }}>Trade Energy</h4>
                <p className="text-sm mt-1" style={{ color: darkMode ? textPrimary : '#000000' }}>
                  Buy and sell surplus energy with neighbors and the grid
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div 
        className="rounded-xl p-6"
        style={{ 
          background: cardBg
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full" style={{
            background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(59, 130, 246, 0.15)'
          }}>
            <Shield className="w-5 h-5" style={{ color: darkMode ? '#FFFFFF' : '#3b82f6' }} />
          </div>
          <h3 style={{ color: textPrimary }}>Privacy & Security</h3>
        </div>

        <div className="space-y-3">
          <p className="text-sm" style={{ color: darkMode ? textPrimary : '#000000' }}>
            <strong style={{ color: textPrimary }}>Data Protection:</strong> All your energy data is encrypted and stored securely. 
            We never share your personal information with third parties without your consent.
          </p>
          
          <p className="text-sm" style={{ color: darkMode ? textPrimary : '#000000' }}>
            <strong style={{ color: textPrimary }}>Account Security:</strong> We recommend enabling two-factor authentication 
            and using a strong, unique password for your account.
          </p>

          <p className="text-sm" style={{ color: darkMode ? textPrimary : '#000000' }}>
            <strong style={{ color: textPrimary }}>Trading Safety:</strong> All energy transactions are verified and processed 
            through our secure payment system. Review all details before confirming trades.
          </p>
        </div>
      </div>

      {/* Important Notes */}
      <div 
        className="rounded-xl p-6"
        style={{ 
          background: cardBg
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-full" style={{
            background: darkMode ? 'rgba(251, 146, 60, 0.2)' : 'rgba(251, 146, 60, 0.15)'
          }}>
            <AlertCircle className="w-5 h-5" style={{ color: darkMode ? '#fb923c' : '#ea580c' }} />
          </div>
          <h3 style={{ color: textPrimary }}>Important Notes</h3>
        </div>

        <div className="space-y-3 text-sm">
          <div className="rounded-xl p-4" style={{
            background: innerCardBg
          }}>
            <p style={{ color: darkMode ? textPrimary : '#000000' }}>
              <strong style={{ color: textPrimary }}>• System Compatibility:</strong> Ensure your solar/battery system 
              is compatible with our monitoring devices.
            </p>
          </div>

          <div className="rounded-xl p-4" style={{
            background: innerCardBg
          }}>
            <p style={{ color: darkMode ? textPrimary : '#000000' }}>
              <strong style={{ color: textPrimary }}>• Maintenance:</strong> Schedule regular system checks to maintain 
              optimal performance and warranty coverage.
            </p>
          </div>

          <div className="rounded-xl p-4" style={{
            background: innerCardBg
          }}>
            <p style={{ color: darkMode ? textPrimary : '#000000' }}>
              <strong style={{ color: textPrimary }}>• Market Rates:</strong> Energy trading prices fluctuate based on 
              demand, time of day, and grid conditions.
            </p>
          </div>
        </div>
      </div>

      {/* Legal */}
      <div 
        className="rounded-xl p-6"
        style={{ 
          background: cardBg
        }}
      >
        <h3 className="mb-3" style={{ color: textPrimary }}>Legal Information</h3>
        
        <p className="text-sm mb-3" style={{ color: textPrimary, opacity: 0.9 }}>
          By using this application, you agree to our Terms of Service and Privacy Policy. 
          This app is provided "as is" for energy management purposes.
        </p>

        <div className="space-y-2 text-xs">
          <p style={{ color: textPrimary, opacity: 0.7 }}>Version: 2.4.1</p>
          <p style={{ color: textPrimary, opacity: 0.7 }}>Last Updated: October 20, 2025</p>
          <p style={{ color: textPrimary, opacity: 0.7 }}>© 2025 Energy Manager. All rights reserved.</p>
        </div>
      </div>

      {/* Contact Support */}
      <button 
        className="w-full text-white py-4 rounded-xl transition-all hover:shadow-lg active:scale-95 flex items-center justify-center"
        style={{
          background: darkMode 
            ? '#10B981'
            : 'linear-gradient(to right, #0d9488, #84cc16)'
        }}
      >
        Contact Support
      </button>

      {/* Back to Settings Button */}
      {onBackToSettings && (
        <div className="flex justify-center" style={{ marginTop: '16px' }}>
          <button
            onClick={onBackToSettings}
            className="text-white px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{ 
              fontWeight: 'var(--font-weight-semibold)',
              background: 'linear-gradient(90deg, #0d9488 0%, #84cc16 100%)'
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Settings</span>
          </button>
        </div>
      )}
    </div>
  );
}
