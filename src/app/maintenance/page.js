'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const priorityConfig = {
  High: { color: 'var(--color-error)', bg: 'rgba(186, 26, 26, 0.1)' },
  Medium: { color: '#b45309', bg: '#fef3c7' },
  Low: { color: '#15803d', bg: '#dcfce7' },
};

const statusConfig = {
  Critical: { class: 'badge-error' },
  Overdue: { class: 'badge-maintenance' },
  'In Progress': { class: 'badge-dispatched' },
  Scheduled: { class: 'badge-in-transit' },
  Completed: { class: 'badge-completed' },
};

export default function MaintenancePage() {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    vehicle: '', serviceType: '', priority: 'Medium', assignedTo: '',
    dueDate: '', estimatedCost: '', notes: ''
  });

  const menuRef = useRef(null);

  async function fetchLogs() {
    setLoading(true);
    try {
      const priorityParam = priorityFilter === 'All' ? 'all' : priorityFilter;
      const res = await fetch(`/api/maintenance?priority=${priorityParam}&limit=100`);
      const data = await res.json();
      setLogs(data.data || []);
      setSummary(data.summary || {});
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();
  }, [priorityFilter]);

  // Check URL queries
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('modal') === 'log-service') {
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
      const res = await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          estimatedCost: parseFloat(formData.estimatedCost || '0')
        }),
      });
      if (res.ok) {
        const body = await res.json();
        setShowAddModal(false);
        // Refresh local logs state list
        setLogs(prev => [
          {
            ...body.record,
            cost: `$${formData.estimatedCost}`,
            type: formData.serviceType
          },
          ...prev
        ]);
        // Reset form
        setFormData({
          vehicle: '', serviceType: '', priority: 'Medium', assignedTo: '',
          dueDate: '', estimatedCost: '', notes: ''
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
    const headers = ['Log ID', 'Vehicle ID', 'Service Type', 'Priority', 'Status', 'Assigned To', 'Due Date', 'Est. Cost', 'Notes'];
    const rows = logs.map(l => [l.id, l.vehicle, l.serviceType || l.type, l.priority, l.status, l.assignedTo, l.dueDate, l.estimatedCost || l.cost, l.notes]);
    const csvContent = 'data:text/csv;charset=utf-8,' 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `maintenance_service_logs_${priorityFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination logic
  const itemsPerPage = 8;
  const totalPages = Math.ceil(logs.length / itemsPerPage) || 1;
  const paginatedLogs = logs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                Log Service
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Critical / Overdue', value: (summary.critical || 0) + (summary.overdue || 0) || '2', icon: 'warning', color: 'var(--color-error)', bg: 'var(--color-error-container)' },
              { label: 'In Progress', value: summary.inProgress || '1', icon: 'build_circle', color: 'var(--color-primary)', bg: 'var(--color-primary-fixed)' },
              { label: 'Scheduled', value: summary.scheduled || '8', icon: 'calendar_month', color: '#b45309', bg: '#fef3c7' },
              { label: 'Completed (MTD)', value: summary.completed || '24', icon: 'verified', color: '#15803d', bg: '#dcfce7' },
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
              Filter by Priority:
            </div>
            {['All', 'High', 'Medium', 'Low'].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setPriorityFilter(p);
                  setCurrentPage(1);
                }}
                className="px-3 py-1 rounded-full transition-all border-none font-semibold text-xs cursor-pointer"
                style={{
                  backgroundColor: priorityFilter === p ? 'var(--color-primary)' : 'transparent',
                  color: priorityFilter === p ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                  border: priorityFilter === p ? 'none' : '1px solid var(--color-outline-variant)',
                }}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Maintenance Table */}
          {loading ? (
            <div className="p-12 text-center text-sm font-semibold" style={{ color: 'var(--color-outline)' }}>
              Loading Maintenance Logs...
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
                    {paginatedLogs.map((m, i) => (
                      <tr
                        key={m.id}
                        style={{
                          backgroundColor: i % 2 === 1 ? 'rgba(244, 243, 250, 0.4)' : 'transparent',
                          borderTop: '1px solid rgba(197, 197, 211, 0.3)',
                          transition: 'background-color 0.15s',
                        }}
                      >
                        <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>{m.id}</td>
                        <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>{m.vehicle}</td>
                        <td style={{ padding: '14px 20px' }}>
                          <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-on-surface)' }}>{m.serviceType || m.type}</p>
                          <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>{m.notes}</p>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span
                            className="px-2.5 py-0.5 rounded-full"
                            style={{
                              fontSize: '12px',
                              fontWeight: '600',
                              color: priorityConfig[m.priority]?.color || 'inherit',
                              backgroundColor: priorityConfig[m.priority]?.bg || 'transparent',
                            }}
                          >
                            {m.priority}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span className={`${statusConfig[m.status]?.class || 'badge-in-transit'} px-2.5 py-0.5 rounded-full`} style={{ fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap' }}>
                            {m.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px', fontSize: '14px', color: 'var(--color-on-surface)' }}>{m.assignedTo}</td>
                        <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>{m.dueDate}</td>
                        <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface)' }}>{m.estimatedCost ? `$${m.estimatedCost}` : m.cost}</td>
                        <td style={{ padding: '14px 20px', textAlign: 'right', position: 'relative' }}>
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === m.id ? null : m.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-outline)'}
                          >
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>

                          {activeMenuId === m.id && (
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
                                  alert(`Updating service record ${m.id}`);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                              >
                                Edit Record
                              </button>
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  alert(`Completing service for ${m.id}`);
                                }}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                              >
                                Complete Service
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
                  Showing {paginatedLogs.length} of {logs.length} records
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

      {/* Log Service Modal */}
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
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--color-primary)' }}>Log Maintenance Service</h3>
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
                    required type="text" placeholder="#4022"
                    value={formData.vehicle} onChange={e => setFormData({ ...formData, vehicle: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Priority</label>
                  <select
                    value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Service Type</label>
                <input
                  required type="text" placeholder="Brake System Overhaul"
                  value={formData.serviceType} onChange={e => setFormData({ ...formData, serviceType: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Assigned Garage</label>
                  <input
                    required type="text" placeholder="Central Garage"
                    value={formData.assignedTo} onChange={e => setFormData({ ...formData, assignedTo: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Estimated Cost ($)</label>
                  <input
                    required type="number" placeholder="1840"
                    value={formData.estimatedCost} onChange={e => setFormData({ ...formData, estimatedCost: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Due Date</label>
                  <input
                    required type="date"
                    value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface-variant)', marginBottom: '4px' }}>Notes</label>
                <textarea
                  rows={3} placeholder="ABS module replacement required..."
                  value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--color-outline-variant)', borderRadius: '6px', resize: 'vertical' }}
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
                  Schedule Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
