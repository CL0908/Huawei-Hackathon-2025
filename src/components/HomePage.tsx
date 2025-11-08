import { useState } from 'react';
import { GaugeDial } from './GaugeDial';
import { StatusCard } from './StatusCard';
import { NextScheduleCard } from './NextScheduleCard';
import { DatePickerModal } from './DatePickerModal';
import { NotificationModal } from './NotificationModal';
import { ForecastNavigationCard } from './ForecastNavigationCard';
import { CommunityMap } from './CommunityMap';
// import { SecurityAlertsCarousel } from './SecurityAlertsCarousel';
import { CommunityDataCard } from './CommunityDataCard';
import { SolarMapPreview } from './SolarMapPreview';  
import { SolarExplorer } from './SolarExplorer';  
import { Zap, Leaf, DollarSign, Battery, TrendingUp } from 'lucide-react';
import { useThemeStyles } from './useThemeStyles';

interface HomePageProps {
  darkMode?: boolean;
  onNavigate?: (page: 'forecast' | 'maintenance') => void;
}

export function HomePage({ darkMode = false }: HomePageProps) {
  const { cardBg } = useThemeStyles(darkMode);
  const textPrimary = darkMode ? '#FFFFFF' : 'var(--text-primary)';
  const textSecondary = darkMode ? '#FFFFFF' : 'var(--text-secondary)';
  
  const [showScheduler, setShowScheduler] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<number | null>(null);
  const [showSolarExplorer, setShowSolarExplorer] = useState(false); 
  
  // Simulated backend data - this should come from your backend API
  const solarData = {
    batteryLevel: 4.2,          // Current battery level in kWh (from backend)
    percentage: 70,             // Battery percentage 0-100 (from backend)
    status: 'Charging',         // Status text: 'Charging', 'Idle', 'Discharging' (from backend)
    showSun: true,              // Show/hide sun icon based on solar panel activity (from backend)
    isCharging: true,           // true = charging, false = not charging (affects colors) (from backend)
    gradientColors: {           // Customize gradient colors (from backend or theme)
      start: '#FCD34D',         // Yellow - solar charging
      middle: '#FDE68A',        // Light yellow
      end: '#86EFAC'            // Green - full charge
    }
  };

  // Battery data for community section
  const batteryData = {
    currentLevel: 8.5,
    maxCapacity: 13.5,
  };

  const handleBookAppointment = () => {
    setShowScheduler(true);
  };

  const handleScheduleConfirm = () => {
    setShowScheduler(false);
    setShowNotification(true);
  };

    const handleSolarExplore = () => {
    setShowSolarExplorer(true);
  };

  const handleSolarExplorerBack = () => {
    setShowSolarExplorer(false);
  };

  if (showSolarExplorer) {
    return (
      <SolarExplorer 
        darkMode={darkMode} 
        onBack={handleSolarExplorerBack}
      />
    );
  }
  
  return (
    <>
      <div className="flex flex-col gap-6" style={{ paddingBottom: '96px' }}>
        {/* ==================== ZONE 1: AT A GLANCE ==================== */}
        
        {/* Header */}
        <div className="px-6 pt-8 text-center">
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
          }}>Welcome Home</h1>
          <p className="mt-2 text-sm" style={{ 
            color: darkMode ? 'rgba(255, 255, 255, 0.7)' : '#000000',
            fontWeight: 'var(--font-weight-light)',
            letterSpacing: '0.02em'
          }}>QuIEP Energy Trading, Quantum Control</p>
        </div>

        {/* Security & Alerts Carousel
        <div className="pt-4">
          <SecurityAlertsCarousel 
            darkMode={darkMode}
            onAlertClick={(alertId) => setSelectedAlert(alertId)}
          />
        </div> */}

        {/* Gauge Dial */}
        <div className="px-6 pt-12">
          <div className="relative flex items-center justify-center">
            <GaugeDial 
              value={solarData.batteryLevel.toString()} 
              percentage={solarData.percentage} 
              darkMode={darkMode} 
              status={solarData.status}
              showSun={solarData.showSun}
              isCharging={solarData.isCharging}
              gradientColors={solarData.gradientColors}
            />
          </div>
        </div>

        {/* Status Cards Grid */}
        <div className="px-6 grid grid-cols-3 gap-3">
          <StatusCard
            icon={Zap}
            value="32.1"
            label="Power Usage"
            trend="+5%"
            darkMode={darkMode}
            accent={true}
          />
          <StatusCard
            icon={Leaf}
            value="18.5"
            label="CO2 Saved"
            darkMode={darkMode}
          />
          <StatusCard
            icon={DollarSign}
            value="120 CO₂"
            label="Revenue"
            trend="+12%"
            darkMode={darkMode}
            accent={true}
          />
        </div>

        {/* ==================== ZONE 2: PLANNING & FORECAST ==================== */}
        
        {/* Section Title */}
        <div className="px-6 pt-4">
          <h2 className="text-xl mb-1" style={{ 
            color: darkMode ? '#FFFFFF' : '#000000',
            fontWeight: 'var(--font-weight-bold)',
            letterSpacing: '-0.01em'
          }}>Planning & Forecast</h2>
          <p className="text-sm" style={{ 
            color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            fontWeight: 'var(--font-weight-light)'
          }}>Navigate your energy outlook</p>
        </div>

        {/* Forecast Navigation Card */}
        <div className="px-6">
          <ForecastNavigationCard darkMode={darkMode} />
        </div>

        {/* ==================== ZONE 3: COMMUNITY & MARKET ==================== */}
        
        <div className="px-6 pt-4">
          <h2 className="text-xl mb-1" style={{ 
            color: darkMode ? '#FFFFFF' : '#000000',
            fontWeight: 'var(--font-weight-bold)',
            letterSpacing: '-0.01em'
          }}>Community & Market</h2>
          <p className="text-sm" style={{ 
            color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            fontWeight: 'var(--font-weight-light)'
          }}>Your local energy network</p>
        </div>

        {/* 🔥 REPLACED: Community Map with Solar Map Preview */}
        <div className="px-6">
          <SolarMapPreview 
            darkMode={darkMode}
            onExploreClick={handleSolarExplore}
          />
        </div>

        {/* Community Data Cards */}
        <div className="px-6 grid grid-cols-2 gap-3">
          <CommunityDataCard
            icon={Battery}
            label="Your Battery"
            value={`${batteryData.currentLevel} / ${batteryData.maxCapacity}`}
            subtitle="kWh available"
            darkMode={darkMode}
            color={darkMode ? '#6BA3E8' : '#3B82F6'}
          />
          <CommunityDataCard
            icon={TrendingUp}
            label="Community Price"
            value="8 CO₂"
            subtitle="per kWh"
            darkMode={darkMode}
            color={darkMode ? '#5FC3A2' : '#10B981'}
          />
        </div>

        {/* ==================== ZONE 4: MAINTENANCE ==================== */}
        
        {/* Section Title */}
        <div className="px-6 pt-4">
          <h2 className="text-xl mb-1" style={{ 
            color: darkMode ? '#FFFFFF' : '#000000',
            fontWeight: 'var(--font-weight-bold)',
            letterSpacing: '-0.01em'
          }}>Maintenance</h2>
          <p className="text-sm" style={{ 
            color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            fontWeight: 'var(--font-weight-light)'
          }}>Keep your system running smoothly</p>
        </div>

        {/* Next Schedule Card */}
        <div className="px-6">
          <NextScheduleCard 
            darkMode={darkMode}
            daysUntil={14}
            onBookAppointment={handleBookAppointment}
          />
        </div>
      </div>

      {/* Modals */}
      {showScheduler && (
        <DatePickerModal
          onClose={() => setShowScheduler(false)}
          onConfirm={handleScheduleConfirm}
          darkMode={darkMode}
        />
      )}

      {showNotification && (
        <NotificationModal
          message="You have successfully scheduled your technician!"
          onClose={() => setShowNotification(false)}
          darkMode={darkMode}
        />
      )}

      {showSolarExplorer && (
        <SolarExplorer darkMode={darkMode} onClose={() => setShowSolarExplorer(false)} />
      )}
    </>
  );
}
