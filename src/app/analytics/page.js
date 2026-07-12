'use client';

import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const performanceData = [
  { month: 'Jan', onTime: 91, utilization: 78, trips: 412 },
  { month: 'Feb', onTime: 89, utilization: 75, trips: 388 },
  { month: 'Mar', onTime: 93, utilization: 82, trips: 451 },
  { month: 'Apr', onTime: 92, utilization: 80, trips: 438 },
  { month: 'May', onTime: 95, utilization: 86, trips: 498 },
  { month: 'Jun', onTime: 94, utilization: 84, trips: 476 },
];

const maxTrips = Math.max(...performanceData.map(d => d.trips));

const topVehicles = [
  { id: '#4022', trips: 134, efficiency: 'Excellent', score: 96 },
  { id: '#4015', trips: 118, efficiency: 'Good', score: 88 },
  { id: '#4018', trips: 112, efficiency: 'Good', score: 85 },
  { id: '#108', trips: 98, efficiency: 'Good', score: 83 },
  { id: '#105', trips: 87, efficiency: 'Fair', score: 76 },
];

const topDrivers = [
  { name: 'Marcus Reed', id: 'DRV-003', trips: 445, onTime: '98%', score: 98 },
  { name: 'Sam Wilson', id: 'DRV-001', trips: 312, onTime: '96%', score: 95 },
  { name: 'Maria Garcia', id: 'DRV-006', trips: 387, onTime: '97%', score: 94 },
  { name: 'Elena Cruz', id: 'DRV-002', trips: 278, onTime: '94%', score: 91 },
  { name: 'David Kim', id: 'DRV-007', trips: 203, onTime: '95%', score: 90 },
];

const scoreColor = (score) => {
  if (score >= 90) return { color: '#15803d', bg: '#dcfce7' };
  if (score >= 80) return { color: '#b45309', bg: '#fef3c7' };
  return { color: 'var(--color-error)', bg: 'var(--color-error-container)' };
};

export default function AnalyticsPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <Sidebar activePath="/analytics" />
      <main className="ml-60 min-h-screen flex flex-col">
        <TopBar />

        <div className="flex-1 p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)', lineHeight: '32px' }}>
                Analytics & Reports
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                Operational insights, performance metrics, and trend analysis
              </p>
            </div>
            <div className="flex gap-3">
              <select
                style={{
                  padding: '8px 16px',
                  border: '1px solid var(--color-outline-variant)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--color-on-surface-variant)',
                  background: 'var(--color-surface-container-lowest)',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option>Last 6 Months</option>
                <option>Last 30 Days</option>
                <option>This Year</option>
              </select>
              <button
                className="flex items-center gap-2 px-4 py-2"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                Export PDF
              </button>
            </div>
          </div>

          {/* KPI Summary Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Avg On-Time Rate', value: '94%', icon: 'schedule', color: '#15803d', bg: '#dcfce7', trend: '↑ +2% vs H1' },
              { label: 'Fleet Utilization', value: '84%', icon: 'speed', color: 'var(--color-secondary)', bg: 'var(--color-secondary-fixed)', trend: '↑ +6% vs last year' },
              { label: 'Total Trips (H1)', value: '2,663', icon: 'route', color: 'var(--color-primary)', bg: 'var(--color-primary-fixed)', trend: 'Jan – Jun 2025' },
              { label: 'Avg Fuel Cost/Trip', value: '$79.25', icon: 'local_gas_station', color: '#b45309', bg: '#fef3c7', trend: '↓ -1.4% vs H1' },
            ].map((s) => (
              <div
                key={s.label}
                className="card-hover p-4 rounded-xl"
                style={{
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  border: '1px solid var(--color-outline-variant)',
                  boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                <span
                  className="material-symbols-outlined p-1.5 rounded-lg mb-2"
                  style={{ color: s.color, backgroundColor: s.bg, fontSize: '20px', display: 'inline-block' }}
                >
                  {s.icon}
                </span>
                <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-on-surface)', fontFamily: 'JetBrains Mono, monospace' }}>{s.value}</h3>
                <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                <p style={{ fontSize: '11px', color: 'var(--color-outline)', marginTop: '2px' }}>{s.trend}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Monthly Trips Chart */}
            <div
              className="lg:col-span-8 rounded-xl p-4"
              style={{
                backgroundColor: 'var(--color-surface-container-lowest)',
                border: '1px solid var(--color-outline-variant)',
                boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary)' }}>Monthly Trips & Performance</h3>
                <div className="flex gap-4">
                  {[
                    { label: 'Trips', color: 'var(--color-primary-container)' },
                    { label: 'On-Time %', color: 'var(--color-secondary)' },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-1">
                      <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: l.color, display: 'inline-block' }} />
                      <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-outline)', letterSpacing: '0.05em' }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ height: '180px', display: 'flex', alignItems: 'flex-end', gap: '16px', padding: '0 8px' }}>
                {performanceData.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center" style={{ cursor: 'pointer' }}>
                    <div style={{ width: '100%', display: 'flex', gap: '4px', alignItems: 'flex-end', height: '150px' }}>
                      <div
                        style={{
                          flex: 1,
                          height: `${(d.trips / maxTrips) * 100}%`,
                          backgroundColor: 'var(--color-primary-container)',
                          borderRadius: '4px 4px 0 0',
                          transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-container)'}
                      />
                      <div
                        style={{
                          flex: 1,
                          height: `${d.onTime}%`,
                          backgroundColor: 'var(--color-secondary)',
                          borderRadius: '4px 4px 0 0',
                          opacity: 0.7,
                          transition: 'opacity 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
                      />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-outline)', marginTop: '8px', letterSpacing: '0.05em' }}>
                      {d.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fleet Utilization Donut */}
            <div
              className="lg:col-span-4 rounded-xl p-4"
              style={{
                backgroundColor: 'var(--color-surface-container-lowest)',
                border: '1px solid var(--color-outline-variant)',
                boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '16px' }}>
                Fleet Status Breakdown
              </h3>
              {/* SVG Donut Chart */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <svg viewBox="0 0 100 100" style={{ width: '140px', height: '140px', transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#eeedf4" strokeWidth="14" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="var(--color-secondary)" strokeWidth="14"
                    strokeDasharray={`${0.64 * 2 * Math.PI * 38} ${2 * Math.PI * 38}`}
                    strokeLinecap="butt" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="var(--color-primary)" strokeWidth="14"
                    strokeDasharray={`${0.286 * 2 * Math.PI * 38} ${2 * Math.PI * 38}`}
                    strokeDashoffset={`${-(0.64) * 2 * Math.PI * 38}`}
                    strokeLinecap="butt" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#b45309" strokeWidth="14"
                    strokeDasharray={`${0.071 * 2 * Math.PI * 38} ${2 * Math.PI * 38}`}
                    strokeDashoffset={`${-(0.64 + 0.286) * 2 * Math.PI * 38}`}
                    strokeLinecap="butt" />
                </svg>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'In-Transit / Active', pct: '64%', count: '27 vehicles', color: 'var(--color-secondary)' },
                  { label: 'Available', pct: '28.6%', count: '12 vehicles', color: 'var(--color-primary)' },
                  { label: 'In Maintenance', pct: '7.1%', count: '3 vehicles', color: '#b45309' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: item.color, flexShrink: 0, display: 'inline-block' }} />
                    <div className="flex-1">
                      <p style={{ fontSize: '13px', color: 'var(--color-on-surface)', fontWeight: '500' }}>{item.label}</p>
                      <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{item.count}</p>
                    </div>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', color: 'var(--color-on-surface)' }}>
                      {item.pct}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Performers */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Vehicles */}
            <div
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: 'var(--color-surface-container-lowest)',
                border: '1px solid var(--color-outline-variant)',
                boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--color-outline-variant)' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary)' }}>Top Vehicles</h3>
              </div>
              <div>
                {topVehicles.map((v, i) => {
                  const sc = scoreColor(v.score);
                  return (
                    <div
                      key={v.id}
                      className="flex items-center justify-between px-4 py-3"
                      style={{ borderTop: i > 0 ? '1px solid rgba(197,197,211,0.3)' : 'none', transition: 'background-color 0.15s', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(220,225,255,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div className="flex items-center gap-3">
                        <span style={{ width: '24px', fontSize: '14px', fontWeight: '700', color: 'var(--color-outline)', fontFamily: 'JetBrains Mono, monospace' }}>
                          #{i + 1}
                        </span>
                        <div>
                          <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>{v.id}</p>
                          <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{v.trips} trips this period</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--color-surface-container)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div style={{ width: `${v.score}%`, height: '100%', backgroundColor: sc.color, borderRadius: '9999px' }} />
                        </div>
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{ fontSize: '12px', fontWeight: '700', color: sc.color, backgroundColor: sc.bg }}
                        >
                          {v.score}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Drivers */}
            <div
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: 'var(--color-surface-container-lowest)',
                border: '1px solid var(--color-outline-variant)',
                boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--color-outline-variant)' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary)' }}>Top Drivers</h3>
              </div>
              <div>
                {topDrivers.map((d, i) => {
                  const sc = scoreColor(d.score);
                  return (
                    <div
                      key={d.id}
                      className="flex items-center justify-between px-4 py-3"
                      style={{ borderTop: i > 0 ? '1px solid rgba(197,197,211,0.3)' : 'none', transition: 'background-color 0.15s', cursor: 'pointer' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(220,225,255,0.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <div className="flex items-center gap-3">
                        <span style={{ width: '24px', fontSize: '14px', fontWeight: '700', color: 'var(--color-outline)', fontFamily: 'JetBrains Mono, monospace' }}>
                          #{i + 1}
                        </span>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-on-surface)' }}>{d.name}</p>
                          <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{d.trips} trips · {d.onTime} on-time</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div style={{ width: '80px', height: '4px', backgroundColor: 'var(--color-surface-container)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div style={{ width: `${d.score}%`, height: '100%', backgroundColor: sc.color, borderRadius: '9999px' }} />
                        </div>
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{ fontSize: '12px', fontWeight: '700', color: sc.color, backgroundColor: sc.bg }}
                        >
                          {d.score}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
