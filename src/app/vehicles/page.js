'use client';

import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const vehicles = [
  { id: '#4022', type: 'Electric Bus', make: 'BYD K9', year: 2022, status: 'In-Transit', driver: 'Sam Wilson', mileage: '42,310', lastService: '2025-06-01', plate: 'TX-4022-B' },
  { id: '#4015', type: 'Standard Bus', make: 'Nova LFS', year: 2020, status: 'In-Transit', driver: 'Marcus Reed', mileage: '98,450', lastService: '2025-05-15', plate: 'TX-4015-A' },
  { id: '#4018', type: 'Standard Bus', make: 'Nova LFS', year: 2021, status: 'Available', driver: '—', mileage: '71,200', lastService: '2025-06-20', plate: 'TX-4018-A' },
  { id: '#108', type: 'Minivan', make: 'Ford Transit', year: 2023, status: 'In-Transit', driver: 'Elena Cruz', mileage: '28,600', lastService: '2025-06-25', plate: 'TX-108-V' },
  { id: '#105', type: 'Minivan', make: 'Ford Transit', year: 2022, status: 'Dispatched', driver: 'Jordan Lee', mileage: '35,100', lastService: '2025-06-10', plate: 'TX-105-V' },
  { id: '#4030', type: 'Electric Bus', make: 'BYD K9', year: 2023, status: 'Maintenance', driver: '—', mileage: '18,750', lastService: '2025-07-01', plate: 'TX-4030-B' },
  { id: '#4019', type: 'Standard Bus', make: 'Gillig Advantage', year: 2019, status: 'Available', driver: '—', mileage: '122,300', lastService: '2025-05-30', plate: 'TX-4019-C' },
  { id: '#110', type: 'SUV', make: 'Chevrolet Suburban', year: 2023, status: 'Available', driver: '—', mileage: '12,400', lastService: '2025-07-05', plate: 'TX-110-S' },
];

const statusConfig = {
  'In-Transit': { label: 'In-Transit', class: 'badge-in-transit' },
  'Available': { label: 'Available', class: 'badge-available' },
  'Maintenance': { label: 'Maintenance', class: 'badge-maintenance' },
  'Dispatched': { label: 'Dispatched', class: 'badge-dispatched' },
};

const vehicleTypeIcon = {
  'Electric Bus': 'directions_bus',
  'Standard Bus': 'directions_bus',
  'Minivan': 'airport_shuttle',
  'SUV': 'directions_car',
};

export default function VehiclesPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <Sidebar activePath="/vehicles" />
      <main className="ml-60 min-h-screen flex flex-col">
        <TopBar />

        <div className="flex-1 p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)', lineHeight: '32px' }}>
                Vehicle Registry
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                Manage fleet assets, track status, and maintenance schedules
              </p>
            </div>
            <div className="flex gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 transition-all"
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
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                Export
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 transition-all"
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
                Add Vehicle
              </button>
            </div>
          </div>

          {/* Fleet Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Fleet', value: '42', icon: 'directions_bus', color: 'var(--color-primary)', bg: 'var(--color-primary-fixed)' },
              { label: 'Active / In-Transit', value: '12', icon: 'near_me', color: 'var(--color-secondary)', bg: 'var(--color-secondary-fixed)' },
              { label: 'In Maintenance', value: '3', icon: 'build', color: '#b45309', bg: '#fef3c7' },
              { label: 'Available', value: '27', icon: 'check_circle', color: '#15803d', bg: '#dcfce7' },
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
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="material-symbols-outlined p-1.5 rounded-lg"
                    style={{ color: s.color, backgroundColor: s.bg, fontSize: '20px' }}
                  >
                    {s.icon}
                  </span>
                </div>
                <h3 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--color-on-surface)' }}>{s.value}</h3>
                <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Filter Bar */}
          <div
            className="p-4 rounded-xl flex items-center gap-4 flex-wrap"
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              border: '1px solid var(--color-outline-variant)',
            }}
          >
            <div className="flex items-center gap-2" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-outline)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>filter_list</span>
              Filter by:
            </div>
            {['All', 'Available', 'In-Transit', 'Maintenance', 'Dispatched'].map((filter) => (
              <button
                key={filter}
                className="px-3 py-1 rounded-full transition-all"
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  border: filter === 'All' ? 'none' : '1px solid var(--color-outline-variant)',
                  backgroundColor: filter === 'All' ? 'var(--color-primary)' : 'transparent',
                  color: filter === 'All' ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                  cursor: 'pointer',
                }}
              >
                {filter}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-outline)' }}>sort</span>
              <select style={{ background: 'transparent', border: 'none', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', cursor: 'pointer', outline: 'none' }}>
                <option>Sort: Vehicle ID</option>
                <option>Sort: Status</option>
                <option>Sort: Mileage</option>
                <option>Sort: Last Service</option>
              </select>
            </div>
          </div>

          {/* Vehicle Table */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              border: '1px solid var(--color-outline-variant)',
              boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                    {['Vehicle ID', 'Type / Make', 'Year', 'Status', 'Assigned Driver', 'Mileage', 'Last Service', 'License Plate', 'Actions'].map((col, i) => (
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
                        <div className="flex items-center gap-1">
                          {col}
                          {i < 6 && (
                            <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-secondary)', opacity: 0.5 }}>
                              unfold_more
                            </span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v, i) => (
                    <tr
                      key={v.id}
                      style={{
                        backgroundColor: i % 2 === 1 ? 'rgba(244, 243, 250, 0.4)' : 'transparent',
                        borderTop: '1px solid rgba(197, 197, 211, 0.3)',
                        transition: 'background-color 0.15s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 225, 255, 0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = i % 2 === 1 ? 'rgba(244, 243, 250, 0.4)' : 'transparent'}
                    >
                      <td className="sticky-col" style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>
                        {v.id}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary-container)' }}>
                            {vehicleTypeIcon[v.type]}
                          </span>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-on-surface)' }}>{v.type}</p>
                            <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{v.make}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface)' }}>
                        {v.year}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span
                          className={`${statusConfig[v.status].class} px-2.5 py-0.5 rounded-full`}
                          style={{ fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap' }}
                        >
                          {statusConfig[v.status].label}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontSize: '14px', color: v.driver === '—' ? 'var(--color-outline)' : 'var(--color-on-surface)' }}>
                        {v.driver}
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface)' }}>
                        {v.mileage}
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>
                        {v.lastService}
                      </td>
                      <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface)' }}>
                        {v.plate}
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            title="View Details"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)', padding: '4px' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-outline)'}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>visibility</span>
                          </button>
                          <button
                            title="Edit"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)', padding: '4px' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-secondary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-outline)'}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                          </button>
                          <button
                            title="More Options"
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)', padding: '4px' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-outline)'}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div
              className="p-4 flex justify-between items-center"
              style={{
                backgroundColor: 'var(--color-surface-container-low)',
                borderTop: '1px solid var(--color-outline-variant)',
              }}
            >
              <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-outline)', letterSpacing: '0.05em' }}>
                Showing 8 of 42 vehicles
              </p>
              <div className="flex gap-1">
                {[1, 2, 3, '...', 6].map((p, i) => (
                  <button
                    key={i}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '4px',
                      fontSize: '12px',
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
