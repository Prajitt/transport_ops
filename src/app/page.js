'use client';

import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const kpiCards = [
  {
    icon: 'local_shipping',
    iconColor: 'var(--color-primary)',
    iconBg: 'var(--color-primary-fixed)',
    label: 'Total Vehicles',
    value: '42',
    badge: '+2.4%',
    badgeColor: 'var(--color-on-secondary-container)',
    badgeBg: 'rgba(134, 242, 228, 0.2)',
    meta: 'Last updated: 2m ago',
  },
  {
    icon: 'near_me',
    iconColor: 'var(--color-secondary)',
    iconBg: 'var(--color-secondary-fixed)',
    label: 'Active Trips',
    value: '12',
    badge: 'Active',
    badgeColor: 'var(--color-on-secondary-container)',
    badgeBg: 'rgba(134, 242, 228, 0.2)',
    meta: 'Currently in transit',
  },
  {
    icon: 'badge',
    iconColor: 'var(--color-tertiary)',
    iconBg: 'var(--color-tertiary-fixed)',
    label: 'Drivers on Duty',
    value: '18',
    badge: 'On Duty',
    badgeColor: 'var(--color-on-tertiary-container)',
    badgeBg: 'rgba(110, 44, 0, 0.1)',
    meta: 'Shift: Morning Transit',
  },
  {
    icon: 'speed',
    iconColor: 'var(--color-on-secondary-container)',
    iconBg: 'var(--color-secondary-container)',
    label: 'Fleet Utilization',
    value: 'Optimized',
    badge: '84%',
    badgeColor: 'var(--color-on-secondary-container)',
    badgeBg: 'transparent',
    meta: null,
    progress: 84,
  },
];

const recentTrips = [
  {
    id: 'TRP-9902',
    vehicle: '#4022 (Electric)',
    vehicleIcon: 'directions_bus',
    driver: 'Sam Wilson',
    status: 'In Progress',
    statusClass: 'badge-in-transit',
    from: 'North Depot',
    to: 'Downtown Terminal',
  },
  {
    id: 'TRP-9901',
    vehicle: '#108 (Van)',
    vehicleIcon: 'airport_shuttle',
    driver: 'Elena Cruz',
    status: 'Dispatched',
    statusClass: 'badge-dispatched',
    from: 'West Hub',
    to: 'Suburban Link',
  },
  {
    id: 'TRP-9898',
    vehicle: '#4015 (Standard)',
    vehicleIcon: 'directions_bus',
    driver: 'Marcus Reed',
    status: 'In Progress',
    statusClass: 'badge-in-transit',
    from: 'South Station',
    to: 'East Pier',
  },
  {
    id: 'TRP-9895',
    vehicle: '#105 (Van)',
    vehicleIcon: 'airport_shuttle',
    driver: 'Jordan Lee',
    status: 'Dispatched',
    statusClass: 'badge-dispatched',
    from: 'Downtown Terminal',
    to: 'North Depot',
  },
];

const weeklyData = [
  { day: 'Mon', value: 60 },
  { day: 'Tue', value: 75 },
  { day: 'Wed', value: 90 },
  { day: 'Thu', value: 45 },
  { day: 'Fri', value: 80 },
  { day: 'Sat', value: 30 },
  { day: 'Sun', value: 20 },
];

export default function DashboardPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <Sidebar activePath="/" />
      <main className="ml-60 min-h-screen flex flex-col">
        <TopBar />

        <div className="flex-1 p-6 space-y-4">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)', lineHeight: '32px' }}>
                Operations Dashboard
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                Real-time fleet monitoring & dispatch control
              </p>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-outline)', fontFamily: 'JetBrains Mono, monospace' }}>
              Last sync: 2 minutes ago
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {kpiCards.map((card, i) => (
              <div
                key={i}
                className="card-hover p-4 rounded-xl"
                style={{
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  border: '1px solid var(--color-outline-variant)',
                  boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className="material-symbols-outlined p-2 rounded-lg"
                    style={{
                      color: card.iconColor,
                      backgroundColor: card.iconBg,
                      fontSize: '20px',
                    }}
                  >
                    {card.icon}
                  </span>
                  <div
                    className="px-2 py-0.5 rounded"
                    style={{
                      color: card.badgeColor,
                      backgroundColor: card.badgeBg,
                      fontSize: '10px',
                      fontWeight: '700',
                    }}
                  >
                    {card.badge}
                  </div>
                </div>
                <p style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--color-on-surface-variant)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '4px',
                }}>
                  {card.label}
                </p>
                <h2 style={{ fontSize: '36px', fontWeight: '700', color: 'var(--color-on-surface)', lineHeight: '44px' }}>
                  {card.value}
                </h2>
                {card.meta && (
                  <p style={{ fontSize: '12px', color: 'var(--color-outline)', marginTop: '4px', fontStyle: 'italic' }}>
                    {card.meta}
                  </p>
                )}
                {card.progress && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '3px', backgroundColor: 'var(--color-surface-container)' }}>
                    <div style={{ width: `${card.progress}%`, height: '100%', backgroundColor: 'var(--color-secondary)' }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Middle Row: Charts + Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Charts - 8 cols */}
            <div className="lg:col-span-8 space-y-4">
              {/* Weekly Trip Volume Bar Chart */}
              <div
                className="rounded-xl p-4"
                style={{
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  border: '1px solid var(--color-outline-variant)',
                  boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary)' }}>
                    Weekly Trip Volume
                  </h3>
                  <div className="flex items-center gap-2">
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--color-primary-container)', display: 'inline-block' }} />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-outline)', letterSpacing: '0.05em' }}>
                      Trips Completed
                    </span>
                  </div>
                </div>
                <div style={{ height: '192px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 16px', gap: '12px' }}>
                  {weeklyData.map((d) => (
                    <div key={d.day} className="flex-1 flex flex-col items-center group" style={{ cursor: 'pointer' }}>
                      <div
                        className="chart-bar w-full rounded-t-lg"
                        style={{
                          height: `${d.value}%`,
                          backgroundColor: 'var(--color-primary-container)',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-container)'}
                      />
                      <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-outline)', marginTop: '8px', letterSpacing: '0.05em' }}>
                        {d.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fuel Efficiency Line Chart */}
              <div
                className="rounded-xl p-4"
                style={{
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  border: '1px solid var(--color-outline-variant)',
                  boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary)' }}>
                    Fuel Efficiency Trends
                  </h3>
                  <select
                    style={{
                      background: 'transparent',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: 'var(--color-secondary)',
                      cursor: 'pointer',
                      outline: 'none',
                    }}
                  >
                    <option>Last 30 Days</option>
                    <option>Last 6 Months</option>
                  </select>
                </div>
                <div style={{ position: 'relative', height: '128px', width: '100%', marginTop: '16px' }}>
                  <svg style={{ width: '100%', height: '100%' }} viewBox="0 0 400 100">
                    <defs>
                      <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#89f5e7', stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: '#89f5e7', stopOpacity: 0 }} />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,80 Q50,60 100,70 T200,40 T300,50 T400,20"
                      fill="none"
                      stroke="#006a61"
                      strokeLinecap="round"
                      strokeWidth="3"
                    />
                    <path
                      d="M0,80 Q50,60 100,70 T200,40 T300,50 T400,20 L400,100 L0,100 Z"
                      fill="url(#gradient)"
                      opacity="0.15"
                    />
                    {/* Data points */}
                    <circle cx="100" cy="70" r="4" fill="#006a61" />
                    <circle cx="200" cy="40" r="4" fill="#006a61" />
                    <circle cx="300" cy="50" r="4" fill="#006a61" />
                    <circle cx="400" cy="20" r="4" fill="#006a61" />
                  </svg>
                </div>
                <div className="flex gap-6 mt-3">
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Average</span>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '500', color: 'var(--color-on-surface)' }}>8.4 MPG</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Best Vehicle</span>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '500', color: 'var(--color-secondary)' }}>#4022 Electric</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trend</span>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: '#15803d' }}>↑ +12.3%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts Panel - 4 cols */}
            <div className="lg:col-span-4">
              <div
                className="rounded-xl p-4 h-full"
                style={{
                  backgroundColor: 'var(--color-surface-container-highest)',
                  border: '1px solid var(--color-outline-variant)',
                  boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary)' }}>
                    Active Alerts
                  </h3>
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: 'var(--color-error)',
                      color: 'var(--color-on-error)',
                      fontSize: '10px',
                      fontWeight: '700',
                    }}
                  >
                    5 Priority
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Licenses Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-outline)', letterSpacing: '0.05em' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>priority_high</span>
                      Expiring Licenses (2)
                    </div>

                    <div
                      className="p-3 rounded-r-lg"
                      style={{
                        backgroundColor: 'rgba(255, 218, 214, 0.3)',
                        borderLeft: '4px solid var(--color-error)',
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-on-surface)' }}>Johnathan Smith</p>
                          <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>CDL Class B - Expires in 3 days</p>
                        </div>
                        <button style={{ color: 'var(--color-error)', fontWeight: '700', fontSize: '10px', textTransform: 'uppercase', cursor: 'pointer', background: 'none', border: 'none' }}>
                          Renew
                        </button>
                      </div>
                    </div>

                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: 'var(--color-surface-container)' }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-on-surface)' }}>Maria Garcia</p>
                          <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>Hazmat Endorsement - Expires in 12 days</p>
                        </div>
                        <button style={{ color: 'var(--color-primary)', fontWeight: '700', fontSize: '10px', textTransform: 'uppercase', cursor: 'pointer', background: 'none', border: 'none' }}>
                          Notify
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Maintenance Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-outline)', letterSpacing: '0.05em' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>build_circle</span>
                      Due Maintenance (3)
                    </div>

                    <div
                      className="p-3 rounded-r-lg"
                      style={{
                        backgroundColor: 'rgba(243, 148, 97, 0.05)',
                        borderLeft: '4px solid var(--color-on-tertiary-container)',
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-on-surface)' }}>Bus #4022</p>
                          <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>Brake System Overhaul Required</p>
                        </div>
                        <span className="material-symbols-outlined" style={{ color: 'var(--color-on-tertiary-container)', fontSize: '20px' }}>
                          schedule
                        </span>
                      </div>
                    </div>

                    <div
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: 'var(--color-surface-container)', opacity: 0.7 }}
                    >
                      <p style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-on-surface)' }}>Van #108</p>
                      <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>Routine Oil Change - 450 miles overdue</p>
                    </div>

                    <button
                      className="w-full py-2 transition-colors"
                      style={{
                        border: '1px solid var(--color-outline-variant)',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: 'var(--color-on-surface-variant)',
                        letterSpacing: '0.05em',
                        background: 'transparent',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      View All Maintenance
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Trips Table */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              border: '1px solid var(--color-outline-variant)',
              boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div
              className="px-4 py-4 flex justify-between items-center"
              style={{ borderBottom: '1px solid var(--color-outline-variant)' }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary)' }}>
                Recent Trips
              </h3>
              <div className="flex gap-2">
                <button
                  className="p-2 transition-colors rounded-lg"
                  style={{ color: 'var(--color-outline)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-container)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
                <button
                  className="p-2 transition-colors rounded-lg"
                  style={{ color: 'var(--color-outline)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-container)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span className="material-symbols-outlined">download</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                    {['Trip ID', 'Vehicle', 'Driver', 'Status', 'Source / Destination', 'Actions'].map((col, i) => (
                      <th
                        key={col}
                        style={{
                          padding: '16px 24px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'var(--color-on-surface-variant)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          textAlign: i === 5 ? 'right' : 'left',
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentTrips.map((trip, i) => (
                    <tr
                      key={trip.id}
                      style={{
                        backgroundColor: i % 2 === 1 ? 'rgba(244, 243, 250, 0.4)' : 'transparent',
                        borderTop: '1px solid rgba(197, 197, 211, 0.3)',
                        transition: 'background-color 0.2s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = i % 2 === 1 ? 'rgba(244, 243, 250, 0.4)' : 'transparent'}
                    >
                      <td style={{ padding: '16px 24px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>
                        {trip.id}
                      </td>
                      <td style={{ padding: '16px 24px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-outline)' }}>
                            {trip.vehicleIcon}
                          </span>
                          {trip.vehicle}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>
                        {trip.driver}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <span
                          className={`${trip.statusClass} px-2.5 py-0.5 rounded-full`}
                          style={{ fontSize: '12px', fontWeight: '500', display: 'inline-flex', alignItems: 'center' }}
                        >
                          {trip.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div className="flex items-center gap-2" style={{ fontSize: '12px', color: 'var(--color-on-surface)' }}>
                          <span>{trip.from}</span>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-outline)' }}>
                            arrow_forward
                          </span>
                          <span>{trip.to}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        <button
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-outline)'}
                        >
                          <span className="material-symbols-outlined">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div
              className="p-4 flex justify-between items-center"
              style={{
                backgroundColor: 'var(--color-surface-container-low)',
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--color-outline)',
                letterSpacing: '0.05em',
              }}
            >
              <p>Showing 4 of 12 active trips</p>
              <div className="flex gap-4">
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)', fontSize: '12px' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-outline)'}
                >Previous</button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: '700', fontSize: '12px' }}>1</button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)', fontSize: '12px' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-outline)'}
                >2</button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)', fontSize: '12px' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-outline)'}
                >Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
