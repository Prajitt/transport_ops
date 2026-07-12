'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, active, completed
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const menuRef = useRef(null);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await fetch('/api/dashboard');
        const d = await res.json();
        setData(d);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
        setLoading(false);
      }
    }
    fetchDashboard();

    // Close action menus when clicking outside
    function clickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener('mousedown', clickOutside);
    return () => document.removeEventListener('mousedown', clickOutside);
  }, []);

  if (loading) {
    return (
      <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', display: 'flex' }}>
        <Sidebar activePath="/" />
        <main className="ml-60 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="material-symbols-outlined animate-spin" style={{ fontSize: '48px', color: 'var(--color-primary)' }}>
              progress_activity
            </span>
            <p style={{ fontSize: '14px', color: 'var(--color-outline)', fontWeight: '600' }}>Loading Fleet Operations...</p>
          </div>
        </main>
      </div>
    );
  }

  const kpis = data?.kpi || {};
  const weeklyData = data?.weeklyTrips || [];
  const fuel = data?.fuelEfficiency || {};
  const alerts = data?.alerts || { count: 0, licenses: [], maintenance: [] };
  const allTrips = data?.recentTrips || [];

  // Filter trips based on active status tab
  const filteredTrips = allTrips.filter(trip => {
    if (activeTab === 'active') {
      return trip.status === 'In Progress' || trip.status === 'Dispatched';
    }
    if (activeTab === 'completed') {
      return trip.status === 'Completed';
    }
    return true;
  });

  // Paginate filtered trips
  const totalPages = Math.ceil(filteredTrips.length / itemsPerPage) || 1;
  const paginatedTrips = filteredTrips.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDownloadCSV = () => {
    const headers = ['Trip ID', 'Vehicle', 'Driver', 'Status', 'From', 'To'];
    const rows = filteredTrips.map(t => [t.id, t.vehicle, t.driver, t.status, t.from, t.to]);
    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `recent_trips_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const kpiCards = [
    {
      icon: 'local_shipping',
      iconColor: 'var(--color-primary)',
      iconBg: 'var(--color-primary-fixed)',
      label: 'Total Vehicles',
      value: kpis.totalVehicles?.toString() || '42',
      badge: kpis.vehicleTrend || '+2.4%',
      badgeColor: 'var(--color-on-secondary-container)',
      badgeBg: 'rgba(134, 242, 228, 0.2)',
      meta: 'Last updated: 2m ago',
    },
    {
      icon: 'near_me',
      iconColor: 'var(--color-secondary)',
      iconBg: 'var(--color-secondary-fixed)',
      label: 'Active Trips',
      value: kpis.activeTrips?.toString() || '12',
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
      value: kpis.driversOnDuty?.toString() || '18',
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
      value: kpis.utilizationLabel || 'Optimized',
      badge: `${kpis.fleetUtilization || 84}%`,
      badgeColor: 'var(--color-on-secondary-container)',
      badgeBg: 'transparent',
      meta: null,
      progress: kpis.fleetUtilization || 84,
    },
  ];

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
              Last sync: Just now
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
                  {weeklyData.map((d) => {
                    const maxCompleted = Math.max(...weeklyData.map(w => w.completed)) || 100;
                    const pct = (d.completed / maxCompleted) * 100;
                    return (
                      <div key={d.day} className="flex-1 flex flex-col items-center group" style={{ cursor: 'pointer' }}>
                        <div
                          className="chart-bar w-full rounded-t-lg"
                          style={{
                            height: `${pct}%`,
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
                    );
                  })}
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
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '500', color: 'var(--color-on-surface)' }}>{fuel.avgMPG || '8.4'} MPG</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Best Vehicle</span>
                    <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '500', color: 'var(--color-secondary)' }}>{fuel.bestVehicle || '#4022 Electric'}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: 'var(--color-outline)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trend</span>
                    <p style={{ fontSize: '13px', fontWeight: '500', color: '#15803d' }}>↑ {fuel.trend || '+12.3%'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts Panel - 4 cols */}
            <div className="lg:col-span-4">
              <div
                className="rounded-xl p-4 h-full"
                style={{
                  backgroundColor: 'var(--color-surface-container-lowest)',
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
                    {alerts.count} Alerts
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Licenses Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-outline)', letterSpacing: '0.05em' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>priority_high</span>
                      Expiring Licenses ({alerts.licenses?.length || 0})
                    </div>

                    {alerts.licenses?.map((l, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-r-lg"
                        style={{
                          backgroundColor: l.urgent ? 'rgba(255, 218, 214, 0.3)' : 'var(--color-surface-container)',
                          borderLeft: `4px solid ${l.urgent ? 'var(--color-error)' : 'var(--color-outline)'}`,
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-on-surface)' }}>{l.name}</p>
                            <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{l.license} - Expires in {l.expiresIn} days</p>
                          </div>
                          <button
                            onClick={() => window.location.href = `/drivers?search=${l.name}`}
                            style={{ color: l.urgent ? 'var(--color-error)' : 'var(--color-primary)', fontWeight: '700', fontSize: '10px', textTransform: 'uppercase', cursor: 'pointer', background: 'none', border: 'none' }}
                          >
                            {l.urgent ? 'Renew' : 'Notify'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Maintenance Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2" style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-outline)', letterSpacing: '0.05em' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>build_circle</span>
                      Due Maintenance ({alerts.maintenance?.length || 0})
                    </div>

                    {alerts.maintenance?.map((m, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-r-lg"
                        style={{
                          backgroundColor: m.urgent ? 'rgba(243, 148, 97, 0.05)' : 'var(--color-surface-container)',
                          borderLeft: `4px solid ${m.urgent ? 'var(--color-on-tertiary-container)' : 'var(--color-outline)'}`,
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p style={{ fontWeight: '700', fontSize: '14px', color: 'var(--color-on-surface)' }}>{m.vehicle}</p>
                            <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{m.issue}</p>
                          </div>
                          <span className="material-symbols-outlined" style={{ color: m.urgent ? 'var(--color-on-tertiary-container)' : 'var(--color-outline)', fontSize: '20px' }}>
                            schedule
                          </span>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => window.location.href = '/maintenance'}
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
              <div className="flex items-center gap-4">
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary)' }}>
                  Recent Trips
                </h3>
                {/* Active Tabs filters */}
                <div style={{ display: 'flex', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '8px', padding: '2px', gap: '2px' }}>
                  {['all', 'active', 'completed'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab);
                        setCurrentPage(1);
                      }}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: activeTab === tab ? 'var(--color-surface-container-lowest)' : 'transparent',
                        color: activeTab === tab ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                        boxShadow: activeTab === tab ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadCSV}
                  title="Download CSV"
                  className="p-2 transition-colors rounded-lg hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                  style={{ color: 'var(--color-outline)' }}
                >
                  <span className="material-symbols-outlined">download</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto relative" ref={menuRef}>
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
                  {paginatedTrips.map((trip, i) => {
                    let badgeClass = 'badge-in-transit';
                    if (trip.status === 'Dispatched') badgeClass = 'badge-dispatched';
                    if (trip.status === 'Completed') badgeClass = 'badge-completed';
                    if (trip.status === 'Cancelled') badgeClass = 'badge-error';

                    return (
                      <tr
                        key={trip.id}
                        style={{
                          backgroundColor: i % 2 === 1 ? 'rgba(244, 243, 250, 0.4)' : 'transparent',
                          borderTop: '1px solid rgba(197, 197, 211, 0.3)',
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <td style={{ padding: '16px 24px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>
                          {trip.id}
                        </td>
                        <td style={{ padding: '16px 24px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-outline)' }}>
                              {trip.vehicleIcon || 'directions_bus'}
                            </span>
                            {trip.vehicle}
                          </div>
                        </td>
                        <td style={{ padding: '16px 24px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>
                          {trip.driver}
                        </td>
                        <td style={{ padding: '16px 24px' }}>
                          <span
                            className={`${badgeClass} px-2.5 py-0.5 rounded-full`}
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
                        <td style={{ padding: '16px 24px', textAlign: 'right', position: 'relative' }}>
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === trip.id ? null : trip.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-outline)'}
                          >
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>

                          {activeMenuId === trip.id && (
                            <div
                              className="absolute right-6 mt-1 w-36 rounded-lg py-1 shadow-lg z-30"
                              style={{
                                backgroundColor: 'var(--color-surface-container-lowest)',
                                border: '1px solid var(--color-outline-variant)',
                              }}
                            >
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  window.location.href = `/trips?search=${trip.id}`;
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                              >
                                View Details
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  alert(`Quick editing ${trip.id}`);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                              >
                                Edit Trip
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
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
              <p>Showing {paginatedTrips.length} of {filteredTrips.length} active trips</p>
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
                <span className="flex items-center gap-2">
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
        </div>
      </main>
    </div>
  );
}
