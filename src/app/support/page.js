'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const ticketPriorityConfig = {
  High: { color: 'var(--color-error)', bg: 'rgba(186,26,26,0.1)' },
  Medium: { color: '#b45309', bg: '#fef3c7' },
  Low: { color: '#15803d', bg: '#dcfce7' },
};

const ticketStatusConfig = {
  Open: { color: 'var(--color-error)', bg: 'rgba(186,26,26,0.1)' },
  'In Progress': { color: 'var(--color-primary)', bg: 'var(--color-primary-fixed)' },
  Resolved: { color: '#15803d', bg: '#dcfce7' },
  'Under Review': { color: '#b45309', bg: '#fef3c7' },
};

const statusDotColor = {
  operational: '#15803d',
  degraded: '#b45309',
  outage: '#ba1a1a',
};

const supportSections = [
  { id: 'overview', label: 'Overview', icon: 'home' },
  { id: 'tickets', label: 'My Tickets', icon: 'confirmation_number' },
  { id: 'new-ticket', label: 'Submit Ticket', icon: 'add_circle' },
  { id: 'faq', label: 'Help Center / FAQ', icon: 'help' },
  { id: 'status', label: 'System Status', icon: 'monitor_heart' },
  { id: 'docs', label: 'Documentation', icon: 'menu_book' },
  { id: 'contact', label: 'Contact Us', icon: 'contact_support' },
];

export default function SupportPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const [data, setData] = useState(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [ticketForm, setTicketForm] = useState({ subject: '', category: 'Technical', priority: 'Medium', description: '' });
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/support')
      .then(r => r.json())
      .then(setData);
  }, []);

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...ticketForm, submittedBy: 'Alex Rivera' }),
    });
    if (res.ok) {
      setTicketSubmitted(true);
      setTimeout(() => { setTicketSubmitted(false); setActiveSection('tickets'); setTicketForm({ subject: '', category: 'Technical', priority: 'Medium', description: '' }); }, 2500);
    }
  };

  const card = (children, extra = {}) => (
    <div style={{
      backgroundColor: 'var(--color-surface-container-lowest)',
      border: '1px solid var(--color-outline-variant)',
      borderRadius: '12px', padding: '24px',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
      ...extra,
    }}>
      {children}
    </div>
  );

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    fontSize: '14px', color: 'var(--color-on-surface)',
    backgroundColor: 'var(--color-surface-container-low)',
    border: '1px solid var(--color-outline-variant)',
    borderRadius: '8px', outline: 'none',
  };

  const focusInput = (e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(0,35,111,0.1)'; };
  const blurInput = (e) => { e.target.style.borderColor = 'var(--color-outline-variant)'; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <Sidebar activePath="/support" />
      <main className="ml-60 min-h-screen flex flex-col">
        <TopBar />

        <div className="flex-1 flex" style={{ minHeight: 0 }}>
          {/* Support Nav Sidebar */}
          <aside style={{
            width: '220px', flexShrink: 0,
            borderRight: '1px solid var(--color-outline-variant)',
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '24px 12px',
          }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-on-surface-variant)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 12px', marginBottom: '8px' }}>
              Support
            </p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {supportSections.map(sec => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 12px', borderRadius: '8px',
                    border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
                    fontSize: '14px', fontWeight: activeSection === sec.id ? '600' : '400',
                    color: activeSection === sec.id ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)',
                    backgroundColor: activeSection === sec.id ? 'rgba(134,242,228,0.12)' : 'transparent',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { if (activeSection !== sec.id) e.currentTarget.style.backgroundColor = 'var(--color-surface-container)'; }}
                  onMouseLeave={e => { if (activeSection !== sec.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <span className="material-symbols-outlined" style={{
                    fontSize: '18px',
                    fontVariationSettings: activeSection === sec.id ? "'FILL' 1" : "'FILL' 0",
                  }}>
                    {sec.icon}
                  </span>
                  {sec.label}
                  {sec.id === 'tickets' && data && (
                    <span style={{
                      marginLeft: 'auto', minWidth: '18px', height: '18px',
                      borderRadius: '9999px', fontSize: '10px', fontWeight: '700',
                      backgroundColor: 'var(--color-error)', color: '#fff',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {data.summary?.open || 0}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>

            {/* Overview */}
            {activeSection === 'overview' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)' }}>Help & Support</h2>
                  <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>Get help, submit tickets, and check service status.</p>
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  {[
                    { icon: 'add_circle', label: 'Submit a Ticket', desc: 'Report an issue or request help', color: 'var(--color-primary)', section: 'new-ticket' },
                    { icon: 'help', label: 'Browse FAQ', desc: 'Find answers to common questions', color: 'var(--color-secondary)', section: 'faq' },
                    { icon: 'monitor_heart', label: 'System Status', desc: 'Check service availability', color: '#15803d', section: 'status' },
                  ].map(a => (
                    <button key={a.section} onClick={() => setActiveSection(a.section)} style={{
                      padding: '20px', borderRadius: '12px', cursor: 'pointer', textAlign: 'left',
                      border: '1px solid var(--color-outline-variant)',
                      backgroundColor: 'var(--color-surface-container-lowest)',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '28px', color: a.color, display: 'block', marginBottom: '12px' }}>
                        {a.icon}
                      </span>
                      <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-on-surface)' }}>{a.label}</p>
                      <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>{a.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Open Tickets */}
                {card(
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-primary)' }}>Recent Tickets</h3>
                      <button onClick={() => setActiveSection('tickets')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', color: 'var(--color-primary)' }}>View all →</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {(data?.tickets || []).slice(0, 3).map(t => (
                        <div key={t.id} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '12px 16px', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '8px',
                        }}>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-on-surface)' }}>{t.subject}</p>
                            <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>
                              {t.id} · {t.category} · {t.submittedBy}
                            </p>
                          </div>
                          <span style={{
                            fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '9999px',
                            color: ticketStatusConfig[t.status]?.color || 'var(--color-on-surface)',
                            backgroundColor: ticketStatusConfig[t.status]?.bg || 'var(--color-surface-container)',
                            whiteSpace: 'nowrap',
                          }}>
                            {t.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* System Status Snapshot */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {card(
                    <>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '12px' }}>Service Status</h3>
                      {Object.entries(data?.systemStatus || {}).map(([key, val]) => (
                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--color-outline-variant)' }}>
                          <span style={{ fontSize: '14px', color: 'var(--color-on-surface)', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600', color: statusDotColor[val.status] }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: statusDotColor[val.status], display: 'inline-block' }} />
                            {val.status.charAt(0).toUpperCase() + val.status.slice(1)}
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                  {card(
                    <>
                      <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '12px' }}>Contact Support</h3>
                      {[
                        { icon: 'phone', label: 'Phone', value: '+1 (800) TRANSIT', hint: 'Mon–Fri 7AM–7PM CT' },
                        { icon: 'email', label: 'Email', value: 'support@transitops.io', hint: '24–48 hour response' },
                        { icon: 'chat', label: 'Live Chat', value: 'Available in-app', hint: 'Avg wait: 3 minutes' },
                      ].map(c => (
                        <div key={c.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-secondary)', marginTop: '2px' }}>{c.icon}</span>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-on-surface)' }}>{c.value}</p>
                            <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{c.hint}</p>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* My Tickets */}
            {activeSection === 'tickets' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)' }}>My Tickets</h2>
                    <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>Track all submitted support requests and their status.</p>
                  </div>
                  <button onClick={() => setActiveSection('new-ticket')} style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
                    backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)',
                    borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                    New Ticket
                  </button>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                  {[
                    { label: 'Open', value: data?.summary?.open || 0, color: 'var(--color-error)', bg: 'rgba(186,26,26,0.1)' },
                    { label: 'In Progress', value: data?.summary?.inProgress || 0, color: 'var(--color-primary)', bg: 'var(--color-primary-fixed)' },
                    { label: 'Under Review', value: data?.summary?.underReview || 0, color: '#b45309', bg: '#fef3c7' },
                    { label: 'Resolved', value: data?.summary?.resolved || 0, color: '#15803d', bg: '#dcfce7' },
                  ].map(s => (
                    <div key={s.label} style={{ padding: '16px', borderRadius: '10px', backgroundColor: s.bg, textAlign: 'center' }}>
                      <p style={{ fontSize: '28px', fontWeight: '700', color: s.color }}>{s.value}</p>
                      <p style={{ fontSize: '12px', fontWeight: '600', color: s.color, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Ticket List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(data?.tickets || []).map(t => (
                    <div key={t.id} style={{
                      backgroundColor: 'var(--color-surface-container-lowest)',
                      border: '1px solid var(--color-outline-variant)',
                      borderRadius: '12px', padding: '20px',
                      borderLeft: `4px solid ${ticketStatusConfig[t.status]?.color || 'var(--color-outline)'}`,
                      cursor: 'pointer', transition: 'box-shadow 0.15s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 3px 12px rgba(0,0,0,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: '700', color: 'var(--color-primary)' }}>{t.id}</span>
                            <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>·</span>
                            <span style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{t.category}</span>
                            <span style={{
                              fontSize: '11px', fontWeight: '700', padding: '1px 8px', borderRadius: '9999px',
                              color: ticketPriorityConfig[t.priority]?.color, backgroundColor: ticketPriorityConfig[t.priority]?.bg,
                            }}>
                              {t.priority}
                            </span>
                          </div>
                          <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-on-surface)', marginBottom: '8px' }}>{t.subject}</p>
                          <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>
                            <span>Submitted by <strong>{t.submittedBy}</strong></span>
                            <span>Assigned to <strong>{t.assignedTo}</strong></span>
                            <span>{t.messages} message{t.messages !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <span style={{
                            fontSize: '12px', fontWeight: '600', padding: '4px 12px', borderRadius: '9999px',
                            color: ticketStatusConfig[t.status]?.color, backgroundColor: ticketStatusConfig[t.status]?.bg,
                            display: 'inline-block', marginBottom: '6px',
                          }}>
                            {t.status}
                          </span>
                          <p style={{ fontSize: '11px', color: 'var(--color-outline)', fontFamily: 'JetBrains Mono, monospace' }}>
                            {new Date(t.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Ticket */}
            {activeSection === 'new-ticket' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)' }}>Submit Support Ticket</h2>
                  <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>Describe your issue and our team will respond within 24 hours.</p>
                </div>

                {ticketSubmitted ? (
                  <div style={{ textAlign: 'center', padding: '64px 32px', backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '12px', border: '1px solid var(--color-outline-variant)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#15803d', display: 'block', marginBottom: '16px' }}>check_circle</span>
                    <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--color-on-surface)' }}>Ticket Submitted!</h3>
                    <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '8px' }}>Your support request has been received. Redirecting to your tickets...</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitTicket} style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '680px' }}>
                    {card(
                      <>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface)', marginBottom: '6px' }}>
                            Subject <span style={{ color: 'var(--color-error)' }}>*</span>
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="Brief description of the issue"
                            value={ticketForm.subject}
                            onChange={e => setTicketForm(p => ({ ...p, subject: e.target.value }))}
                            style={inputStyle}
                            onFocus={focusInput}
                            onBlur={blurInput}
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface)', marginBottom: '6px' }}>Category</label>
                            <select
                              value={ticketForm.category}
                              onChange={e => setTicketForm(p => ({ ...p, category: e.target.value }))}
                              style={{ ...inputStyle, cursor: 'pointer' }}
                            >
                              {['Technical', 'Account', 'Billing', 'Feature Request', 'Training', 'Other'].map(c => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface)', marginBottom: '6px' }}>Priority</label>
                            <select
                              value={ticketForm.priority}
                              onChange={e => setTicketForm(p => ({ ...p, priority: e.target.value }))}
                              style={{ ...inputStyle, cursor: 'pointer' }}
                            >
                              {['Low', 'Medium', 'High'].map(p => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface)', marginBottom: '6px' }}>
                            Description <span style={{ color: 'var(--color-error)' }}>*</span>
                          </label>
                          <textarea
                            required
                            rows={5}
                            placeholder="Describe the issue in detail. Include steps to reproduce, expected vs. actual behavior, affected vehicles or drivers..."
                            value={ticketForm.description}
                            onChange={e => setTicketForm(p => ({ ...p, description: e.target.value }))}
                            style={{ ...inputStyle, resize: 'vertical', minHeight: '120px' }}
                            onFocus={focusInput}
                            onBlur={blurInput}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface)', marginBottom: '6px' }}>Attachments</label>
                          <div style={{
                            border: '2px dashed var(--color-outline-variant)', borderRadius: '8px',
                            padding: '24px', textAlign: 'center', cursor: 'pointer',
                            backgroundColor: 'var(--color-surface-container-low)',
                          }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--color-outline)', display: 'block', marginBottom: '8px' }}>upload_file</span>
                            <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>Click to upload or drag and drop</p>
                            <p style={{ fontSize: '12px', color: 'var(--color-outline)', marginTop: '4px' }}>PNG, JPG, PDF up to 10MB</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                          <button type="submit" style={{
                            padding: '10px 28px', borderRadius: '8px',
                            backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)',
                            border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                          }}>
                            Submit Ticket
                          </button>
                          <button type="button" onClick={() => setActiveSection('overview')} style={{
                            padding: '10px 20px', borderRadius: '8px',
                            border: '1px solid var(--color-outline-variant)', background: 'transparent',
                            cursor: 'pointer', fontSize: '14px', color: 'var(--color-on-surface-variant)',
                          }}>
                            Cancel
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                )}
              </div>
            )}

            {/* FAQ */}
            {activeSection === 'faq' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)' }}>Help Center</h2>
                  <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>Frequently asked questions and how-to guides.</p>
                </div>
                {/* Category pills */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  {['All', 'Fleet', 'Drivers', 'Trips', 'Reports', 'Fuel', 'Security'].map(c => (
                    <button key={c} style={{
                      padding: '6px 16px', borderRadius: '9999px', border: '1px solid var(--color-outline-variant)',
                      backgroundColor: c === 'All' ? 'var(--color-primary)' : 'transparent',
                      color: c === 'All' ? '#fff' : 'var(--color-on-surface-variant)',
                      fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                    }}>
                      {c}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(data?.faqs || []).map(faq => (
                    <div key={faq.id} style={{
                      backgroundColor: 'var(--color-surface-container-lowest)',
                      border: '1px solid var(--color-outline-variant)',
                      borderRadius: '10px', overflow: 'hidden',
                    }}>
                      <button
                        onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                        style={{
                          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
                        }}
                      >
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <span style={{
                            fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '9999px',
                            backgroundColor: 'var(--color-primary-fixed)', color: 'var(--color-primary)',
                            flexShrink: 0,
                          }}>
                            {faq.category}
                          </span>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-on-surface)' }}>{faq.question}</span>
                        </div>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-outline)', transition: 'transform 0.2s', transform: openFaq === faq.id ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          expand_more
                        </span>
                      </button>
                      {openFaq === faq.id && (
                        <div style={{ padding: '0 20px 16px 20px' }}>
                          <div style={{ height: '1px', backgroundColor: 'var(--color-outline-variant)', marginBottom: '12px' }} />
                          <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', lineHeight: '1.6' }}>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '24px', textAlign: 'center', padding: '24px', backgroundColor: 'var(--color-surface-container)', borderRadius: '12px' }}>
                  <p style={{ fontSize: '15px', fontWeight: '500', color: 'var(--color-on-surface)' }}>Can't find what you're looking for?</p>
                  <button onClick={() => setActiveSection('new-ticket')} style={{
                    marginTop: '12px', padding: '10px 24px', borderRadius: '8px',
                    backgroundColor: 'var(--color-primary)', color: '#fff',
                    border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                  }}>
                    Submit a Support Ticket
                  </button>
                </div>
              </div>
            )}

            {/* System Status */}
            {activeSection === 'status' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)' }}>System Status</h2>
                  <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>Real-time availability of all TransitOps services.</p>
                </div>
                <div style={{
                  padding: '20px 24px', borderRadius: '12px', marginBottom: '20px',
                  backgroundColor: '#dcfce7', border: '1px solid rgba(21,128,61,0.3)',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '28px', color: '#15803d' }}>check_circle</span>
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: '700', color: '#15803d' }}>All Systems Operational</p>
                    <p style={{ fontSize: '13px', color: '#166534' }}>Last checked: {new Date().toLocaleTimeString()} · No active incidents</p>
                  </div>
                </div>
                {card(
                  <>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '16px' }}>Service Health</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      {Object.entries(data?.systemStatus || {}).map(([key, val], i) => (
                        <div key={key} style={{
                          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                          padding: '14px 0',
                          borderBottom: i < Object.keys(data?.systemStatus || {}).length - 1 ? '1px solid var(--color-outline-variant)' : 'none',
                        }}>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-on-surface)', textTransform: 'capitalize' }}>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            {val.note && <p style={{ fontSize: '12px', color: '#b45309', marginTop: '2px' }}>⚠ {val.note}</p>}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{val.latency}</span>
                            <span style={{
                              display: 'flex', alignItems: 'center', gap: '6px',
                              fontSize: '12px', fontWeight: '600', padding: '3px 12px', borderRadius: '9999px',
                              backgroundColor: val.status === 'operational' ? '#dcfce7' : val.status === 'degraded' ? '#fef3c7' : '#ffdad6',
                              color: statusDotColor[val.status],
                            }}>
                              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: statusDotColor[val.status], display: 'inline-block' }} />
                              {val.status.charAt(0).toUpperCase() + val.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Documentation */}
            {activeSection === 'docs' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)' }}>Documentation</h2>
                  <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>Guides, API references, and training materials.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {[
                    { icon: 'rocket_launch', title: 'Getting Started', desc: 'Quick-start guide for new fleet managers', tag: '15 min read', color: 'var(--color-primary)' },
                    { icon: 'directions_bus', title: 'Fleet Management Guide', desc: 'Adding vehicles, scheduling service, managing assets', tag: 'Updated Jul 2025', color: 'var(--color-secondary)' },
                    { icon: 'badge', title: 'Driver Onboarding', desc: 'How to add drivers, upload licenses, and set schedules', tag: '10 min read', color: '#b45309' },
                    { icon: 'route', title: 'Trip Dispatch Manual', desc: 'Dispatching, tracking, and managing active trips', tag: 'Essential', color: 'var(--color-primary)' },
                    { icon: 'analytics', title: 'Analytics & Reports', desc: 'Understanding metrics, KPIs, and export formats', tag: '20 min read', color: '#15803d' },
                    { icon: 'api', title: 'REST API Reference', desc: 'Full API documentation for system integrations', tag: 'Developer', color: 'var(--color-secondary)' },
                    { icon: 'security', title: 'Security Best Practices', desc: 'Access control, 2FA, audit logs, and compliance', tag: 'Recommended', color: 'var(--color-error)' },
                    { icon: 'play_circle', title: 'Video Tutorials', desc: 'Step-by-step walkthroughs for core workflows', tag: '12 videos', color: '#b45309' },
                  ].map((doc, i) => (
                    <button key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '16px',
                      padding: '20px', borderRadius: '12px', textAlign: 'left', cursor: 'pointer',
                      backgroundColor: 'var(--color-surface-container-lowest)',
                      border: '1px solid var(--color-outline-variant)',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '24px', color: doc.color, flexShrink: 0, marginTop: '2px' }}>{doc.icon}</span>
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-on-surface)' }}>{doc.title}</p>
                        <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>{doc.desc}</p>
                        <span style={{ marginTop: '8px', display: 'inline-block', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '9999px', backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)' }}>
                          {doc.tag}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Contact */}
            {activeSection === 'contact' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)' }}>Contact Us</h2>
                  <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>Reach our support team directly through any of the channels below.</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                  {[
                    { icon: 'phone', title: 'Phone Support', value: '+1 (800) TRANSIT', sub: 'Mon–Fri 7AM–7PM CT', desc: 'Best for urgent operational issues requiring immediate assistance.', color: 'var(--color-primary)' },
                    { icon: 'email', title: 'Email Support', value: 'support@transitops.io', sub: '24–48 hour SLA', desc: 'For non-urgent questions, feature requests, and billing inquiries.', color: 'var(--color-secondary)' },
                    { icon: 'chat', title: 'Live Chat', value: 'Start Chat →', sub: 'Avg wait: 3 minutes', desc: 'Real-time assistance for technical problems during business hours.', color: '#b45309' },
                  ].map(c => (
                    <div key={c.title} style={{ padding: '24px', borderRadius: '12px', backgroundColor: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '32px', color: c.color, display: 'block', marginBottom: '12px' }}>{c.icon}</span>
                      <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--color-on-surface)' }}>{c.title}</p>
                      <p style={{ fontSize: '16px', fontWeight: '600', color: c.color, marginTop: '6px' }}>{c.value}</p>
                      <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>{c.sub}</p>
                      <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', marginTop: '12px', lineHeight: '1.5' }}>{c.desc}</p>
                    </div>
                  ))}
                </div>
                {card(
                  <>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '16px' }}>Send a Message</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface)', marginBottom: '6px' }}>Your Name</label>
                        <input type="text" defaultValue="Alex Rivera" style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface)', marginBottom: '6px' }}>Email</label>
                        <input type="email" defaultValue="alex.rivera@tocta.gov" style={inputStyle} onFocus={focusInput} onBlur={blurInput} />
                      </div>
                    </div>
                    <div style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface)', marginBottom: '6px' }}>Message</label>
                      <textarea rows={4} placeholder="How can we help?" style={{ ...inputStyle, resize: 'vertical' }} onFocus={focusInput} onBlur={blurInput} />
                    </div>
                    <button style={{
                      padding: '10px 24px', borderRadius: '8px',
                      backgroundColor: 'var(--color-primary)', color: '#fff',
                      border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                    }}>
                      Send Message
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
