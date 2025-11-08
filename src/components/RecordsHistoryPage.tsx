import { ArrowUpRight, ArrowDownRight, ChevronLeft } from 'lucide-react';

interface RecordsHistoryPageProps {
  darkMode?: boolean;
  onBack: () => void;
}

const recentTransactions = [
  { id: 1, type: 'export', amount: '+62 CO₂', time: '10:30 AM', kWh: '15.2 kWh' },
  { id: 2, type: 'import', amount: '-41 CO₂', time: '07:15 AM', kWh: '10.5 kWh' },
  { id: 3, type: 'export', amount: '+91 CO₂', time: 'Yesterday', kWh: '22.8 kWh' },
  { id: 4, type: 'import', amount: '-27 CO₂', time: 'Yesterday', kWh: '6.8 kWh' },
  { id: 5, type: 'export', amount: '+74 CO₂', time: 'Oct 18', kWh: '18.5 kWh' },
  { id: 6, type: 'export', amount: '+110 CO₂', time: 'Oct 17', kWh: '27.6 kWh' },
  { id: 7, type: 'import', amount: '-34 CO₂', time: 'Oct 16', kWh: '8.6 kWh' },
  { id: 8, type: 'export', amount: '+82 CO₂', time: 'Oct 15', kWh: '20.5 kWh' },
];

export function RecordsHistoryPage({ darkMode = false, onBack }: RecordsHistoryPageProps) {
  const cardBg = darkMode
    ? 'linear-gradient(90deg, rgba(42, 64, 53, 0.95), rgba(53, 90, 70, 0.95))'
    : 'linear-gradient(90deg, rgba(98, 191, 212, 0.7) 0%, rgba(241, 221, 118, 0.7) 100%)';

  return (
    <div className="flex flex-col gap-6 pb-24 px-6 pt-8">
      {/* Header with Back Button */}
      <div className="flex items-center justify-center gap-4 relative">
        <button
          onClick={onBack}
          className="absolute left-0 p-2 rounded-full transition-all hover:opacity-80 active:scale-95"
          style={{
            background: darkMode
              ? 'rgba(255, 255, 255, 0.1)'
              : 'rgba(0, 0, 0, 0.05)',
          }}
        >
          <ChevronLeft
            className="w-6 h-6"
            style={{ color: darkMode ? '#FFFFFF' : '#000000' }}
          />
        </button>
        <div className="text-center">
          <h2
            className="text-2xl mb-1"
            style={{
              color: darkMode ? 'rgba(255, 255, 255, 0.8)' : '#333333',
              fontWeight: 'var(--font-weight-bold)',
              letterSpacing: '-0.01em',
              fontFamily: "'La Belle Aurore', cursive",
            }}
          >
            Luméa
          </h2>
          <h1
            className="text-3xl mb-2"
            style={{
              color: darkMode ? '#FFFFFF' : 'var(--text-primary)',
              fontWeight: 'var(--font-weight-bold)',
              letterSpacing: '-0.02em',
            }}
          >
            Transaction History
          </h1>
          <p
            className="text-sm"
            style={{
              color: darkMode ? 'rgba(255, 255, 255, 0.85)' : '#333333',
              fontWeight: 'var(--font-weight-light)',
              letterSpacing: '0.02em',
            }}
          >
            View all your energy transactions
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: cardBg,
            border: '1px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          <p
            className="text-xs mb-2"
            style={{
              color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
              fontWeight: 'var(--font-weight-light)',
            }}
          >
            Total Exported
          </p>
          <p
            style={{
              color: darkMode ? '#5FC3A2' : '#10B981',
              fontWeight: 'var(--font-weight-bold)',
              fontSize: '1.5rem',
              letterSpacing: '-0.02em',
            }}
          >
            419 CO₂
          </p>
        </div>
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: cardBg,
            border: '1px solid rgba(255, 255, 255, 0.25)',
          }}
        >
          <p
            className="text-xs mb-2"
            style={{
              color: darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)',
              fontWeight: 'var(--font-weight-light)',
            }}
          >
            Total Imported
          </p>
          <p
            style={{
              color: darkMode ? '#E88D8D' : '#EF4444',
              fontWeight: 'var(--font-weight-bold)',
              fontSize: '1.5rem',
              letterSpacing: '-0.02em',
            }}
          >
            103 CO₂
          </p>
        </div>
      </div>

      {/* Transactions List */}
      <div>
        <h3
          className="mb-4"
          style={{
            color: darkMode ? '#FFFFFF' : 'var(--text-primary)',
            fontWeight: 'var(--font-weight-semibold)',
          }}
        >
          All Transactions
        </h3>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="rounded-xl p-4"
              style={{
                background: cardBg,
                border: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="p-2 rounded-full"
                    style={{
                      background:
                        transaction.type === 'export'
                          ? darkMode
                            ? 'rgba(95, 195, 162, 0.2)'
                            : 'rgba(16, 185, 129, 0.15)'
                          : darkMode
                          ? 'rgba(232, 141, 141, 0.2)'
                          : 'rgba(251, 146, 60, 0.15)',
                    }}
                  >
                    {transaction.type === 'export' ? (
                      <ArrowUpRight
                        className="w-5 h-5"
                        style={{ color: darkMode ? '#5FC3A2' : '#10B981' }}
                      />
                    ) : (
                      <ArrowDownRight
                        className="w-5 h-5"
                        style={{ color: darkMode ? '#E88D8D' : '#fb923c' }}
                      />
                    )}
                  </div>

                  <div>
                    <p
                      style={{
                        color: darkMode ? '#FFFFFF' : 'var(--text-primary)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      {transaction.type === 'export' ? 'Energy Exported' : 'Grid Import'}
                    </p>
                    <p
                      className="text-sm"
                      style={{
                        color: darkMode
                          ? 'rgba(255, 255, 255, 0.7)'
                          : 'var(--text-secondary)',
                      }}
                    >
                      {transaction.time}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    style={{
                      color:
                        transaction.type === 'export'
                          ? darkMode
                            ? '#5FC3A2'
                            : '#10B981'
                          : darkMode
                          ? '#E88D8D'
                          : '#fb923c',
                      fontWeight: 'var(--font-weight-bold)',
                    }}
                  >
                    {transaction.type === 'export' ? '+' : '-'}
                    {transaction.amount}
                  </p>
                  <p
                    className="text-sm"
                    style={{
                      color: darkMode
                        ? 'rgba(255, 255, 255, 0.7)'
                        : 'var(--text-secondary)',
                    }}
                  >
                    {transaction.kWh}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Net Summary */}
      <div
        className="rounded-xl p-6 text-center"
        style={{
          background: darkMode
            ? 'linear-gradient(90deg, rgba(42, 64, 53, 0.85), rgba(53, 90, 70, 0.85))'
            : 'linear-gradient(135deg, #10B981 0%, #84cc16 100%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <p
          className="text-sm mb-2"
          style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontWeight: 'var(--font-weight-light)',
          }}
        >
          Net Earnings
        </p>
        <p
          style={{
            color: '#FFFFFF',
            fontWeight: 'var(--font-weight-bold)',
            fontSize: '2.5rem',
            letterSpacing: '-0.03em',
          }}
        >
          +$63.20
        </p>
        <p
          className="text-sm mt-2"
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: 'var(--font-weight-light)',
          }}
        >
          From energy transactions
        </p>
      </div>
    </div>
  );
}
