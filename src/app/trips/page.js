'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const statusConfig = {
  'In Progress': { class: 'badge-in-transit' },
  Dispatched: { class: 'badge-dispatched' },
  Completed: { class: 'badge-completed' },
  Cancelled: { class: 'badge-error' },
};

export default function TripsPage() {
  const [trips, setTrips] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All'); // All, Active, Completed
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [formData, setFormData] = useState({
    vehicle: '', driver: '', routeId: 'RT-01', from: '', to: '',
    scheduledDepart: '', scheduledArrive: '', distanceMi: '', passengers: ''
  });

  const menuRef = useRef(null);

  async function fetchTrips() {
    setLoading(true);
    try {
      const filterParam = activeTab === 'All' ? 'all' : activeTab.toLowerCase();
      const res = await fetch(`/api/trips?status=${filterParam}&limit=100`);
      const data = await res.json();
      setTrips(data.data || []);
      setSummary(data.summary || {});
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrips();
  }, [activeTab]);

  // Check URL queries
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('modal') === 'create-trip') {
        setShowAddModal(true);
      }
      const searchQuery = params.get('search');
      if (searchQuery) {
        setActiveTab('All');
        fetch(`/api/trips?limit=100`)
          .then(r => r.json())
          .then(data => {
            const list = data.data || [];
            const matched = list.filter(t => t.id.toLowerCase().includes(searchQuery.toLowerCase()));
            setTrips(matched);
          });
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
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          distanceMi: parseFloat(formData.distanceMi || '0'),
          passengers: parseInt(formData.passengers || '0')
        }),
      });
      if (res.ok) {
        const body = await res.json();
        setShowAddModal(false);
        // Refresh local trips list
        setTrips(prev => [body.trip, ...prev]);
        // Reset form
        setFormData({
          vehicle: '', driver: '', routeId: 'RT-01', from: '', to: '',
          scheduledDepart: '', scheduledArrive: '', distanceMi: '', passengers: ''
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
    const headers = ['Trip ID', 'Vehicle', 'Driver', 'Status', 'Route ID', 'From', 'To', 'Depart', 'Arrive', 'Distance', 'Passengers'];
    const rows = trips.map(t => [t.id, t.vehicle, t.driver, t.status, t.routeId, t.from, t.to, t.scheduledDepart || t.depart, t.scheduledArrive || t.arrive, `${t.distanceMi || t.distance}`, t.passengers]);
    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `trip_records_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination logic
  const itemsPerPage = 8;
  const totalPages = Math.ceil(trips.length / itemsPerPage) || 1;
  const paginatedTrips = trips.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const hours = Array.from({ length: 12 }, (_, i) => `${i + 6}:00`);

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
                onClick={() => setShowScheduleModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-solid border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer bg-white text-xs font-semibold"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>calendar_month</span>
                Schedule View
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 border-none rounded-lg cursor-pointer text-white text-xs font-semibold bg-primary"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                Create Trip
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Trips', value: summary.active || '12', icon: 'near_me', color: 'var(--color-secondary)', bg: 'var(--color-secondary-fixed)' },
              { label: 'Dispatched', value: summary.dispatched || '5', icon: 'send', color: 'var(--color-primary)', bg: 'var(--color-primary-fixed)' },
              { label: 'Completed Today', value: summary.completed || '34', icon: 'check_circle', color: '#15803d', bg: '#dcfce7' },
              { label: 'Cancelled Today', value: summary.cancelled || '2', icon: 'cancel', color: '#b45309', bg: '#fef3c7' },
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
                  {['All', 'Active', 'Completed'].map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setActiveTab(f);
                        setCurrentPage(1);
                      }}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: activeTab === f ? 'var(--color-surface-container-lowest)' : 'transparent',
                        color: activeTab === f ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                        boxShadow: activeTab === f ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleExportCSV}
                  className="p-2 rounded-lg border-none bg-transparent cursor-pointer"
                  style={{ color: 'var(--color-outline)' }}
                >
                  <span className="material-symbols-outlined">download</span>
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-12 text-center text-sm font-semibold" style={{ color: 'var(--color-outline)' }}>
                Loading Trips...
              </div>
            ) : (
              <div className="overflow-x-auto relative" ref={menuRef}>
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
                    {paginatedTrips.map((t, i) => {
                      const departTime = t.scheduledDepart || t.depart;
                      const arriveTime = t.scheduledArrive || t.arrive;
                      return (
                        <tr
                          key={t.id}
                          style={{
                            backgroundColor: i % 2 === 1 ? 'rgba(244, 243, 250, 0.4)' : 'transparent',
                            borderTop: '1px solid rgba(197, 197, 211, 0.3)',
                            transition: 'background-color 0.15s',
                            opacity: t.status === 'Cancelled' ? 0.7 : 1,
                          }}
                        >
                          <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>{t.id}</td>
                          <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>{t.vehicle}</td>
                          <td style={{ padding: '14px 16px', fontSize: '14px', color: 'var(--color-on-surface)' }}>{t.driver}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <span className={`${statusConfig[t.status]?.class || 'badge-in-transit'} px-2.5 py-0.5 rounded-full`} style={{ fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap' }}>
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
                          <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface)' }}>{departTime}</td>
                          <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>{arriveTime}</td>
                          <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface)' }}>{t.distanceMi || t.distance} mi</td>
                          <td style={{ padding: '14px 16px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface)' }}>{t.passengers}</td>
                          <td style={{ padding: '14px 16px', textAlign: 'right', position: 'relative' }}>
                            <button
                              onClick={() => setActiveMenuId(activeMenuId === t.id ? null : t.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-outline)'}
                            >
                              <span className="material-symbols-outlined">more_vert</span>
                            </button>

                            {activeMenuId === t.id && (
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
                                    alert(`Dispatched/Cancel active action for ${t.id}`);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                                >
                                  Manage Dispatch
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    alert(`Trip ID ${t.id} details page routing`);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                                >
                                  View Details
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
            )}

            <div
              className="p-4 flex justify-between items-center"
              style={{ backgroundColor: 'var(--color-surface-container-low)', borderTop: '1px solid var(--color-outline-variant)' }}
            >
              <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-outline)', letterSpacing: '0.05em' }}>
                Showing {paginatedTrips.length} of {trips.length} trips
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
        </div>
      </main>

      {/* Create Trip Modal */}
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
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-primary)' }}>Create New Trip</h3>
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Vehicle</label>
                  <input
                    required type="text" placeholder="#4022"
                    value={formData.vehicle} onChange={e => setFormData({ ...formData, vehicle: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Driver</label>
                  <input
                    required type="text" placeholder="Sam Wilson"
                    value={formData.driver} onChange={e => setFormData({ ...formData, driver: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Route ID</label>
                  <input
                    required type="text" placeholder="RT-12"
                    value={formData.routeId} onChange={e => setFormData({ ...formData, routeId: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Passengers</label>
                  <input
                    required type="number" placeholder="25"
                    value={formData.passengers} onChange={e => setFormData({ ...formData, passengers: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>From Depot</label>
                  <input
                    required type="text" placeholder="North Depot"
                    value={formData.from} onChange={e => setFormData({ ...formData, from: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>To Destination</label>
                  <input
                    required type="text" placeholder="Downtown Terminal"
                    value={formData.to} onChange={e => setFormData({ ...formData, to: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Depart Time</label>
                  <input
                    required type="text" placeholder="08:30"
                    value={formData.scheduledDepart} onChange={e => setFormData({ ...formData, scheduledDepart: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Arrive Time</label>
                  <input
                    required type="text" placeholder="09:15"
                    value={formData.scheduledArrive} onChange={e => setFormData({ ...formData, scheduledArrive: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Distance (mi)</label>
                <input
                  required type="number" step="0.1" placeholder="18.2"
                  value={formData.distanceMi} onChange={e => setFormData({ ...formData, distanceMi: e.target.value })}
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
                  Create & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule View Modal */}
      {showScheduleModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 100,
        }}>
          <div style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            border: '1px solid var(--color-outline-variant)',
            borderRadius: '16px', padding: '24px', width: '90%', maxWidth: '800px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-primary)' }}>Dispatch Schedule View (Daily Timeline)</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            {/* Visual Timeline */}
            <div style={{ overflowX: 'auto', border: '1px solid var(--color-outline-variant)', borderRadius: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '150px repeat(12, 120px)', backgroundColor: 'var(--color-surface-container-low)', borderBottom: '1px solid var(--color-outline-variant)' }}>
                <div style={{ padding: '10px 16px', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)' }}>Driver / Vehicle</div>
                {hours.map(h => (
                  <div key={h} style={{ padding: '10px', fontSize: '11px', fontWeight: '600', color: 'var(--color-outline)', textAlign: 'center', borderLeft: '1px solid var(--color-outline-variant)' }}>
                    {h}
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {trips.slice(0, 5).map(t => (
                  <div key={t.id} style={{ display: 'grid', gridTemplateColumns: '150px repeat(12, 120px)', borderBottom: '1px solid rgba(197,197,211,0.3)', minHeight: '60px', alignItems: 'center' }}>
                    <div style={{ padding: '10px 16px' }}>
                      <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>{t.driver}</p>
                      <p style={{ fontSize: '11px', color: 'var(--color-outline)' }}>{t.vehicle}</p>
                    </div>
                    {/* Time Slot Block */}
                    <div style={{ gridColumn: '2 / span 12', position: 'relative', height: '100%', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                      <div style={{
                        position: 'absolute', left: '15%', right: '45%',
                        backgroundColor: 'var(--color-secondary-container)',
                        color: 'var(--color-on-secondary-container)',
                        borderRadius: '6px', padding: '6px 12px', fontSize: '11px', fontWeight: '600',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                      }}>
                        <p>{t.id} ({t.from} ➔ {t.to})</p>
                        <p style={{ fontSize: '10px', opacity: 0.8 }}>{t.scheduledDepart || t.depart} - {t.scheduledArrive || t.arrive}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                onClick={() => setShowScheduleModal(false)}
                style={{ padding: '8px 24px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--color-primary)', color: '#fff', cursor: 'pointer', fontWeight: '600' }}
              >
                Close Timeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
