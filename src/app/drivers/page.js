'use client';

import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const drivers = [
  { id: 'DRV-001', name: 'Sam Wilson', avatar: 'SW', license: 'CDL Class A', status: 'On Duty', vehicle: '#4022', trips: 312, onTime: '96%', licenseExp: '2026-03-15', phone: '+1 (555) 201-4832' },
  { id: 'DRV-002', name: 'Elena Cruz', avatar: 'EC', license: 'CDL Class B', status: 'On Duty', vehicle: '#108', trips: 278, onTime: '94%', licenseExp: '2026-08-22', phone: '+1 (555) 308-7741' },
  { id: 'DRV-003', name: 'Marcus Reed', avatar: 'MR', license: 'CDL Class A + Hazmat', status: 'On Duty', vehicle: '#4015', trips: 445, onTime: '98%', licenseExp: '2025-07-15', phone: '+1 (555) 412-5590' },
  { id: 'DRV-004', name: 'Jordan Lee', avatar: 'JL', license: 'CDL Class B', status: 'Dispatched', vehicle: '#105', trips: 189, onTime: '91%', licenseExp: '2026-11-30', phone: '+1 (555) 519-3320' },
  { id: 'DRV-005', name: 'Johnathan Smith', avatar: 'JS', license: 'CDL Class B', status: 'Off Duty', vehicle: '—', trips: 521, onTime: '93%', licenseExp: '2025-07-18', phone: '+1 (555) 623-8810' },
  { id: 'DRV-006', name: 'Maria Garcia', avatar: 'MG', license: 'CDL Class A + Hazmat', status: 'On Leave', vehicle: '—', trips: 387, onTime: '97%', licenseExp: '2025-07-29', phone: '+1 (555) 714-2248' },
  { id: 'DRV-007', name: 'David Kim', avatar: 'DK', license: 'CDL Class A', status: 'On Duty', vehicle: '#4018', trips: 203, onTime: '95%', licenseExp: '2027-01-10', phone: '+1 (555) 817-6631' },
  { id: 'DRV-008', name: 'Priya Patel', avatar: 'PP', license: 'CDL Class B', status: 'Off Duty', vehicle: '—', trips: 156, onTime: '90%', licenseExp: '2026-06-05', phone: '+1 (555) 921-4470' },
];

const statusConfig = {
  'On Duty': { style: 'badge-in-transit' },
  'Dispatched': { style: 'badge-dispatched' },
  'Off Duty': { style: 'badge-available' },
  'On Leave': { style: 'badge-maintenance' },
};

const avatarColors = [
  { bg: '#dce1ff', color: '#00236f' },
  { bg: '#86f2e4', color: '#006a61' },
  { bg: '#ffdbcb', color: '#4b1c00' },
  { bg: '#dce1ff', color: '#264191' },
  { bg: '#ffdad6', color: '#ba1a1a' },
  { bg: '#86f2e4', color: '#005049' },
  { bg: '#dce1ff', color: '#00236f' },
  { bg: '#ffdbcb', color: '#773205' },
];

export default function DriversPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <Sidebar activePath="/drivers" />
      <main className="ml-60 min-h-screen flex flex-col">
        <TopBar />

        <div className="flex-1 p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)', lineHeight: '32px' }}>
                Driver Management
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                Track driver status, licenses, performance, and schedules
              </p>
            </div>
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
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_add</span>
              Add Driver
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Drivers', value: '28', icon: 'group', color: 'var(--color-primary)', bg: 'var(--color-primary-fixed)' },
              { label: 'On Duty', value: '18', icon: 'directions_run', color: 'var(--color-secondary)', bg: 'var(--color-secondary-fixed)' },
              { label: 'License Expiring', value: '3', icon: 'warning', color: '#b45309', bg: '#fef3c7' },
              { label: 'Avg On-Time Rate', value: '94.6%', icon: 'schedule', color: '#15803d', bg: '#dcfce7' },
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
                <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-on-surface)' }}>{s.value}</h3>
                <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Drivers Table */}
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
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary)' }}>Driver Roster</h3>
              <div className="flex gap-2">
                <button
                  className="p-2 rounded-lg"
                  style={{ color: 'var(--color-outline)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
                <button
                  className="p-2 rounded-lg"
                  style={{ color: 'var(--color-outline)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  <span className="material-symbols-outlined">download</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                    {['Driver', 'Driver ID', 'License Type', 'Status', 'Vehicle', 'Total Trips', 'On-Time Rate', 'License Expiry', 'Actions'].map((col, i) => (
                      <th
                        key={col}
                        style={{
                          padding: '14px 20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'var(--color-on-surface-variant)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          whiteSpace: 'nowrap',
                          textAlign: i === 8 ? 'right' : 'left',
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((d, i) => {
                    const colors = avatarColors[i % avatarColors.length];
                    const isExpiringSoon = new Date(d.licenseExp) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                    return (
                      <tr
                        key={d.id}
                        style={{
                          backgroundColor: i % 2 === 1 ? 'rgba(244, 243, 250, 0.4)' : 'transparent',
                          borderTop: '1px solid rgba(197, 197, 211, 0.3)',
                          transition: 'background-color 0.15s',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 225, 255, 0.15)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = i % 2 === 1 ? 'rgba(244, 243, 250, 0.4)' : 'transparent'}
                      >
                        <td style={{ padding: '14px 20px' }}>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: colors.bg, color: colors.color, fontSize: '12px', fontWeight: '700', flexShrink: 0 }}
                            >
                              {d.avatar}
                            </div>
                            <div>
                              <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-on-surface)' }}>{d.name}</p>
                              <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{d.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>
                          {d.id}
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: '14px', color: 'var(--color-on-surface)' }}>
                          {d.license}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span
                            className={`${statusConfig[d.status].style} px-2.5 py-0.5 rounded-full`}
                            style={{ fontSize: '12px', fontWeight: '500' }}
                          >
                            {d.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: d.vehicle === '—' ? 'var(--color-outline)' : 'var(--color-on-surface)' }}>
                          {d.vehicle}
                        </td>
                        <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface)' }}>
                          {d.trips}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div className="flex items-center gap-2">
                            <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--color-surface-container)', borderRadius: '9999px', overflow: 'hidden' }}>
                              <div style={{ width: d.onTime, height: '100%', backgroundColor: 'var(--color-secondary)', borderRadius: '9999px' }} />
                            </div>
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '500', color: 'var(--color-on-surface)' }}>
                              {d.onTime}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span
                            style={{
                              fontFamily: 'JetBrains Mono, monospace',
                              fontSize: '13px',
                              color: isExpiringSoon ? 'var(--color-error)' : 'var(--color-on-surface-variant)',
                              fontWeight: isExpiringSoon ? '700' : '500',
                            }}
                          >
                            {isExpiringSoon && '⚠ '}{d.licenseExp}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                          <div className="flex items-center justify-end gap-1">
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)', padding: '4px' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-outline)'}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>visibility</span>
                            </button>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)', padding: '4px' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-secondary)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-outline)'}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                            </button>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)', padding: '4px' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-outline)'}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div
              className="p-4 flex justify-between items-center"
              style={{ backgroundColor: 'var(--color-surface-container-low)', borderTop: '1px solid var(--color-outline-variant)' }}
            >
              <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-outline)', letterSpacing: '0.05em' }}>
                Showing 8 of 28 drivers
              </p>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((p) => (
                  <button
                    key={p}
                    style={{
                      width: '32px', height: '32px', borderRadius: '4px', fontSize: '12px',
                      fontWeight: p === 1 ? '700' : '400',
                      color: p === 1 ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                      backgroundColor: p === 1 ? 'var(--color-primary)' : 'transparent',
                      border: '1px solid var(--color-outline-variant)',
                      cursor: 'pointer',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
