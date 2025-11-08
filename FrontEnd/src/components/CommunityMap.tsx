import { MapPin, Users } from 'lucide-react';

interface CommunityMapProps {
  darkMode?: boolean;
}

export function CommunityMap({ darkMode = false }: CommunityMapProps) {
  // Mock community members with energy pricing
  const communityMembers = [
    { id: 1, x: 25, y: 30, price: 0.15, name: 'Sarah M.' },
    { id: 2, x: 60, y: 45, price: 0.16, name: 'John D.' },
    { id: 3, x: 40, y: 65, price: 0.14, name: 'Emily R.' },
    { id: 4, x: 75, y: 35, price: 0.17, name: 'Mike W.' },
    { id: 5, x: 50, y: 50, price: 0.00, name: 'You', isUser: true },
  ];

  return (
    <div
      className="rounded-xl p-5 relative overflow-hidden"
      style={{
        background: darkMode
          ? 'linear-gradient(90deg, rgba(42, 64, 53, 0.8), rgba(53, 90, 70, 0.8))'
          : 'linear-gradient(90deg, rgba(98, 191, 212, 0.4) 0%, rgba(241, 221, 118, 0.4) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        minHeight: '220px',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Users
          className="w-5 h-5"
          style={{ color: darkMode ? '#5FC3A2' : '#10B981' }}
        />
        <h3
          style={{
            color: darkMode ? '#FFFFFF' : '#000000',
            fontWeight: 'var(--font-weight-bold)',
          }}
        >
          Community Network
        </h3>
      </div>

      {/* Map Visual */}
      <div className="relative" style={{ height: '140px' }}>
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(${darkMode ? '#FFFFFF' : '#000000'} 1px, transparent 1px),
              linear-gradient(90deg, ${darkMode ? '#FFFFFF' : '#000000'} 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />

        {/* Community Members */}
        {communityMembers.map((member) => (
          <div
            key={member.id}
            className="absolute transition-all duration-300 hover:scale-125 cursor-pointer"
            style={{
              left: `${member.x}%`,
              top: `${member.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Ping Animation for User */}
            {member.isUser && (
              <>
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    background: darkMode ? '#5FC3A2' : '#10B981',
                    opacity: 0.4,
                  }}
                />
                <div
                  className="absolute inset-0 rounded-full animate-pulse"
                  style={{
                    background: darkMode ? '#5FC3A2' : '#10B981',
                    opacity: 0.2,
                    scale: 1.5,
                  }}
                />
              </>
            )}

            {/* Pin */}
            <div
              className="relative rounded-full p-2 shadow-lg"
              style={{
                background: member.isUser
                  ? darkMode
                    ? '#5FC3A2'
                    : '#10B981'
                  : darkMode
                  ? 'rgba(95, 195, 162, 0.6)'
                  : 'rgba(16, 185, 129, 0.6)',
                border: `2px solid ${
                  member.isUser
                    ? darkMode
                      ? '#FFFFFF'
                      : '#FFFFFF'
                    : 'transparent'
                }`,
              }}
            >
              <MapPin
                className="w-3 h-3"
                style={{ color: '#FFFFFF' }}
              />
            </div>

            {/* Price Tag */}
            {!member.isUser && (
              <div
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs px-2 py-0.5 rounded whitespace-nowrap"
                style={{
                  background: darkMode
                    ? 'rgba(42, 64, 53, 0.95)'
                    : 'rgba(255, 255, 255, 0.95)',
                  color: darkMode ? '#FFFFFF' : '#000000',
                  fontWeight: 'var(--font-weight-semibold)',
                  fontSize: '10px',
                }}
              >
                ${member.price.toFixed(2)}
              </div>
            )}
            {member.isUser && (
              <div
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs px-2 py-0.5 rounded whitespace-nowrap"
                style={{
                  background: darkMode ? '#5FC3A2' : '#10B981',
                  color: '#FFFFFF',
                  fontWeight: 'var(--font-weight-bold)',
                  fontSize: '10px',
                }}
              >
                You
              </div>
            )}
          </div>
        ))}

        {/* Connection Lines */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ width: '100%', height: '100%' }}
        >
          {communityMembers
            .filter((m) => m.isUser)
            .map((userMember) =>
              communityMembers
                .filter((m) => !m.isUser)
                .map((member) => (
                  <line
                    key={`${userMember.id}-${member.id}`}
                    x1={`${userMember.x}%`}
                    y1={`${userMember.y}%`}
                    x2={`${member.x}%`}
                    y2={`${member.y}%`}
                    stroke={darkMode ? 'rgba(95, 195, 162, 0.2)' : 'rgba(16, 185, 129, 0.2)'}
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                ))
            )}
        </svg>
      </div>
    </div>
  );
}
