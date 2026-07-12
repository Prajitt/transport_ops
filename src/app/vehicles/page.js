'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const statusConfig = {
  'In-Transit': { label: 'In-Transit', class: 'badge-in-transit' },
  Available: { label: 'Available', class: 'badge-available' },
  Maintenance: { label: 'Maintenance', class: 'badge-maintenance' },
  Dispatched: { label: 'Dispatched', class: 'badge-dispatched' },
};

const vehicleTypeIcon = {
  'Electric Bus': 'directions_bus',
  'Standard Bus': 'directions_bus',
  Minivan: 'airport_shuttle',
  SUV: 'directions_car',
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [sortBy, setSortBy] = useState('id'); // id, status, mileage, lastService
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    id: '', type: 'Standard Bus', make: '', year: new Date().getFullYear(),
    status: 'Available', driver: '', mileage: '', lastService: '', plate: ''
  });

  const menuRef = useRef(null);

  // Fetch Vehicles
  async function fetchVehicles() {
    setLoading(true);
    try {
      const filterParam = activeFilter === 'All' ? 'all' : activeFilter;
      const res = await fetch(`/api/vehicles?status=${filterParam}&limit=100`);
      const data = await res.json();
      setVehicles(data.data || []);
      setSummary(data.summary || {});
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVehicles();
  }, [activeFilter]);

  // Check URL query parameters for modal trigger or search query
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('modal') === 'add-vehicle') {
        setShowAddModal(true);
      }
      const searchQuery = params.get('search');
      if (searchQuery) {
        setActiveFilter('All');
        // Let's filter vehicles based on ID matching search
        fetch(`/api/vehicles?limit=100`)
          .then(r => r.json())
          .then(data => {
            const list = data.data || [];
            const matched = list.filter(v => v.id.toLowerCase().includes(searchQuery.toLowerCase()));
            setVehicles(matched);
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
      const res = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowAddModal(false);
        // Refresh local list
        setVehicles(prev => [
          ...prev,
          {
            ...formData,
            mileage: parseInt(formData.mileage || '0'),
          }
        ]);
        // Reset form
        setFormData({
          id: '', type: 'Standard Bus', make: '', year: new Date().getFullYear(),
          status: 'Available', driver: '', mileage: '', lastService: '', plate: ''
        });
        // Clear query parameter if it exists
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
    const headers = ['Vehicle ID', 'Type', 'Make', 'Year', 'Status', 'Driver', 'Mileage', 'Last Service', 'Plate'];
    const rows = sortedVehicles.map(v => [v.id, v.type, v.make, v.year, v.status, v.driver || '—', v.mileage, v.lastService, v.plate]);
    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vehicle_registry_${activeFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Sort logic
  const sortedVehicles = [...vehicles].sort((a, b) => {
    if (sortBy === 'id') return a.id.localeCompare(b.id);
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    if (sortBy === 'mileage') return (a.mileage || 0) - (b.mileage || 0);
    if (sortBy === 'lastService') return new Date(a.lastService || 0) - new Date(b.lastService || 0);
    return 0;
  });

  // Pagination logic
  const itemsPerPage = 8;
  const totalPages = Math.ceil(sortedVehicles.length / itemsPerPage) || 1;
  const paginatedVehicles = sortedVehicles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 transition-all border border-solid border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer bg-white text-xs font-semibold"
                style={{
                  color: 'var(--color-on-surface-variant)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                Export
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 transition-all rounded-lg border-none cursor-pointer text-xs font-semibold text-white bg-primary"
                style={{
                  backgroundColor: 'var(--color-primary)',
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
              { label: 'Total Fleet', value: summary.total || '42', icon: 'directions_bus', color: 'var(--color-primary)', bg: 'var(--color-primary-fixed)' },
              { label: 'Active / In-Transit', value: summary.inTransit || '12', icon: 'near_me', color: 'var(--color-secondary)', bg: 'var(--color-secondary-fixed)' },
              { label: 'In Maintenance', value: summary.maintenance || '3', icon: 'build', color: '#b45309', bg: '#fef3c7' },
              { label: 'Available', value: summary.available || '27', icon: 'check_circle', color: '#15803d', bg: '#dcfce7' },
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
            <div className="ml-auto flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-outline)' }}>sort</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ background: 'transparent', border: 'none', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', cursor: 'pointer', outline: 'none' }}
              >
                <option value="id">Sort: Vehicle ID</option>
                <option value="status">Sort: Status</option>
                <option value="mileage">Sort: Mileage</option>
                <option value="lastService">Sort: Last Service</option>
              </select>
            </div>
          </div>

          {/* Vehicle Table */}
          {loading ? (
            <div className="p-12 text-center text-sm font-semibold" style={{ color: 'var(--color-outline)' }}>
              Loading Fleet Registry...
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
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedVehicles.map((v, i) => (
                      <tr
                        key={v.id}
                        style={{
                          backgroundColor: i % 2 === 1 ? 'rgba(244, 243, 250, 0.4)' : 'transparent',
                          borderTop: '1px solid rgba(197, 197, 211, 0.3)',
                          transition: 'background-color 0.15s',
                        }}
                      >
                        <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>
                          {v.id}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-primary-container)' }}>
                              {vehicleTypeIcon[v.type] || 'directions_bus'}
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
                            className={`${statusConfig[v.status]?.class || 'badge-available'} px-2.5 py-0.5 rounded-full`}
                            style={{ fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap' }}
                          >
                            {v.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: '14px', color: !v.driver ? 'var(--color-outline)' : 'var(--color-on-surface)' }}>
                          {v.driver || '—'}
                        </td>
                        <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface)' }}>
                          {v.mileage?.toLocaleString()} mi
                        </td>
                        <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>
                          {v.lastService}
                        </td>
                        <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface)' }}>
                          {v.plate}
                        </td>
                        <td style={{ padding: '14px 20px', textAlign: 'right', position: 'relative' }}>
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === v.id ? null : v.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)', padding: '4px' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-outline)'}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                          </button>

                          {activeMenuId === v.id && (
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
                                  alert(`Previewing vehicle ${v.id}`);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                              >
                                Preview
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  alert(`Editing vehicle ${v.id}`);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                              >
                                Edit
                              </button>
                            </div>
                          )}
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
                  Showing {paginatedVehicles.length} of {sortedVehicles.length} vehicles
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

      {/* Add Vehicle Modal */}
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
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-primary)' }}>Add New Vehicle</h3>
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
                    required type="text" placeholder="#4099"
                    value={formData.id} onChange={e => setFormData({ ...formData, id: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Type</label>
                  <select
                    value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  >
                    {Object.keys(vehicleTypeIcon).map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Make / Model</label>
                  <input
                    required type="text" placeholder="BYD K9"
                    value={formData.make} onChange={e => setFormData({ ...formData, make: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Year</label>
                  <input
                    required type="number" placeholder="2025"
                    value={formData.year} onChange={e => setFormData({ ...formData, year: parseInt(e.target.value || '2025') })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>License Plate</label>
                  <input
                    required type="text" placeholder="TX-9900-B"
                    value={formData.plate} onChange={e => setFormData({ ...formData, plate: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Mileage</label>
                  <input
                    required type="number" placeholder="10000"
                    value={formData.mileage} onChange={e => setFormData({ ...formData, mileage: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Assigned Driver</label>
                  <input
                    type="text" placeholder="Sam Wilson"
                    value={formData.driver} onChange={e => setFormData({ ...formData, driver: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Last Service Date</label>
                  <input
                    required type="date"
                    value={formData.lastService} onChange={e => setFormData({ ...formData, lastService: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
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
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
