import { ReactNode } from 'react';

interface MainCardProps {
  children: ReactNode;
  className?: string;
  darkMode?: boolean;
}

export function MainCard({ children, className = '', darkMode = false }: MainCardProps) {
  const cardBg = darkMode
    ? 'linear-gradient(90deg, rgba(42, 64, 53, 0.85), rgba(53, 90, 70, 0.85))'
    : 'linear-gradient(90deg, rgba(98, 191, 212, 0.4) 0%, rgba(241, 221, 118, 0.4) 100%)';

  return (
    <div 
      className={`rounded-xl p-6 glass-card card-shadow ${className}`}
      style={{
        background: cardBg,
        border: '1px solid rgba(255, 255, 255, 0.18)'
      }}
    >
      {children}
    </div>
  );
}
