'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const fuelTypeColor = {
  'Electric Charge': { color: 'var(--color-secondary)', bg: 'rgba(134, 242, 228, 0.2)' },
  Diesel: { color: 'var(--color-primary)', bg: 'rgba(220, 225, 255, 0.3)' },
  Gasoline: { color: '#b45309', bg: '#fef3c7' },
};

export default function FuelPage() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    vehicle: '', driver: '', type: 'Diesel', quantity: '',
    station: '', odometer: '', amount: ''
  });

  const menuRef = useRef(null);

  async function fetchFuel() {
    setLoading(true);
    try {
      const typeParam = activeFilter === 'All' ? 'all' : activeFilter.toLowerCase().replace(' ', '-');
      const res = await fetch(`/api/fuel?type=${typeParam}&limit=100`);
      const data = await res.json();
      setExpenses(data.data || []);
      setSummary(data.summary || {});
      setMonthlyData(data.monthly || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFuel();
  }, [activeFilter]);

  // Check URL queries
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('modal') === 'log-expense') {
        setShowAddModal(true);
      }
    }
  }, []);

  useEffect(() => {
    function clickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/fuel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount || '0'),
          odometer: parseInt(formData.odometer || '0')
        }),
      });
      if (res.ok) {
        const body = await res.json();
        setShowAddModal(false);
        // Refresh local expenses state list
        setExpenses(prev => [
          {
            ...body.expense,
            amount: `$${formData.amount}`,
            liters: formData.quantity
          },
          ...prev
        ]);
        // Reset form
        setFormData({
          vehicle: '', driver: '', type: 'Diesel', quantity: '',
          station: '', odometer: '', amount: ''
        });
        // Clear query parameters
        if (window.history.pushState) {
          const newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
          window.history.pushState({path:newurl},'',newurl);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Exp ID', 'Date', 'Vehicle ID', 'Driver Name', 'Fuel Type', 'Quantity', 'Station', 'Odometer', 'Amount'];
    const rows = expenses.map(e => [e.id, e.date, e.vehicle, e.driver, e.type, e.quantity || e.liters, e.station, e.odometer, e.amount]);
    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(ev => ev.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `fuel_expenses_report_${activeFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const maxAmount = Math.max(...monthlyData.map(d => d.total)) || 10000;

  // Pagination logic
  const itemsPerPage = 8;
  const totalPages = Math.ceil(expenses.length / itemsPerPage) || 1;
  const paginatedExpenses = expenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 border border-solid border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer bg-white text-xs font-semibold"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                Export Report
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 border-none rounded-lg cursor-pointer text-white text-xs font-semibold bg-primary"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                Log Expense
              </button>
            </div>
          </div>

          {/* KPI Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'This Month', value: `$${summary.currentMonthTotal || '4,200'}`, icon: 'payments', color: 'var(--color-primary)', bg: 'var(--color-primary-fixed)', trend: '+3.2% vs last month' },
              { label: 'Avg Cost/Trip', value: `$${summary.avgCostPerTrip || '79.25'}`, icon: 'local_gas_station', color: 'var(--color-secondary)', bg: 'var(--color-secondary-fixed)', trend: '-1.4% vs last month' },
              { label: 'Fuel Efficiency', value: `${summary.avgEfficiency || '8.4'} MPG`, icon: 'speed', color: '#15803d', bg: '#dcfce7', trend: '↑ Improving trend' },
              { label: 'Electric Savings', value: `$${summary.electricSavings || '1,240'}`, icon: 'bolt', color: '#b45309', bg: '#fef3c7', trend: 'vs diesel equivalent' },
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
                      ${(d.total / 1000).toFixed(1)}k
                    </span>
                    <div
                      className="chart-bar w-full rounded-t-lg"
                      style={{
                        height: `${(d.total / maxAmount) * 100}%`,
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
                  { label: 'Diesel', pct: summary.dieselPct || 52, amount: `$${Math.round(summary.currentMonthTotal * (summary.dieselPct || 52) / 100)}`, color: 'var(--color-primary)' },
                  { label: 'Gasoline', pct: summary.gasolinePct || 30, amount: `$${Math.round(summary.currentMonthTotal * (summary.gasolinePct || 30) / 100)}`, color: '#b45309' },
                  { label: 'Electric Charging', pct: summary.electricPct || 18, amount: `$${Math.round(summary.currentMonthTotal * (summary.electricPct || 18) / 100)}`, color: 'var(--color-secondary)' },
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
                  <span style={{ fontSize: '14px', color: 'var(--color-on-surface)' }}>${summary.currentMonthTotal || '4,200'} / ${summary.budget || '8,500'}</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', color: 'var(--color-secondary)' }}>{summary.budgetUsed || '49.4'}%</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--color-surface-container)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${summary.budgetUsed || 49.4}%`, height: '100%', backgroundColor: 'var(--color-secondary)', borderRadius: '9999px' }} />
                </div>
                <p style={{ fontSize: '12px', color: 'var(--color-outline)', marginTop: '6px' }}>${(summary.budget || 8500) - (summary.currentMonthTotal || 4200)} remaining budget</p>
              </div>
            </div>
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
              Filter by Type:
            </div>
            {['All', 'Diesel', 'Gasoline', 'Electric Charge'].map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setCurrentPage(1);
                }}
                className="px-3 py-1 rounded-full transition-all border-none font-semibold text-xs cursor-pointer"
                style={{
                  backgroundColor: activeFilter === filter ? 'var(--color-primary)' : 'transparent',
                  color: activeFilter === filter ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                  border: activeFilter === filter ? 'none' : '1px solid var(--color-outline-variant)',
                }}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Expense Table */}
          {loading ? (
            <div className="p-12 text-center text-sm font-semibold" style={{ color: 'var(--color-outline)' }}>
              Loading Transactions...
            </div>
          ) : (
            <div
              className="rounded-xl overflow-hidden"
              style={{
                backgroundColor: 'var(--color-surface-container-lowest)',
                border: '1px solid var(--color-outline-variant)',
                boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
              }}
            >
              <div className="overflow-x-auto relative" ref={menuRef}>
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
                    {paginatedExpenses.map((e, i) => (
                      <tr
                        key={e.id}
                        style={{
                          backgroundColor: i % 2 === 1 ? 'rgba(244, 243, 250, 0.4)' : 'transparent',
                          borderTop: '1px solid rgba(197, 197, 211, 0.3)',
                          transition: 'background-color 0.15s',
                        }}
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
                        <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface)' }}>{e.liters || e.quantity}</td>
                        <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--color-on-surface)' }}>{e.station}</td>
                        <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>{e.odometer?.toLocaleString()} mi</td>
                        <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', color: 'var(--color-on-surface)' }}>{typeof e.amount === 'string' ? e.amount : `$${e.amount?.toFixed(2)}`}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', position: 'relative' }}>
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === e.id ? null : e.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}
                            onMouseEnter={(ev) => ev.currentTarget.style.color = 'var(--color-primary)'}
                            onMouseLeave={(ev) => ev.currentTarget.style.color = 'var(--color-outline)'}
                          >
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>

                          {activeMenuId === e.id && (
                            <div
                              className="absolute right-6 mt-1 w-32 rounded-lg py-1 shadow-lg z-30"
                              style={{
                                backgroundColor: 'var(--color-surface-container-lowest)',
                                border: '1px solid var(--color-outline-variant)',
                              }}
                            >
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  alert(`Viewing receipt for ${e.id}: ${e.receiptNo || 'N/A'}`);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                              >
                                View Receipt
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  alert(`Editing transaction record ${e.id}`);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                              >
                                Edit Record
                              </button>
                            </div>
                          )}
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
                  Showing {paginatedExpenses.length} of {expenses.length} transactions
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      color: currentPage === 1 ? 'var(--color-outline-variant)' : 'var(--color-primary)',
                      fontWeight: '700',
                      fontSize: '12px',
                    }}
                  >
                    Previous
                  </button>
                  <span style={{ fontSize: '12px', color: 'var(--color-outline)' }}>
                    Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                  </span>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      color: currentPage === totalPages ? 'var(--color-outline-variant)' : 'var(--color-primary)',
                      fontWeight: '700',
                      fontSize: '12px',
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Log Expense Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 100,
        }}>
          <div style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            border: '1px solid var(--color-outline-variant)',
            borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '500px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-primary)' }}>Log Fuel Expense</h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Vehicle ID</label>
                  <input
                    required type="text" placeholder="#4015"
                    value={formData.vehicle} onChange={e => setFormData({ ...formData, vehicle: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Fuel Type</label>
                  <select
                    value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Gasoline">Gasoline</option>
                    <option value="Electric Charge">Electric Charge</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Quantity (L / kWh)</label>
                  <input
                    required type="text" placeholder="58.3L"
                    value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Cost / Amount ($)</label>
                  <input
                    required type="number" step="0.01" placeholder="124.80"
                    value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Odometer (mi)</label>
                  <input
                    required type="number" placeholder="98450"
                    value={formData.odometer} onChange={e => setFormData({ ...formData, odometer: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Filling Station</label>
                  <input
                    required type="text" placeholder="Shell - N. Blvd"
                    value={formData.station} onChange={e => setFormData({ ...formData, station: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Driver Name</label>
                <input
                  required type="text" placeholder="Marcus Reed"
                  value={formData.driver} onChange={e => setFormData({ ...formData, driver: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                <button
                  type="button" onClick={() => setShowAddModal(false)}
                  style={{ padding: '8px 16px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px', cursor: 'pointer', background: 'transparent' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '8px 20px', borderRadius: '6px', cursor: 'pointer', border: 'none', backgroundColor: 'var(--color-primary)', color: '#fff', fontWeight: '600' }}
                >
                  Log Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
