'use client';

import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const trips = [
  { id: 'TRP-9902', vehicle: '#4022 (Electric)', driver: 'Sam Wilson', status: 'In Progress', from: 'North Depot', to: 'Downtown Terminal', depart: '08:30', arrive: '09:15', distance: '18.2 mi', passengers: 32 },
  { id: 'TRP-9901', vehicle: '#108 (Van)', driver: 'Elena Cruz', status: 'Dispatched', from: 'West Hub', to: 'Suburban Link', depart: '08:45', arrive: '09:30', distance: '12.8 mi', passengers: 8 },
  { id: 'TRP-9898', vehicle: '#4015 (Standard)', driver: 'Marcus Reed', status: 'In Progress', from: 'South Station', to: 'East Pier', depart: '07:55', arrive: '08:50', distance: '22.1 mi', passengers: 45 },
  { id: 'TRP-9895', vehicle: '#105 (Van)', driver: 'Jordan Lee', status: 'Dispatched', from: 'Downtown Terminal', to: 'North Depot', depart: '09:00', arrive: '09:45', distance: '18.2 mi', passengers: 6 },
  { id: 'TRP-9890', vehicle: '#4018 (Standard)', driver: 'David Kim', status: 'Completed', from: 'North Depot', to: 'Airport Express', depart: '06:00', arrive: '07:10', distance: '31.5 mi', passengers: 52 },
  { id: 'TRP-9887', vehicle: '#4022 (Electric)', driver: 'Sam Wilson', status: 'Completed', from: 'Downtown Terminal', to: 'North Depot', depart: '05:30', arrive: '06:05', distance: '18.2 mi', passengers: 14 },
  { id: 'TRP-9882', vehicle: '#110 (SUV)', driver: 'Priya Patel', status: 'Cancelled', from: 'City Hall', to: 'Convention Center', depart: '10:00', arrive: '—', distance: '3.5 mi', passengers: 0 },
];

const statusConfig = {
  'In Progress': { class: 'badge-in-transit' },
  'Dispatched': { class: 'badge-dispatched' },
  'Completed': { class: 'badge-completed' },
  'Cancelled': { class: 'badge-error' },
};

export default function TripsPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <Sidebar activePath="/trips" />
      <main className="ml-60 min-h-screen flex flex-col">
        <TopBar />

        <div className="flex-1 p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)', lineHeight: '32px' }}>
                Trip Management & Dispatch
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                Schedule, monitor, and manage all transit operations
              </p>
            </div>
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2"
                style={{
                  border: '1px solid var(--color-outline-variant)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--color-on-surface-variant)',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>calendar_month</span>
                Schedule View
              </button>
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
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                Create Trip
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Trips', value: '12', icon: 'near_me', color: 'var(--color-secondary)', bg: 'var(--color-secondary-fixed)' },
              { label: 'Dispatched', value: '5', icon: 'send', color: 'var(--color-primary)', bg: 'var(--color-primary-fixed)' },
              { label: 'Completed Today', value: '34', icon: 'check_circle', color: '#15803d', bg: '#dcfce7' },
              { label: 'Cancelled Today', value: '2', icon: 'cancel', color: '#b45309', bg: '#fef3c7' },
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

          {/* Trips Table */}
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
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary)' }}>Today's Trips</h3>
              <div className="flex gap-2 items-center">
                <div className="flex" style={{ backgroundColor: 'var(--color-surface-container-low)', borderRadius: '8px', padding: '4px', gap: '2px' }}>
                  {['All', 'Active', 'Completed'].map((f, i) => (
                    <button
                      key={f}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: i === 0 ? 'var(--color-surface-container-lowest)' : 'transparent',
                        color: i === 0 ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                        boxShadow: i === 0 ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button className="p-2 rounded-lg" style={{ color: 'var(--color-outline)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <span className="material-symbols-outlined">download</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                    {['Trip ID', 'Vehicle', 'Driver', 'Status', 'Route', 'Depart', 'Arrive', 'Distance', 'Passengers', 'Actions'].map((col, i) => (
                      <th
                        key={col}
                        style={{
                          padding: '14px 16px',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'var(--color-on-surface-variant)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          whiteSpace: 'nowrap',
                          textAlign: i === 9 ? 'right' : 'left',
                        }}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trips.map((t, i) => (
                    <tr
                      key={t.id}
                      style={{
                        backgroundColor: i % 2 === 1 ? 'rgba(244, 243, 250, 0.4)' : 'transparent',
                        borderTop: '1px solid rgba(197, 197, 211, 0.3)',
                        transition: 'background-color 0.15s',
                        cursor: 'pointer',
                        opacity: t.status === 'Cancelled' ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 225, 255, 0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = i % 2 === 1 ? 'rgba(244, 243, 250, 0.4)' : 'transparent'}
                    >
                      <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>{t.id}</td>
                      <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>{t.vehicle}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--color-on-surface)' }}>{t.driver}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span className={`${statusConfig[t.status].class} px-2.5 py-0.5 rounded-full`} style={{ fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap' }}>
                          {t.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div className="flex items-center gap-1" style={{ fontSize: '12px', color: 'var(--color-on-surface)' }}>
                          <span style={{ fontSize: '12px' }}>{t.from}</span>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-outline)' }}>arrow_forward</span>
                          <span style={{ fontSize: '12px' }}>{t.to}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface)' }}>{t.depart}</td>
                      <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>{t.arrive}</td>
                      <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface)' }}>{t.distance}</td>
                      <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface)' }}>{t.passengers}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}
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

            <div
              className="p-4 flex justify-between items-center"
              style={{ backgroundColor: 'var(--color-surface-container-low)', borderTop: '1px solid var(--color-outline-variant)' }}
            >
              <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-outline)', letterSpacing: '0.05em' }}>
                Showing 7 of 53 trips today
              </p>
              <div className="flex gap-1">
                {[1, 2, 3, '...', 8].map((p, i) => (
                  <button
                    key={i}
                    style={{
                      width: '32px', height: '32px', borderRadius: '4px', fontSize: '12px',
                      fontWeight: p === 1 ? '700' : '400',
                      color: p === 1 ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                      backgroundColor: p === 1 ? 'var(--color-primary)' : 'transparent',
                      border: '1px solid var(--color-outline-variant)', cursor: 'pointer',
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
