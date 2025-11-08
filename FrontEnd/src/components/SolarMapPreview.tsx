import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Zap } from 'lucide-react';

interface SolarMapPreviewProps {
  darkMode?: boolean;
  onExploreClick?: () => void;
}

const generateHousesAroundUser = (userLat: number, userLng: number) => [
  { 
    id: 1, 
    type: 'hdb',
    lat: userLat + 0.0015,
    lng: userLng - 0.0010,
    price: '$3,200',
    systemKW: 4,
    panels: 10,
    installed: false
  },
  { 
    id: 2, 
    type: 'condo',
    lat: userLat + 0.0010,
    lng: userLng + 0.0015,
    price: '$4,300',
    systemKW: 6,
    panels: 15,
    installed: true 
  },
  { 
    id: 3, 
    type: 'hdb',
    lat: userLat - 0.0010,
    lng: userLng + 0.0020,
    price: '$3,700',
    systemKW: 4,
    panels: 10,
    installed: false
  },
  { 
    id: 4, 
    type: 'landed',
    lat: userLat + 0.0020,
    lng: userLng - 0.0015,
    price: '$5,000',
    systemKW: 10,
    panels: 25,
    installed: false
  },
  { 
    id: 5, 
    type: 'hdb',
    lat: userLat - 0.0015,
    lng: userLng - 0.0012,
    price: '$3,400',
    systemKW: 4,
    panels: 10,
    installed: false
  },
];

type HouseType = ReturnType<typeof generateHousesAroundUser>[0];

const SINGAPORE_LOCATION = { 
  lat: 1.3883,   
  lng: 103.8680  
};

export function SolarMapPreview({ darkMode = false, onExploreClick }: SolarMapPreviewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<HouseType | null>(null);
  
  const API_KEY = " ";
  const markersRef = useRef<google.maps.Marker[]>([]);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);

  console.log('🇸🇬 Using FIXED Singapore location:', SINGAPORE_LOCATION);

  useEffect(() => {
    if (!mapRef.current) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      const newMap = new google.maps.Map(mapRef.current!, {
        center: SINGAPORE_LOCATION,  
        zoom: 16,
        mapTypeId: 'satellite',
        tilt: 0,
        disableDefaultUI: true,
      });

      setMap(newMap);
      const houses = generateHousesAroundUser(SINGAPORE_LOCATION.lat, SINGAPORE_LOCATION.lng);

      houses.forEach(house => {
        const marker = new google.maps.Marker({
          position: { lat: house.lat, lng: house.lng },
          map: newMap,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: house.installed ? 20 : 16,
            fillColor: house.installed 
              ? '#22c55e'  
              : (darkMode ? '#8b5cf6' : '#6366f1'),  
            fillOpacity: 0.9,
            strokeColor: '#ffffff',
            strokeWeight: house.installed ? 4 : 3,
          },
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 8px 12px; color: #000; font-weight: 600; font-size: 12px; text-align: center;">
              ${house.installed ? '<div style="color: #22c55e; margin-bottom: 4px;">✓ Solar Installed</div>' : ''}
              <div style="font-size: 14px; margin-bottom: 4px;">${house.price} USD</div>
              <div style="font-size: 10px; color: #666;">${house.systemKW} kW • ${house.panels} panels</div>
            </div>
          `,
        });

        marker.addListener('click', () => {
          setSelectedHouse(house);
          markersRef.current.forEach(m => {
            const iw = m.get('infoWindow');
            if (iw) iw.close();
          });
          infoWindow.open(newMap, marker);
        });

        marker.set('infoWindow', infoWindow);
        markersRef.current.push(marker);
      });

      userMarkerRef.current = new google.maps.Marker({
        position: SINGAPORE_LOCATION,  
        map: newMap,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 22,
          fillColor: darkMode ? '#6BA3E8' : '#3B82F6',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 5,
        },
        label: {
          text: 'You',
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: 'bold',
        },
        zIndex: 999,
      });

      console.log('✅ Map initialized at Singapore:', SINGAPORE_LOCATION);
    };

    if (!document.querySelector(`script[src*="maps.googleapis.com"]`)) {
      document.head.appendChild(script);
    } else if (window.google?.maps) {
      script.onload(null as any);
    }

    return () => {
      markersRef.current.forEach(m => m.setMap(null));
      markersRef.current = [];
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }
    };
  }, [darkMode]);

  const handleRecenter = () => {
    if (map) {
      map.panTo(SINGAPORE_LOCATION);  
      map.setZoom(16);
      console.log('📍 Recentered to Singapore');
    }
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: darkMode
          ? 'linear-gradient(90deg, rgba(42, 64, 53, 0.8), rgba(53, 90, 70, 0.8))'
          : 'linear-gradient(90deg, rgba(98, 191, 212, 0.4) 0%, rgba(241, 221, 118, 0.4) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '16px 20px',
          background: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.5)',
          borderBottom: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin
              className="w-5 h-5"
              style={{ color: darkMode ? '#5FC3A2' : '#10B981' }}
            />
            <h3
              style={{
                fontSize: '16px',
                fontWeight: 'var(--font-weight-bold)',
                color: darkMode ? '#FFFFFF' : '#000000',
                margin: 0,
              }}
            >
              Solar Map 
            </h3>
          </div>
          
          {/* Decorative button - just for show */}
          <button
            onClick={handleRecenter}
            style={{
              padding: '6px 10px',
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
        <p
          style={{
            fontSize: '12px',
            color: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
            margin: 0,
          }}
        >
          Click any roof to explore pricing
        </p>
      </div>

      {/* Map Container */}
      <div style={{ position: 'relative', height: '220px', width: '100%' }}>
        <div 
          ref={mapRef} 
          style={{ 
            width: '100%',
            height: '100%',
          }} 
        />
      </div>

      {/* Explore Button */}
      <div
        style={{
          padding: '12px 16px',
          background: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.5)',
          borderTop: `1px solid ${darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.06)'}`,
        }}
      >
        <button
          onClick={onExploreClick}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '10px',
            border: 'none',
            background: darkMode 
              ? 'linear-gradient(135deg, #5FC3A2, #10B981)'
              : 'linear-gradient(135deg, #10B981, #059669)',
            color: '#FFFFFF',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            transition: 'transform 0.2s ease',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'scale(0.98)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <Zap size={18} />
          Explore Full Solar Map
        </button>
        
        {selectedHouse && (
          <div
            style={{
              marginTop: '8px',
              padding: '8px 12px',
              borderRadius: '8px',
              background: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.7)',
              fontSize: '11px',
              color: darkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              textAlign: 'center',
            }}
          >
            Selected: {selectedHouse.price} • {selectedHouse.systemKW} kW • {selectedHouse.panels} panels
          </div>
        )}
      </div>
    </div>
  );
}
