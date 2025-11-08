import { MainCard } from './MainCard';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface MaintenanceInfoCardProps {
  title: string;
  lastCheck: string;
  technicianName: string;
  status: 'good' | 'warning';
  darkMode?: boolean;
}

export function MaintenanceInfoCard({
  title,
  lastCheck,
  technicianName,
  status,
  darkMode = false,
}: MaintenanceInfoCardProps) {
  const StatusIcon = status === 'good' ? CheckCircle2 : AlertCircle;
  const statusColor = status === 'good' ? 'var(--accent-success)' : 'var(--accent-warning)';
  const statusBg = status === 'good' 
    ? (darkMode ? 'rgba(57, 255, 218, 0.15)' : 'rgba(0, 163, 152, 0.1)')
    : (darkMode ? 'rgba(0, 204, 255, 0.15)' : 'rgba(255, 112, 67, 0.1)');

  return (
    <MainCard darkMode={darkMode}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <h3 style={{ color: 'var(--text-primary)' }}>{title}</h3>
          <div className="p-2 rounded-full" style={{ background: statusBg }}>
            <StatusIcon className="w-5 h-5" style={{ color: statusColor }} />
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Last Check</span>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{lastCheck}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Technician</span>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{technicianName}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Status</span>
            <span className="text-sm" style={{ 
              color: statusColor,
              fontWeight: 'var(--font-weight-semibold)'
            }}>
              {status === 'good' ? 'All Good' : 'Needs Attention'}
            </span>
          </div>
        </div>
      </div>
    </MainCard>
  );
}
