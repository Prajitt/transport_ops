'use client';

import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const fuelExpenses = [
  { id: 'EXP-1041', date: '2025-07-11', vehicle: '#4022', driver: 'Sam Wilson', type: 'Electric Charge', amount: '$28.40', liters: '95 kWh', station: 'Depot Charger A', odometer: '42,310' },
  { id: 'EXP-1040', date: '2025-07-11', vehicle: '#4015', driver: 'Marcus Reed', type: 'Diesel', amount: '$124.80', liters: '58.3L', station: 'Shell - N. Blvd', odometer: '98,450' },
  { id: 'EXP-1039', date: '2025-07-11', vehicle: '#108', driver: 'Elena Cruz', type: 'Gasoline', amount: '$68.50', liters: '41.2L', station: 'BP West Hub', odometer: '28,600' },
  { id: 'EXP-1038', date: '2025-07-10', vehicle: '#4019', driver: 'David Kim', type: 'Diesel', amount: '$138.20', liters: '64.6L', station: 'Truck Stop I-95', odometer: '122,300' },
  { id: 'EXP-1037', date: '2025-07-10', vehicle: '#105', driver: 'Jordan Lee', type: 'Gasoline', amount: '$72.30', liters: '43.5L', station: 'Exxon Downtown', odometer: '35,100' },
  { id: 'EXP-1036', date: '2025-07-10', vehicle: '#4030', driver: '—', type: 'Electric Charge', amount: '$31.20', liters: '104 kWh', station: 'Depot Charger B', odometer: '18,750' },
  { id: 'EXP-1035', date: '2025-07-09', vehicle: '#4018', driver: 'David Kim', type: 'Diesel', amount: '$115.60', liters: '54.1L', station: 'Shell - S. Station', odometer: '71,200' },
];

const fuelTypeColor = {
  'Electric Charge': { color: 'var(--color-secondary)', bg: 'rgba(134, 242, 228, 0.2)' },
  'Diesel': { color: 'var(--color-primary)', bg: 'rgba(220, 225, 255, 0.3)' },
  'Gasoline': { color: '#b45309', bg: '#fef3c7' },
};

const monthlyData = [
  { month: 'Jan', amount: 8420 },
  { month: 'Feb', amount: 7980 },
  { month: 'Mar', amount: 9240 },
  { month: 'Apr', amount: 8800 },
  { month: 'May', amount: 10200 },
  { month: 'Jun', amount: 9600 },
  { month: 'Jul', amount: 4200 },
];

const maxAmount = Math.max(...monthlyData.map(d => d.amount));

export default function FuelPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <Sidebar activePath="/fuel" />
      <main className="ml-60 min-h-screen flex flex-col">
        <TopBar />

        <div className="flex-1 p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)', lineHeight: '32px' }}>
                Fuel & Expenses
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>
                Track fuel consumption, costs, and operational expenses
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
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                Export Report
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
                Log Expense
              </button>
            </div>
          </div>

          {/* KPI Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'This Month', value: '$4,200', icon: 'payments', color: 'var(--color-primary)', bg: 'var(--color-primary-fixed)', trend: '+3.2% vs last month' },
              { label: 'Avg Cost/Trip', value: '$79.25', icon: 'local_gas_station', color: 'var(--color-secondary)', bg: 'var(--color-secondary-fixed)', trend: '-1.4% vs last month' },
              { label: 'Fuel Efficiency', value: '8.4 MPG', icon: 'speed', color: '#15803d', bg: '#dcfce7', trend: '↑ Improving trend' },
              { label: 'Electric Savings', value: '$1,240', icon: 'bolt', color: '#b45309', bg: '#fef3c7', trend: 'vs diesel equivalent' },
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
                <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>
                  {s.label}
                </p>
                <p style={{ fontSize: '11px', color: 'var(--color-outline)' }}>{s.trend}</p>
              </div>
            ))}
          </div>

          {/* Monthly Chart + Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Monthly Fuel Cost Chart */}
            <div
              className="lg:col-span-8 rounded-xl p-4"
              style={{
                backgroundColor: 'var(--color-surface-container-lowest)',
                border: '1px solid var(--color-outline-variant)',
                boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary)' }}>
                  Monthly Fuel Cost (2025)
                </h3>
                <select style={{ background: 'transparent', border: 'none', fontSize: '12px', fontWeight: '700', color: 'var(--color-secondary)', cursor: 'pointer', outline: 'none' }}>
                  <option>2025</option>
                  <option>2024</option>
                </select>
              </div>
              <div style={{ height: '160px', display: 'flex', alignItems: 'flex-end', gap: '12px', padding: '0 8px' }}>
                {monthlyData.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center group" style={{ cursor: 'pointer' }}>
                    <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: 'var(--color-outline)', marginBottom: '4px' }}>
                      ${(d.amount / 1000).toFixed(1)}k
                    </span>
                    <div
                      className="chart-bar w-full rounded-t-lg"
                      style={{
                        height: `${(d.amount / maxAmount) * 100}%`,
                        backgroundColor: d.month === 'Jul' ? 'var(--color-secondary)' : 'var(--color-primary-container)',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = d.month === 'Jul' ? 'var(--color-secondary)' : 'var(--color-primary-container)'}
                    />
                    <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-outline)', marginTop: '6px', letterSpacing: '0.05em' }}>
                      {d.month}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fuel Type Breakdown */}
            <div
              className="lg:col-span-4 rounded-xl p-4"
              style={{
                backgroundColor: 'var(--color-surface-container-lowest)',
                border: '1px solid var(--color-outline-variant)',
                boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '16px' }}>
                Cost Breakdown
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Diesel', pct: 52, amount: '$2,184', color: 'var(--color-primary)' },
                  { label: 'Gasoline', pct: 30, amount: '$1,260', color: '#b45309' },
                  { label: 'Electric Charging', pct: 18, amount: '$756', color: 'var(--color-secondary)' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-1">
                      <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-on-surface)' }}>{item.label}</span>
                      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface)' }}>
                        {item.amount} <span style={{ color: 'var(--color-outline)', fontWeight: '400' }}>({item.pct}%)</span>
                      </span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'var(--color-surface-container)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ width: `${item.pct}%`, height: '100%', backgroundColor: item.color, borderRadius: '9999px', transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '24px', padding: '16px', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '8px' }}>
                <p style={{ fontSize: '12px', color: 'var(--color-outline)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  July Budget Status
                </p>
                <div className="flex justify-between mb-2">
                  <span style={{ fontSize: '14px', color: 'var(--color-on-surface)' }}>$4,200 / $8,500</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', color: 'var(--color-secondary)' }}>49.4%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--color-surface-container)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: '49.4%', height: '100%', backgroundColor: 'var(--color-secondary)', borderRadius: '9999px' }} />
                </div>
                <p style={{ fontSize: '12px', color: 'var(--color-outline)', marginTop: '6px' }}>$4,300 remaining budget</p>
              </div>
            </div>
          </div>

          {/* Expense Table */}
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
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary)' }}>Transaction Log</h3>
              <button className="p-2 rounded-lg" style={{ color: 'var(--color-outline)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                    {['Exp. ID', 'Date', 'Vehicle', 'Driver', 'Type', 'Quantity', 'Station', 'Odometer', 'Amount', 'Actions'].map((col, i) => (
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
                  {fuelExpenses.map((e, i) => (
                    <tr
                      key={e.id}
                      style={{
                        backgroundColor: i % 2 === 1 ? 'rgba(244, 243, 250, 0.4)' : 'transparent',
                        borderTop: '1px solid rgba(197, 197, 211, 0.3)',
                        transition: 'background-color 0.15s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(ev) => ev.currentTarget.style.backgroundColor = 'rgba(220, 225, 255, 0.15)'}
                      onMouseLeave={(ev) => ev.currentTarget.style.backgroundColor = i % 2 === 1 ? 'rgba(244, 243, 250, 0.4)' : 'transparent'}
                    >
                      <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>{e.id}</td>
                      <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>{e.date}</td>
                      <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>{e.vehicle}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--color-on-surface)' }}>{e.driver}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span
                          className="px-2.5 py-0.5 rounded-full"
                          style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: fuelTypeColor[e.type]?.color || 'var(--color-on-surface)',
                            backgroundColor: fuelTypeColor[e.type]?.bg || 'transparent',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {e.type}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface)' }}>{e.liters}</td>
                      <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--color-on-surface)' }}>{e.station}</td>
                      <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>{e.odometer}</td>
                      <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', color: 'var(--color-on-surface)' }}>{e.amount}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}
                          onMouseEnter={(ev) => ev.currentTarget.style.color = 'var(--color-primary)'}
                          onMouseLeave={(ev) => ev.currentTarget.style.color = 'var(--color-outline)'}
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
                Showing 7 of 53 transactions this month
              </p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((p) => (
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
