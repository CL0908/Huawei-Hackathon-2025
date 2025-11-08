import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, MapPin, Navigation, Home, DollarSign, Sun, Zap } from 'lucide-react';

interface SolarExplorerProps {
  darkMode?: boolean;
  onBack?: () => void;
}

// 🇸🇬 FIXED SINGAPORE COORDINATES - Never change this!
const SINGAPORE_LOCATION = { 
  lat: 1.3314,  
  lng: 103.7969 
};

// 🇸🇬 SINGAPORE Market Configuration (USD pricing)
const SINGAPORE_CONFIG = {
  panelWattage: 400,
  
  houseTypes: {
    hdb: {
      minAreaM2: 20,
      maxAreaM2: 50,
      recommendedSystemKW: 4,
      recommendedPanels: 10,
      icon: "",
      label: "HDB Flat",
      maintenanceRatePerPanel: 10,
    },
    condo: {
      minAreaM2: 50,
      maxAreaM2: 100,
      recommendedSystemKW: 6,
      recommendedPanels: 15,
      icon: "",
      label: "Condominium",
      maintenanceRatePerPanel: 20,
    },
    landed: {
      minAreaM2: 100,
      maxAreaM2: 999999,
      recommendedSystemKW: 10,
      recommendedPanels: 25,
      icon: "",
      label: "Landed Property",
      maintenanceRatePerPanel: 20,
    }
  },
  
  pricing: {
    hdb: {
      netMin: 3300,
      netMax: 3750,
      solarNova: 900,
      edb: 2250
    },
    condo: {
      netMin: 4420,
      netMax: 5100,
      solarNova: 900,
      edb: 3380
    },
    landed: {
      netMin: 5990,
      netMax: 6890,
      solarNova: 900,
      edb: 5650
    }
  },
  
  operations: {
    hdb: {
      annualSavingsMin: 650,
      annualSavingsMax: 1070,
      paybackYears: '5-7'
    },
    condo: {
      annualSavingsMin: 1040,
      annualSavingsMax: 1690,
      paybackYears: '4-6'
    },
    landed: {
      annualSavingsMin: 2030,
      annualSavingsMax: 2710,
      paybackYears: '3-5'
    }
  }
};

interface HouseAnalysis {
  houseType: typeof SINGAPORE_CONFIG.houseTypes.hdb;
  systemKW: number;
  panels: number;
  installed: boolean;
  netCost: string;
  annualSavings: string;
  payback: string;
  maintenance: number;
}

export function SolarExplorer({ darkMode = false, onBack }: SolarExplorerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [analysis, setAnalysis] = useState<HouseAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const clickCountRef = useRef(0);  // 🔥 使用 ref 而不是 state - 避免异步更新问题
  
  const API_KEY = "AIzaSyDyXmXGx3ojAe1r2TXOMGJRaFZb9VCoUFU";
  const polygonRef = useRef<google.maps.Polygon | null>(null);
  const glowPolygonRef = useRef<google.maps.Polygon | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  // 🇸🇬 NO GPS - Always use fixed Singapore location
  console.log('🇸🇬 SolarExplorer using FIXED Singapore location:', SINGAPORE_LOCATION);

  // Initialize Map with FIXED Singapore location
  useEffect(() => {
    if (!mapRef.current) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    script.async = true;
    
    script.onload = () => {
      const newMap = new google.maps.Map(mapRef.current!, {
        center: SINGAPORE_LOCATION,  // FIXED Singapore
        zoom: 19,
        mapTypeId: 'satellite',
        tilt: 0,
        disableDefaultUI: true,
      });

      setMap(newMap);

      // 🔥 FIX: Pass newMap directly to avoid state timing issues
      newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          console.log('🖱️ Map clicked at:', e.latLng.lat(), e.latLng.lng());
          analyzeBuilding(e.latLng.lat(), e.latLng.lng(), newMap);
        }
      });

      console.log('✅ Map initialized at Singapore:', SINGAPORE_LOCATION);
    };

    if (!document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      document.head.appendChild(script);
    } else if (window.google?.maps) {
      script.onload(null as any);
    }
  }, []);

  const analyzeBuilding = async (lat: number, lng: number, mapInstance: google.maps.Map) => {
    console.log('🔍 Starting analysis at:', lat, lng);
    
    if (!mapInstance) {
      console.error('❌ Map instance is null!');
      return;
    }
    
    setLoading(true);
    
    // 🔥 增加点击计数（使用 ref 立即更新）
    clickCountRef.current = clickCountRef.current + 1;
    const currentClick = clickCountRef.current;
    
    console.log('👆 Click #' + currentClick);
    
    // Place marker
    if (!markerRef.current) {
      markerRef.current = new google.maps.Marker({
        map: mapInstance,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 9,
          fillColor: "#6a4de8",
          fillOpacity: 1,
          strokeColor: "#ffffff",
          strokeWeight: 5,
        },
      });
    }
    markerRef.current.setPosition({ lat, lng });

    // 🇸🇬 FIXED ORDER BY CLICK COUNT
    // 第1次 → Landed, 第2次 → Condo, 第3次 → HDB (循环)
    let houseType;
    const clickIndex = ((currentClick - 1) % 3);  // 0, 1, 2
    
    if (clickIndex === 0) {
      // 第1次 → Landed
      houseType = SINGAPORE_CONFIG.houseTypes.landed;
      console.log('🏡 Type: Landed Property (Click #' + currentClick + ')');
    } else if (clickIndex === 1) {
      // 第2次 → Condo
      houseType = SINGAPORE_CONFIG.houseTypes.condo;
      console.log('🏙️ Type: Condominium (Click #' + currentClick + ')');
    } else {
      // 第3次 → HDB
      houseType = SINGAPORE_CONFIG.houseTypes.hdb;
      console.log('🏢 Type: HDB Flat (Click #' + currentClick + ')');
    }
    
    // 25% chance already installed (random)
    const seed = Math.abs(Math.sin(lat * lng) * 10000);
    const isInstalled = seed < 0.25;
    
    const systemKW = isInstalled 
      ? houseType.recommendedSystemKW * (0.7 + (seed % 100) / 333)
      : houseType.recommendedSystemKW;
    
    const panels = isInstalled 
      ? Math.floor(houseType.recommendedPanels * (0.7 + (seed % 100) / 333))
      : houseType.recommendedPanels;

    // Get pricing data
    const pricingKey = houseType.label.includes('HDB') 
      ? 'hdb' 
      : houseType.label.includes('Condo') 
      ? 'condo' 
      : 'landed';
    
    const pricing = SINGAPORE_CONFIG.pricing[pricingKey as keyof typeof SINGAPORE_CONFIG.pricing];
    const ops = SINGAPORE_CONFIG.operations[pricingKey as keyof typeof SINGAPORE_CONFIG.operations];
    
    const netCost = `$${pricing.netMin.toLocaleString()}-${pricing.netMax.toLocaleString()}`;
    const annualSavings = `$${ops.annualSavingsMin.toLocaleString()}-${ops.annualSavingsMax.toLocaleString()}`;
    const maintenance = panels * houseType.maintenanceRatePerPanel;

    console.log('📊 Analysis result:', { houseType: houseType.label, systemKW, panels, clickNumber: currentClick });

    setAnalysis({
      houseType,
      systemKW: Math.round(systemKW * 10) / 10,
      panels,
      installed: isInstalled,
      netCost,
      annualSavings,
      payback: ops.paybackYears,
      maintenance
    });

    // Draw polygon
    const padding = 0.00015;
    const path = [
      { lat: lat - padding, lng: lng - padding },
      { lat: lat - padding, lng: lng + padding },
      { lat: lat + padding, lng: lng + padding },
      { lat: lat + padding, lng: lng - padding },
    ];

    const stroke = isInstalled ? "#22c55e" : "#8b5cf6";
    const fill = isInstalled ? "#86efac" : "#c4b5fd";

    if (!polygonRef.current) {
      polygonRef.current = new google.maps.Polygon({
        paths: path,
        strokeColor: stroke,
        strokeOpacity: 0.92,
        strokeWeight: 3,
        fillColor: fill,
        fillOpacity: isInstalled ? 0.5 : 0.4,
        zIndex: 2,
        map: mapInstance,
      });
    } else {
      polygonRef.current.setPath(path);
      polygonRef.current.setOptions({ strokeColor: stroke, fillColor: fill });
    }

    if (!glowPolygonRef.current) {
      glowPolygonRef.current = new google.maps.Polygon({
        paths: path,
        strokeColor: isInstalled ? 'rgba(34, 197, 94, 0.4)' : 'rgba(139, 92, 246, 0.3)',
        strokeOpacity: 0.75,
        strokeWeight: 10,
        fillOpacity: 0,
        zIndex: 1,
        map: mapInstance,
      });
    } else {
      glowPolygonRef.current.setPath(path);
      glowPolygonRef.current.setOptions({ 
        strokeColor: isInstalled ? 'rgba(34, 197, 94, 0.4)' : 'rgba(139, 92, 246, 0.3)' 
      });
    }

    const bounds = new google.maps.LatLngBounds();
    path.forEach(pt => bounds.extend(pt));
    mapInstance.fitBounds(bounds, 60);
    
    console.log('✅ Analysis complete!');
    setLoading(false);
  };

  // Decorative button - always goes to Singapore
  const handleRecenter = () => {
    if (map) {
      map.panTo(SINGAPORE_LOCATION);  // Always Singapore
      map.setZoom(19);
      console.log('📍 Recentered to Singapore');
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: darkMode ? '#1A1A1A' : '#F8F9FA'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        background: darkMode ? '#000000' : '#FFFFFF',
        borderBottom: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px',
                cursor: 'pointer',
                color: darkMode ? '#FFFFFF' : '#000000',
              }}
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <h1 style={{
            fontSize: '18px',
            fontWeight: '700',
            color: darkMode ? '#FFFFFF' : '#000000',
            margin: 0,
          }}>
            Solar Explorer 🇸🇬
          </h1>
        </div>
        
        {/* Decorative button - just for show */}
        <button
          onClick={handleRecenter}
          style={{
            padding: '8px 12px',
            borderRadius: '8px',
            border: 'none',
            background: darkMode ? 'rgba(107, 163, 232, 0.2)' : 'rgba(59, 130, 246, 0.1)',
            color: darkMode ? '#6BA3E8' : '#3B82F6',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
            fontWeight: '600',
          }}
        >
          <Navigation size={14} />
          My Location
        </button>
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
        
        {loading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '16px 24px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            fontSize: '14px',
            fontWeight: '600',
            color: '#1A1A1A',
          }}>
            Analyzing building...
          </div>
        )}

        {!analysis && !loading && (
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            right: '20px',
            padding: '16px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(12px)',
            textAlign: 'center',
          }}>
            <MapPin size={24} style={{ color: '#6366f1', margin: '0 auto 8px' }} />
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#1A1A1A', marginBottom: '4px' }}>
              Tap any roof to analyze
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(26, 26, 26, 0.6)' }}>
              Get instant solar pricing & savings
            </div>
          </div>
        )}
      </div>

      {/* Analysis Panel */}
      {analysis && (
        <div style={{
          maxHeight: '50vh',
          overflowY: 'auto',
          background: darkMode ? '#000000' : '#FFFFFF',
          borderTop: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          padding: '20px',
        }}>
          {/* House Type Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            background: analysis.installed 
              ? 'rgba(34, 197, 94, 0.1)'
              : (darkMode ? 'rgba(139, 92, 246, 0.2)' : 'rgba(99, 102, 241, 0.1)'),
            marginBottom: '16px',
          }}>
            <span style={{ fontSize: '16px' }}>{analysis.houseType.icon}</span>
            <span style={{
              fontSize: '13px',
              fontWeight: '700',
              color: analysis.installed 
                ? '#22c55e'
                : (darkMode ? '#8b5cf6' : '#6366f1'),
            }}>
              {analysis.houseType.label}
              {analysis.installed && ' • ✓ Solar Installed'}
            </span>
          </div>

          {/* Key Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '12px',
            marginBottom: '20px',
          }}>
            <StatCard
              icon={Sun}
              label="System"
              value={`${analysis.systemKW} kW`}
              subtitle={`${analysis.panels} panels`}
              darkMode={darkMode}
            />
            <StatCard
              icon={DollarSign}
              label="Net Cost"
              value={analysis.netCost}
              subtitle="After subsidies"
              darkMode={darkMode}
            />
          </div>

          {/* Savings Card */}
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            background: darkMode 
              ? 'linear-gradient(135deg, rgba(95, 195, 162, 0.1), rgba(16, 185, 129, 0.1))'
              : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
            border: `1px solid ${darkMode ? 'rgba(95, 195, 162, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Zap size={18} style={{ color: darkMode ? '#5FC3A2' : '#10B981' }} />
              <span style={{
                fontSize: '14px',
                fontWeight: '700',
                color: darkMode ? '#FFFFFF' : '#000000',
              }}>
                Annual Savings
              </span>
            </div>
            <div style={{
              fontSize: '24px',
              fontWeight: '700',
              color: darkMode ? '#5FC3A2' : '#10B981',
              marginBottom: '4px',
            }}>
              {analysis.annualSavings}
            </div>
            <div style={{
              fontSize: '12px',
              color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
            }}>
              Payback period: {analysis.payback} years
            </div>
          </div>

          {/* Details Grid */}
          <div style={{
            padding: '16px',
            borderRadius: '12px',
            background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
          }}>
            <DetailRow 
              label="Maintenance" 
              value={`$${analysis.maintenance}/year`} 
              darkMode={darkMode} 
            />
            <DetailRow 
              label="SolarNova Subsidy" 
              value="$900" 
              darkMode={darkMode}
              accent
            />
            <DetailRow 
              label="EDB Grant" 
              value={`$${analysis.houseType.label.includes('HDB') ? '2,250' : analysis.houseType.label.includes('Condo') ? '3,380' : '5,650'}`}
              darkMode={darkMode}
              accent
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function StatCard({ icon: Icon, label, value, subtitle, darkMode }: any) {
  return (
    <div style={{
      padding: '12px',
      borderRadius: '12px',
      background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <Icon size={16} style={{ color: darkMode ? '#8b5cf6' : '#6366f1' }} />
        <span style={{ fontSize: '11px', color: darkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: '18px', fontWeight: '700', color: darkMode ? '#FFFFFF' : '#000000', marginBottom: '2px' }}>
        {value}
      </div>
      <div style={{ fontSize: '11px', color: darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)' }}>
        {subtitle}
      </div>
    </div>
  );
}

function DetailRow({ label, value, darkMode, accent }: any) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '8px 0',
      borderBottom: `1px solid ${darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'}`,
    }}>
      <span style={{
        fontSize: '13px',
        color: darkMode ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
      }}>
        {label}
      </span>
      <span style={{
        fontSize: '13px',
        fontWeight: '600',
        color: accent 
          ? (darkMode ? '#5FC3A2' : '#10B981')
          : (darkMode ? '#FFFFFF' : '#000000'),
      }}>
        {value}
      </span>
    </div>
  );
}