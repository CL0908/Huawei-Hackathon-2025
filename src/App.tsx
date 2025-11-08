import { useState, useEffect } from 'react';
import { AppBackground } from './components/AppBackground';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './components/HomePage';
import { InsightsPage } from './components/InsightsPage';
import { TransactionPage } from './components/TransactionPage';
import { SettingsPage } from './components/SettingsPage';
import { UserGuidelinesPage } from './components/UserGuidelinesPage';
import { RecordsHistoryPage } from './components/RecordsHistoryPage';

export default function App() {
  const [activePage, setActivePage] = useState<'home' | 'insights' | 'transaction' | 'settings' | 'guidelines' | 'records'>('home');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  // Apply dark mode class to html element for global theme variables
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleNavigateToGuidelines = () => {
    setActivePage('guidelines');
  };

  const handleNavigateToRecords = () => {
    setActivePage('records');
  };

  const handleGenerateRiskReport = () => {
    // TODO: Navigate to detailed risk report/alerts view
    // This will reference the Security & Alerts logic from HomePage
    console.log('Generate Risk Report clicked');
  };

  return (
    <div className="min-h-screen">
      {/* Mobile Container - Fixed width for mobile design */}
      <div className="max-w-[430px] mx-auto min-h-screen relative">
        <AppBackground darkMode={darkMode}>
          {/* Content Area with scroll */}
          <div className="h-screen overflow-y-auto">
          {activePage === 'home' && <HomePage darkMode={darkMode} />}
          {activePage === 'insights' && <InsightsPage darkMode={darkMode} />}
          {activePage === 'transaction' && <TransactionPage darkMode={darkMode} />}
          {activePage === 'settings' && (
            <SettingsPage 
              darkMode={darkMode}
              onDarkModeToggle={setDarkMode}
              onNavigateToGuidelines={handleNavigateToGuidelines}
              notifications={notifications}
              onNotificationsToggle={setNotifications}
              emailAlerts={emailAlerts}
              onEmailAlertsToggle={setEmailAlerts}
              onOpenRecordsHistory={handleNavigateToRecords}
              onGenerateRiskReport={handleGenerateRiskReport}
            />
          )}
          {activePage === 'guidelines' && (
            <UserGuidelinesPage 
              darkMode={darkMode} 
              onBackToSettings={() => setActivePage('settings')}
            />
          )}
          {activePage === 'records' && (
            <RecordsHistoryPage
              darkMode={darkMode}
              onBack={() => setActivePage('settings')}
            />
          )}
          </div>

          {/* Bottom Navigation - Only show on main pages, not on guidelines or records */}
          {activePage !== 'guidelines' && activePage !== 'records' && (
            <BottomNav activePage={activePage} onNavigate={setActivePage} />
          )}
        </AppBackground>
      </div>
    </div>
  );
}
