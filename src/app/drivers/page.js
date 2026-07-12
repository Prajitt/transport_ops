'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const statusConfig = {
  'On Duty': { style: 'badge-in-transit' },
  Dispatched: { style: 'badge-dispatched' },
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
  const [drivers, setDrivers] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const [formData, setFormData] = useState({
    name: '', license: 'CDL Class A', status: 'Off Duty', vehicle: '',
    phone: '', licenseExp: '', shift: 'Morning (06:00–14:00)'
  });

  const menuRef = useRef(null);

  async function fetchDrivers() {
    setLoading(true);
    try {
      const filterParam = activeFilter === 'All' ? 'all' : activeFilter;
      const res = await fetch(`/api/drivers?status=${filterParam}&limit=100`);
      const data = await res.json();
      setDrivers(data.data || []);
      setSummary(data.summary || {});
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDrivers();
  }, [activeFilter]);

  // Check URL queries
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('modal') === 'add-driver') {
        setShowAddModal(true);
      }
      const searchQuery = params.get('search');
      if (searchQuery) {
        setActiveFilter('All');
        fetch(`/api/drivers?limit=100`)
          .then(r => r.json())
          .then(data => {
            const list = data.data || [];
            const matched = list.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()));
            setDrivers(matched);
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
      const res = await fetch('/api/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setShowAddModal(false);
        // Refresh local state list
        setDrivers(prev => [
          ...prev,
          {
            ...formData,
            id: `DRV-0${drivers.length + 9}`,
            avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
            trips: 0,
            onTimeRate: 100,
          }
        ]);
        // Reset form
        setFormData({
          name: '', license: 'CDL Class A', status: 'Off Duty', vehicle: '',
          phone: '', licenseExp: '', shift: 'Morning (06:00–14:00)'
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
    const headers = ['Driver Name', 'Driver ID', 'License Type', 'Status', 'Vehicle', 'Total Trips', 'On-Time Rate', 'License Expiry', 'Phone'];
    const rows = drivers.map(d => [d.name, d.id, d.license, d.status, d.vehicle || '—', d.trips || 0, `${d.onTimeRate || 95}%`, d.licenseExp, d.phone]);
    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `driver_roster_${activeFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination logic
  const itemsPerPage = 8;
  const totalPages = Math.ceil(drivers.length / itemsPerPage) || 1;
  const paginatedDrivers = drivers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
            <div className="flex gap-3">
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-2 px-4 py-2 border border-solid border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer bg-white text-xs font-semibold"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                Export
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 border-none rounded-lg cursor-pointer text-white text-xs font-semibold bg-primary"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_add</span>
                Add Driver
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Drivers', value: summary.total || '28', icon: 'group', color: 'var(--color-primary)', bg: 'var(--color-primary-fixed)' },
              { label: 'On Duty', value: summary.onDuty || '18', icon: 'directions_run', color: 'var(--color-secondary)', bg: 'var(--color-secondary-fixed)' },
              { label: 'License Expiring', value: summary.expiringSoon || '3', icon: 'warning', color: '#b45309', bg: '#fef3c7' },
              { label: 'Avg On-Time Rate', value: `${summary.avgOnTimeRate || 94.6}%`, icon: 'schedule', color: '#15803d', bg: '#dcfce7' },
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
            {['All', 'On Duty', 'Dispatched', 'Off Duty', 'On Leave'].map((filter) => (
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

          {/* Drivers Table */}
          {loading ? (
            <div className="p-12 text-center text-sm font-semibold" style={{ color: 'var(--color-outline)' }}>
              Loading Driver Roster...
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
                    {paginatedDrivers.map((d, i) => {
                      const colors = avatarColors[i % avatarColors.length];
                      const isExpiringSoon = new Date(d.licenseExp) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                      const displayRate = `${d.onTimeRate || 95}%`;

                      return (
                        <tr
                          key={d.id}
                          style={{
                            backgroundColor: i % 2 === 1 ? 'rgba(244, 243, 250, 0.4)' : 'transparent',
                            borderTop: '1px solid rgba(197, 197, 211, 0.3)',
                            transition: 'background-color 0.15s',
                          }}
                        >
                          <td style={{ padding: '14px 20px' }}>
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs"
                                style={{ backgroundColor: colors.bg, color: colors.color, flexShrink: 0 }}
                              >
                                {d.avatar || 'DR'}
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
                              className={`${statusConfig[d.status]?.style || 'badge-available'} px-2.5 py-0.5 rounded-full`}
                              style={{ fontSize: '12px', fontWeight: '500' }}
                            >
                              {d.status}
                            </span>
                          </td>
                          <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: !d.vehicle ? 'var(--color-outline)' : 'var(--color-on-surface)' }}>
                            {d.vehicle || '—'}
                          </td>
                          <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface)' }}>
                            {d.trips}
                          </td>
                          <td style={{ padding: '14px 20px' }}>
                            <div className="flex items-center gap-2">
                              <div style={{ width: '60px', height: '4px', backgroundColor: 'var(--color-surface-container)', borderRadius: '9999px', overflow: 'hidden' }}>
                                <div style={{ width: displayRate, height: '100%', backgroundColor: 'var(--color-secondary)', borderRadius: '9999px' }} />
                              </div>
                              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '500', color: 'var(--color-on-surface)' }}>
                                {displayRate}
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
                          <td style={{ padding: '14px 20px', textAlign: 'right', position: 'relative' }}>
                            <button
                              onClick={() => setActiveMenuId(activeMenuId === d.id ? null : d.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)', padding: '4px' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-outline)'}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                            </button>

                            {activeMenuId === d.id && (
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
                                    setSelectedDriver(d);
                                    setShowPreviewModal(true);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                                >
                                  Preview
                                </button>
                                <button
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    alert(`Editing driver profile ${d.name}`);
                                  }}
                                  className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                                >
                                  Edit Profile
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

              <div
                className="p-4 flex justify-between items-center"
                style={{ backgroundColor: 'var(--color-surface-container-low)', borderTop: '1px solid var(--color-outline-variant)' }}
              >
                <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-outline)', letterSpacing: '0.05em' }}>
                  Showing {paginatedDrivers.length} of {drivers.length} drivers
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

      {/* Add Driver Modal */}
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
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-primary)' }}>Add New Driver</h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Driver Name</label>
                <input
                  required type="text" placeholder="Sam Wilson"
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Phone Number</label>
                  <input
                    required type="text" placeholder="+1 (555) 000-0000"
                    value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Shift</label>
                  <input
                    required type="text" placeholder="Morning (06:00–14:00)"
                    value={formData.shift} onChange={e => setFormData({ ...formData, shift: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>License Type</label>
                  <select
                    value={formData.license} onChange={e => setFormData({ ...formData, license: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  >
                    <option value="CDL Class A">CDL Class A</option>
                    <option value="CDL Class B">CDL Class B</option>
                    <option value="CDL Class A + Hazmat">CDL Class A + Hazmat</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>License Expiry</label>
                  <input
                    required type="date"
                    value={formData.licenseExp} onChange={e => setFormData({ ...formData, licenseExp: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Assigned Vehicle</label>
                  <input
                    type="text" placeholder="#4022"
                    value={formData.vehicle} onChange={e => setFormData({ ...formData, vehicle: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Duty Status</label>
                  <select
                    value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  >
                    {Object.keys(statusConfig).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
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
                  Save Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Profile Modal */}
      {showPreviewModal && selectedDriver && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 100,
        }}>
          <div style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            border: '1px solid var(--color-outline-variant)',
            borderRadius: '16px', padding: '28px', width: '100%', maxWidth: '520px',
            boxShadow: '0 6px 30px rgba(0,0,0,0.18)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div className="flex items-center gap-3">
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-fixed)', color: 'var(--color-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: '700', fontSize: '16px',
                }}>
                  {selectedDriver.avatar}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-on-surface)' }}>{selectedDriver.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>ID: {selectedDriver.id} · {selectedDriver.license}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div style={{ height: '1px', backgroundColor: 'var(--color-outline-variant)', marginBottom: '16px' }} />
            <div className="space-y-3" style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Shift:</strong>
                <span>{selectedDriver.shift || 'Morning Shift'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Duty Status:</strong>
                <span className={`${statusConfig[selectedDriver.status]?.style || 'badge-available'} px-2 py-0.5 rounded-full text-xs font-semibold`}>
                  {selectedDriver.status}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Vehicle Assigned:</strong>
                <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{selectedDriver.vehicle || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Phone Number:</strong>
                <span>{selectedDriver.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>License Expiry:</strong>
                <span style={{ color: new Date(selectedDriver.licenseExp) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'var(--color-error)' : 'inherit' }}>
                  {selectedDriver.licenseExp}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Medical Card Expiry:</strong>
                <span>{selectedDriver.medicalExp || '2026-09-30'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Emergency Contact:</strong>
                <span>{selectedDriver.emergencyContact || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>On-Time Performance Rate:</strong>
                <strong style={{ color: 'var(--color-secondary)' }}>{selectedDriver.onTimeRate || 95}%</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>Total Trips Completed:</strong>
                <span>{selectedDriver.trips} trips</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                onClick={() => setShowPreviewModal(false)}
                style={{ padding: '8px 24px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--color-primary)', color: '#fff', cursor: 'pointer', fontWeight: '600' }}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
