import { User, Mail, Bell, FileText, LogOut, Moon, Sun, ChevronRight, ShieldAlert } from 'lucide-react';
import { Switch } from './ui/switch';
import { WalletCard } from './WalletCard';
import huaweiLogo from 'figma:asset/ac309d88f69a2e5cca127489023168a71fd25e4a.png';

interface SettingsPageProps {
  darkMode: boolean;
  onDarkModeToggle: (enabled: boolean) => void;
  onNavigateToGuidelines: () => void;
  notifications: boolean;
  onNotificationsToggle: (enabled: boolean) => void;
  emailAlerts: boolean;
  onEmailAlertsToggle: (enabled: boolean) => void;
  onOpenRecordsHistory: () => void;
  onGenerateRiskReport?: () => void;
}

export function SettingsPage({ 
  darkMode, 
  onDarkModeToggle,
  onNavigateToGuidelines,
  notifications,
  onNotificationsToggle,
  emailAlerts,
  onEmailAlertsToggle,
  onOpenRecordsHistory,
  onGenerateRiskReport
}: SettingsPageProps) {
  const name = 'John Anderson';
  const email = 'john.anderson@email.com';

  // Green Dark Mode Color System
  const largeBg = darkMode 
    ? 'linear-gradient(90deg, #2A4035, #355A46)'
    : 'linear-gradient(90deg, rgba(98, 191, 212, 0.4) 0%, rgba(241, 221, 118, 0.4) 100%)';
  
  const smallCardBg = darkMode ? '#2D4A3E' : '#FFFFFF';
  const textPrimary = darkMode ? '#FFFFFF' : 'var(--text-primary)';
  const textSecondary = darkMode ? 'rgba(255, 255, 255, 0.85)' : '#6B7280';
  const iconColor = darkMode ? '#FFFFFF' : '#0d9488';

  return (
    <div className={`flex flex-col gap-6 px-6 pt-8 ${darkMode ? 'dark-mode' : ''}`} style={{ paddingBottom: '96px' }}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl mb-3" style={{ 
          color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#333333',
          fontWeight: 'var(--font-weight-bold)',
          letterSpacing: '-0.01em',
          fontFamily: "'La Belle Aurore', cursive"
        }}>Luméa</h2>
        <h1 className="text-3xl" style={{ 
          color: textPrimary,
          fontWeight: 'var(--font-weight-bold)',
          letterSpacing: '-0.02em'
        }}>Settings</h1>
        <p className="mt-2 text-sm" style={{ 
          color: darkMode ? textSecondary : '#333333',
          fontWeight: 'var(--font-weight-light)',
          letterSpacing: '0.02em'
        }}>Manage your preferences</p>
      </div>

      {/* Wallet Card - New Top Section */}
      <WalletCard darkMode={darkMode} onOpenRecords={onOpenRecordsHistory} />

      {/* Theme Toggle */}
      <div 
        className="rounded-xl p-6 glass-card"
        style={{
          background: largeBg,
          opacity: darkMode ? 0.8 : 1,
          border: '1px solid rgba(255, 255, 255, 0.18)'
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full" style={{
              background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(234, 179, 8, 0.15)'
            }}>
              {darkMode ? (
                <Moon className="w-5 h-5" style={{ color: '#FFFFFF' }} />
              ) : (
                <Sun className="w-5 h-5" style={{ color: '#eab308' }} />
              )}
            </div>
            <div>
              <h3 style={{ 
                color: textPrimary,
                fontWeight: 'var(--font-weight-semibold)'
              }}>
                Dark Mode
              </h3>
              <p className="text-sm data-label" style={{ 
                color: textSecondary,
                fontWeight: 'var(--font-weight-light)'
              }}>
                Switch appearance
              </p>
            </div>
          </div>
          <button
            onClick={() => onDarkModeToggle(!darkMode)}
            className="px-6 py-2 rounded-full transition-all flex items-center justify-center"
            style={{
              background: darkMode ? '#10B981' : '#0d9488',
              color: '#FFFFFF'
            }}
          >
            {darkMode ? 'Light' : 'Dark'}
          </button>
        </div>

        <p className="text-sm" style={{ 
          color: textSecondary
        }}>
          Currently viewing in {darkMode ? 'dark' : 'light'} mode. Toggle to see the difference.
        </p>
      </div>

      {/* Profile Information */}
      <div 
        className="rounded-xl p-6 glass-card"
        style={{
          background: largeBg,
          opacity: darkMode ? 0.8 : 1,
          border: '1px solid rgba(255, 255, 255, 0.18)'
        }}
      >
        <h3 className="mb-4" style={{ color: textPrimary }}>Profile Information</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ 
            background: smallCardBg,
            opacity: darkMode ? 0.9 : 1
          }}>
            <User className="w-5 h-5" style={{ color: iconColor }} />
            <div className="flex-1">
              <p className="text-sm" style={{ 
                color: textSecondary
              }}>Name</p>
              <p style={{ color: textPrimary }}>{name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl" style={{ 
            background: smallCardBg,
            opacity: darkMode ? 0.9 : 1
          }}>
            <Mail className="w-5 h-5" style={{ color: iconColor }} />
            <div className="flex-1">
              <p className="text-sm" style={{ 
                color: textSecondary
              }}>Email</p>
              <p style={{ color: textPrimary }}>{email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div 
        className="rounded-xl p-6 glass-card"
        style={{
          background: largeBg,
          opacity: darkMode ? 0.8 : 1,
          border: '1px solid rgba(255, 255, 255, 0.18)'
        }}
      >
        <h3 className="mb-4" style={{ color: textPrimary }}>Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl" style={{ 
            background: smallCardBg,
            opacity: darkMode ? 0.9 : 1
          }}>
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5" style={{ color: iconColor }} />
              <div>
                <p style={{ color: textPrimary }}>Push Notifications</p>
                <p className="text-sm" style={{ 
                  color: textSecondary
                }}>
                  Receive alerts and updates
                </p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={onNotificationsToggle} />
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl" style={{ 
            background: smallCardBg,
            opacity: darkMode ? 0.9 : 1
          }}>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" style={{ color: iconColor }} />
              <div>
                <p style={{ color: textPrimary }}>Email Alerts</p>
                <p className="text-sm" style={{ 
                  color: textSecondary
                }}>
                  Get updates via email
                </p>
              </div>
            </div>
            <Switch checked={emailAlerts} onCheckedChange={onEmailAlertsToggle} />
          </div>
        </div>
      </div>

      {/* User Guidelines */}
      <button 
        onClick={onNavigateToGuidelines}
        className="rounded-xl p-6 text-left transition-all hover:shadow-lg active:scale-95 glass-card"
        style={{
          background: largeBg,
          opacity: darkMode ? 0.8 : 1,
          border: '1px solid rgba(255, 255, 255, 0.18)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full" style={{
              background: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(13, 148, 136, 0.1)'
            }}>
              <FileText className="w-5 h-5" style={{ color: iconColor }} />
            </div>
            <div>
              <h4 style={{ color: textPrimary }}>User Guidelines</h4>
              <p className="text-sm" style={{ 
                color: textSecondary
              }}>
                Terms, privacy & help
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5" style={{ color: textPrimary }} />
        </div>
      </button>

      {/* Generate Risk Report Button */}
      <button 
        onClick={onGenerateRiskReport}
        className="w-full py-5 rounded-xl flex items-center justify-center gap-3 transition-all hover:shadow-xl active:scale-98 group"
        style={{
          background: darkMode 
            ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' 
            : 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)',
          border: darkMode 
            ? '1.5px solid rgba(16, 185, 129, 0.4)' 
            : '1.5px solid rgba(13, 148, 136, 0.3)',
          color: '#FFFFFF',
          boxShadow: darkMode 
            ? '0 4px 16px rgba(16, 185, 129, 0.25)' 
            : '0 4px 16px rgba(13, 148, 136, 0.2)',
        }}
      >
        <ShieldAlert 
          className="w-5 h-5 transition-transform group-hover:scale-110" 
          style={{ strokeWidth: 2.5 }} 
        />
        <span style={{ 
          fontWeight: 'var(--font-weight-semibold)',
          letterSpacing: '0.01em',
          fontSize: '15px'
        }}>
          Generate Risk Report
        </span>
        <ChevronRight 
          className="w-5 h-5 transition-transform group-hover:translate-x-1" 
          style={{ strokeWidth: 2.5 }} 
        />
      </button>

      {/* Verification Certification */}
      <div 
        className="rounded-xl p-6 glass-card"
        style={{
          background: largeBg,
          opacity: darkMode ? 0.8 : 1,
          border: '1px solid rgba(255, 255, 255, 0.18)'
        }}
      >
        <div className="flex flex-col items-center text-center">
          <h3 className="mb-2" style={{ 
            color: textPrimary,
            fontWeight: 'var(--font-weight-semibold)',
            fontSize: '1.125rem'
          }}>
            Verification Certification
          </h3>
          
          <p className="text-sm mb-6" style={{ 
            color: textPrimary,
            fontWeight: 'var(--font-weight-normal)'
          }}>
            Verified by HUAWEI
          </p>

          <div className="flex items-center justify-center">
            <img 
              src={huaweiLogo} 
              alt="Huawei Logo" 
              style={{ 
                height: '50px',
                width: 'auto',
                objectFit: 'contain'
              }} 
            />
          </div>
        </div>
      </div>

      {/* System Info */}
      <div 
        className="rounded-xl p-6 glass-card"
        style={{
          background: largeBg,
          opacity: darkMode ? 0.8 : 1,
          border: '1px solid rgba(255, 255, 255, 0.18)'
        }}
      >
        <h3 className="mb-4" style={{ color: textPrimary }}>System Information</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm" style={{ 
              color: textSecondary
            }}>App Version</span>
            <span className="text-sm" style={{ color: textPrimary }}>2.4.1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm" style={{ 
              color: textSecondary
            }}>Last Updated</span>
            <span className="text-sm" style={{ color: textPrimary }}>Oct 20, 2025</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm" style={{ 
              color: textSecondary
            }}>System Status</span>
            <span className="text-sm" style={{ color: '#10B981' }}>All Good</span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button className="w-full py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg active:scale-95"
        style={{
          background: 'linear-gradient(to right, #ef4444, #f97316)',
          color: '#FFFFFF'
        }}
      >
        <LogOut className="w-5 h-5" />
        <span>Logout</span>
      </button>
    </div>
  );
}
