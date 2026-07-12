'use client';

import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const maintenanceLogs = [
  { id: 'MNT-0421', vehicle: '#4022', type: 'Brake System Overhaul', status: 'Critical', priority: 'High', assignedTo: 'Central Garage', dueDate: '2025-07-13', cost: '$1,840', notes: 'ABS module replacement required' },
  { id: 'MNT-0420', vehicle: '#108', type: 'Oil Change & Filter', status: 'Overdue', priority: 'Medium', assignedTo: 'West Depot Shop', dueDate: '2025-07-10', cost: '$95', notes: '450 miles past schedule' },
  { id: 'MNT-0419', vehicle: '#4030', type: 'Battery System Diagnostic', status: 'In Progress', priority: 'High', assignedTo: 'EV Specialist', dueDate: '2025-07-12', cost: '$380', notes: 'Charging efficiency below threshold' },
  { id: 'MNT-0418', vehicle: '#4015', type: 'Tire Rotation & Alignment', status: 'Scheduled', priority: 'Low', assignedTo: 'North Depot Shop', dueDate: '2025-07-18', cost: '$220', notes: 'Routine rotation at 70k miles' },
  { id: 'MNT-0417', vehicle: '#4019', type: 'Annual Safety Inspection', status: 'Scheduled', priority: 'Medium', assignedTo: 'State Certified', dueDate: '2025-07-25', cost: '$150', notes: 'DOT compliance required' },
  { id: 'MNT-0416', vehicle: '#105', type: 'AC System Recharge', status: 'Completed', priority: 'Low', assignedTo: 'West Depot Shop', dueDate: '2025-07-05', cost: '$125', notes: 'Completed on schedule' },
  { id: 'MNT-0415', vehicle: '#110', type: 'Windshield Replacement', status: 'Completed', priority: 'Medium', assignedTo: 'Central Garage', dueDate: '2025-07-03', cost: '$480', notes: 'Chip repaired and sealed' },
];

const priorityConfig = {
  'High': { color: 'var(--color-error)', bg: 'rgba(186, 26, 26, 0.1)' },
  'Medium': { color: '#b45309', bg: '#fef3c7' },
  'Low': { color: '#15803d', bg: '#dcfce7' },
};

const statusConfig = {
  'Critical': { class: 'badge-error' },
  'Overdue': { class: 'badge-maintenance' },
  'In Progress': { class: 'badge-dispatched' },
  'Scheduled': { class: 'badge-in-transit' },
  'Completed': { class: 'badge-completed' },
};

export default function MaintenancePage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <Sidebar activePath="/maintenance" />
      <main className="ml-60 min-h-screen flex flex-col">
        <TopBar />

        <div className="flex-1 p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)', lineHeight: '32px' }}>
                Maintenance Log
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                Track service records, schedule repairs, and manage garage operations
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
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
              Log Service
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Critical / Overdue', value: '2', icon: 'warning', color: 'var(--color-error)', bg: 'var(--color-error-container)' },
              { label: 'In Progress', value: '1', icon: 'build_circle', color: 'var(--color-primary)', bg: 'var(--color-primary-fixed)' },
              { label: 'Scheduled', value: '8', icon: 'calendar_month', color: '#b45309', bg: '#fef3c7' },
              { label: 'Completed (MTD)', value: '24', icon: 'verified', color: '#15803d', bg: '#dcfce7' },
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

          {/* Maintenance Table */}
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
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary)' }}>Service Records</h3>
              <div className="flex gap-2">
                <button className="p-2 rounded-lg" style={{ color: 'var(--color-outline)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
                <button className="p-2 rounded-lg" style={{ color: 'var(--color-outline)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  <span className="material-symbols-outlined">download</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                    {['Log ID', 'Vehicle', 'Service Type', 'Priority', 'Status', 'Assigned To', 'Due Date', 'Est. Cost', 'Actions'].map((col, i) => (
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
                  {maintenanceLogs.map((m, i) => (
                    <tr
                      key={m.id}
                      style={{
                        backgroundColor: i % 2 === 1 ? 'rgba(244, 243, 250, 0.4)' : 'transparent',
                        borderTop: '1px solid rgba(197, 197, 211, 0.3)',
                        transition: 'background-color 0.15s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 225, 255, 0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = i % 2 === 1 ? 'rgba(244, 243, 250, 0.4)' : 'transparent'}
                    >
                      <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>{m.id}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>{m.vehicle}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-on-surface)' }}>{m.type}</p>
                        <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>{m.notes}</p>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span
                          className="px-2.5 py-0.5 rounded-full"
                          style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: priorityConfig[m.priority].color,
                            backgroundColor: priorityConfig[m.priority].bg,
                          }}
                        >
                          {m.priority}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span className={`${statusConfig[m.status].class} px-2.5 py-0.5 rounded-full`} style={{ fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap' }}>
                          {m.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '14px', color: 'var(--color-on-surface)' }}>{m.assignedTo}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>{m.dueDate}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface)' }}>{m.cost}</td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
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
                Showing 7 of 35 records
              </p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((p) => (
                  <button
                    key={p}
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
