import { Calendar as CalendarIcon, Clock, X } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { useState } from 'react';

interface DatePickerModalProps {
  onClose: () => void;
  onConfirm: (date: Date, time: string, serviceType: string) => void;
  darkMode?: boolean;
}

export function DatePickerModal({ onClose, onConfirm, darkMode = false }: DatePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date(2025, 9, 25)); // Oct 25, 2025
  const [selectedTime, setSelectedTime] = useState('9:00 AM - 11:00 AM');
  const [serviceType, setServiceType] = useState('General Inspection');

  const handleConfirm = () => {
    if (selectedDate) {
      onConfirm(selectedDate, selectedTime, serviceType);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center px-6 z-50" style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
      <div 
        className="w-full rounded-xl relative flex flex-col"
        style={{
          maxWidth: '382px',
          maxHeight: 'calc(100vh - 48px)',
          background: darkMode ? 'rgba(45, 74, 62, 0.9)' : 'rgba(255, 250, 219, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          boxShadow: darkMode 
            ? '0 20px 60px rgba(0, 0, 0, 0.5)' 
            : '0 20px 60px rgba(0, 0, 0, 0.15)'
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Scrollable Content Area with bottom padding for footer */}
        <div className="flex-1 overflow-y-auto p-5 pb-24">
          <div className="flex flex-col gap-4 pt-2">
            {/* Modal Header */}
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full" style={{
                background: darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(0, 163, 152, 0.15)'
              }}>
                <CalendarIcon className="w-5 h-5" style={{ color: darkMode ? '#10B981' : 'var(--accent-success)' }} />
              </div>
              <h2 style={{ 
                color: darkMode ? '#FFFFFF' : 'var(--text-primary)',
                fontWeight: 'var(--font-weight-bold)'
              }}>Schedule Appointment</h2>
            </div>

            {/* Calendar - Hug Content */}
            <div className="rounded-xl p-3" style={{
              background: darkMode ? '#3A5C4A' : '#FFFFFF'
            }}>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md w-full"
              />
            </div>

            {/* Select Time */}
            <div>
              <label className="text-sm flex items-center gap-2 mb-2" style={{
                color: darkMode ? '#FFFFFF' : '#374151'
              }}>
                <Clock className="w-4 h-4" />
                Select Time
              </label>
              <select 
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{
                  background: darkMode ? '#3A5C4A' : '#FFFFFF',
                  borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : '#e5e7eb',
                  color: darkMode ? '#FFFFFF' : '#000000'
                }}
              >
                <option>9:00 AM - 11:00 AM</option>
                <option>11:00 AM - 1:00 PM</option>
                <option>1:00 PM - 3:00 PM</option>
                <option>3:00 PM - 5:00 PM</option>
              </select>
            </div>

            {/* Service Type */}
            <div>
              <label className="text-sm block mb-2" style={{
                color: darkMode ? '#FFFFFF' : '#374151'
              }}>Service Type</label>
              <select 
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 focus:outline-none text-sm"
                style={{
                  background: darkMode ? '#3A5C4A' : '#FFFFFF',
                  borderColor: darkMode ? 'rgba(255, 255, 255, 0.2)' : '#e5e7eb',
                  color: darkMode ? '#FFFFFF' : '#000000'
                }}
              >
                <option>General Inspection</option>
                <option>Solar Panel Cleaning</option>
                <option>Battery Calibration</option>
                <option>System Upgrade</option>
              </select>
            </div>

            {/* Appointment Summary */}
            <div className="rounded-xl p-3" style={{
              background: darkMode ? '#3A5C4A' : '#FFFFFF'
            }}>
              <p className="text-sm mb-2" style={{
                color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#6b7280'
              }}>Appointment Summary</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#6b7280' }}>Date:</span>
                  <span style={{ color: darkMode ? '#FFFFFF' : '#000000' }}>
                    {selectedDate?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Not selected'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#6b7280' }}>Time:</span>
                  <span style={{ color: darkMode ? '#FFFFFF' : '#000000' }}>{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#6b7280' }}>Service:</span>
                  <span style={{ color: darkMode ? '#FFFFFF' : '#000000' }}>{serviceType}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer with Bottom Constraints */}
        <div 
          className="absolute bottom-0 left-0 right-0 p-5 rounded-b-xl"
          style={{
            background: darkMode ? 'rgba(45, 74, 62, 0.9)' : 'rgba(255, 250, 219, 0.8)'
          }}
        >
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center"
              style={{
                background: darkMode ? '#3A5C4A' : '#e5e7eb',
                color: darkMode ? '#FFFFFF' : '#374151'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedDate}
              className="flex-1 text-white py-3 rounded-xl transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              style={{
                background: darkMode ? '#10B981' : 'linear-gradient(135deg, var(--accent-success) 0%, #84cc16 100%)',
                fontWeight: 'var(--font-weight-semibold)'
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
