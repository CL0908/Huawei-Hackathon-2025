import { ReactNode } from 'react';
import lightBgImage from 'figma:asset/a746b6e73cadcb72b20ab1b33c7fb3a61d0f3983.png';
import darkBgImage from 'figma:asset/2b3c9a64b5d1f268976ae52c69bf50099afeef34.png';

interface AppBackgroundProps {
  children: ReactNode;
  darkMode: boolean;
}

export function AppBackground({ children, darkMode }: AppBackgroundProps) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background Image Layer - Only for Light Mode */}
      {!darkMode && (
        <>
          <div 
            className="absolute inset-0 w-full h-full transition-opacity duration-500"
            style={{
              backgroundImage: `url(${lightBgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat',
              opacity: 0.5
            }}
          />
          {/* White Transparency Overlay - 40% */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              background: 'rgba(255, 255, 255, 0.4)'
            }}
          />
        </>
      )}
      
      {/* Background Image Layer for Dark Mode */}
      {darkMode && (
        <>
          {/* Dark Background Color */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              background: '#1E2A23'
            }}
          />
          {/* Dark Mode House Image - 80% Opacity */}
          <div 
            className="absolute inset-0 w-full h-full transition-opacity duration-500"
            style={{
              backgroundImage: `url(${darkBgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat',
              opacity: 0.8
            }}
          />
        </>
      )}
      
      {/* Content Layer */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
}
