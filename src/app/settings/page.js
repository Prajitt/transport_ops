'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';

const settingsSections = [
  { id: 'organization', label: 'Organization', icon: 'business' },
  { id: 'fleet', label: 'Fleet Configuration', icon: 'directions_bus' },
  { id: 'notifications', label: 'Notifications', icon: 'notifications' },
  { id: 'security', label: 'Security & Access', icon: 'security' },
  { id: 'integrations', label: 'Integrations', icon: 'hub' },
  { id: 'display', label: 'Display & Preferences', icon: 'tune' },
  { id: 'users', label: 'Users & Roles', icon: 'group' },
  { id: 'billing', label: 'Billing & Plan', icon: 'credit_card' },
];

const Toggle = ({ checked, onChange, id }) => (
  <button
    id={id}
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    style={{
      width: '44px', height: '24px',
      borderRadius: '9999px',
      backgroundColor: checked ? 'var(--color-secondary)' : 'var(--color-outline-variant)',
      border: 'none', cursor: 'pointer',
      position: 'relative', transition: 'background-color 0.2s',
      flexShrink: 0,
    }}
  >
    <span style={{
      display: 'block',
      width: '18px', height: '18px', borderRadius: '50%',
      backgroundColor: '#fff',
      position: 'absolute',
      top: '3px',
      left: checked ? '23px' : '3px',
      transition: 'left 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
    }} />
  </button>
);

const Section = ({ title, children }) => (
  <div style={{ marginBottom: '32px' }}>
    <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-on-surface-variant)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--color-outline-variant)' }}>
      {title}
    </h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {children}
    </div>
  </div>
);

const FieldRow = ({ label, hint, children }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '24px' }}>
    <div style={{ flex: '0 0 260px' }}>
      <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-on-surface)' }}>{label}</p>
      {hint && <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginTop: '2px' }}>{hint}</p>}
    </div>
    <div style={{ flex: 1 }}>{children}</div>
  </div>
);

const Input = ({ value, onChange, placeholder, type = 'text', monospace }) => (
  <input
    type={type}
    value={value}
    onChange={e => onChange && onChange(e.target.value)}
    placeholder={placeholder}
    style={{
      width: '100%', maxWidth: '360px',
      padding: '8px 12px',
      fontSize: '14px',
      fontFamily: monospace ? 'JetBrains Mono, monospace' : 'Inter, sans-serif',
      color: 'var(--color-on-surface)',
      backgroundColor: 'var(--color-surface-container-low)',
      border: '1px solid var(--color-outline-variant)',
      borderRadius: '8px',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}
    onFocus={(e) => {
      e.target.style.borderColor = 'var(--color-primary)';
      e.target.style.boxShadow = '0 0 0 3px rgba(0,35,111,0.12)';
    }}
    onBlur={(e) => {
      e.target.style.borderColor = 'var(--color-outline-variant)';
      e.target.style.boxShadow = 'none';
    }}
  />
);

const Select = ({ value, options, onChange }) => (
  <select
    value={value}
    onChange={e => onChange && onChange(e.target.value)}
    style={{
      padding: '8px 12px',
      fontSize: '14px',
      color: 'var(--color-on-surface)',
      backgroundColor: 'var(--color-surface-container-low)',
      border: '1px solid var(--color-outline-variant)',
      borderRadius: '8px',
      outline: 'none',
      cursor: 'pointer',
      minWidth: '200px',
    }}
  >
    {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
  </select>
);

const users = [
  { name: 'Alex Rivera', email: 'alex.rivera@tocta.gov', role: 'Fleet Manager', avatar: 'AR', status: 'Active', lastLogin: '2025-07-12 09:41' },
  { name: 'Susan Park', email: 'susan.park@tocta.gov', role: 'Operations Director', avatar: 'SP', status: 'Active', lastLogin: '2025-07-12 08:15' },
  { name: 'James Okafor', email: 'james.okafor@tocta.gov', role: 'Dispatcher', avatar: 'JO', status: 'Active', lastLogin: '2025-07-11 22:30' },
  { name: 'Lena Hoang', email: 'lena.hoang@tocta.gov', role: 'Analyst', avatar: 'LH', status: 'Active', lastLogin: '2025-07-10 14:22' },
  { name: 'Brian Moss', email: 'brian.moss@tocta.gov', role: 'Mechanic Supervisor', avatar: 'BM', status: 'Inactive', lastLogin: '2025-06-28 11:05' },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('organization');
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState(null);

  const [notifs, setNotifs] = useState({
    emailAlerts: true, smsAlerts: false, pushNotifications: true,
    licenseExpiryAlerts: true, maintenanceDueAlerts: true,
    tripDelayAlerts: true, fuelBudgetAlerts: true, weeklyReportEmail: true,
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: true, auditLogEnabled: true,
  });

  const [integrations, setIntegrations] = useState({
    gps: true, fuel: true, payroll: false, reporting: true,
  });

  const [display, setDisplay] = useState({
    theme: 'light', language: 'en-US', dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h', tableRowsPerPage: '10', dashboardRefreshSeconds: '60',
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        setSettings(data);
        setNotifs(prev => ({ ...prev, ...data.notifications }));
        setSecurity(prev => ({ ...prev, ...data.security }));
        setIntegrations({
          gps: data.integrations?.gps?.enabled ?? true,
          fuel: data.integrations?.fuel?.enabled ?? true,
          payroll: data.integrations?.payroll?.enabled ?? false,
          reporting: data.integrations?.reporting?.enabled ?? true,
        });
        setDisplay(prev => ({ ...prev, ...data.display }));
      });
  }, []);

  const handleSave = async () => {
    await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notifications: notifs, security, display }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const card = (children) => (
    <div style={{
      backgroundColor: 'var(--color-surface-container-lowest)',
      border: '1px solid var(--color-outline-variant)',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
    }}>
      {children}
    </div>
  );

  return (
    <div style={{ backgroundColor: 'var(--color-background)', minHeight: '100vh' }}>
      <Sidebar activePath="/settings" />
      <main className="ml-60 min-h-screen flex flex-col">
        <TopBar />

        <div className="flex-1 flex" style={{ minHeight: 0 }}>
          {/* Settings Sidebar */}
          <aside style={{
            width: '220px', flexShrink: 0,
            borderRight: '1px solid var(--color-outline-variant)',
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: '24px 12px',
          }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--color-on-surface-variant)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 12px', marginBottom: '8px' }}>
              Settings
            </p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {settingsSections.map(sec => (
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
                  onMouseEnter={e => {
                    if (activeSection !== sec.id) e.currentTarget.style.backgroundColor = 'var(--color-surface-container)';
                  }}
                  onMouseLeave={e => {
                    if (activeSection !== sec.id) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span className="material-symbols-outlined" style={{
                    fontSize: '18px',
                    fontVariationSettings: activeSection === sec.id ? "'FILL' 1" : "'FILL' 0",
                  }}>
                    {sec.icon}
                  </span>
                  {sec.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Settings Content */}
          <div style={{ flex: 1, padding: '24px 32px', overflowY: 'auto' }}>
            {/* Organization */}
            {activeSection === 'organization' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)' }}>Organization</h2>
                  <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>Manage your transit authority's profile and contact details.</p>
                </div>
                {card(
                  <>
                    <Section title="Organization Profile">
                      <FieldRow label="Organization Name" hint="Full legal name of your transit authority">
                        <Input value={settings?.organization?.name || 'TransitOps City Transit Authority'} placeholder="Organization name" />
                      </FieldRow>
                      <FieldRow label="Short Name / Acronym" hint="Used in reports and displays">
                        <Input value={settings?.organization?.shortName || 'TOCTA'} placeholder="e.g. TOCTA" />
                      </FieldRow>
                      <FieldRow label="Primary Email" hint="Main contact for system notifications">
                        <Input value={settings?.organization?.email || 'operations@tocta.gov'} placeholder="email@organization.gov" type="email" />
                      </FieldRow>
                      <FieldRow label="Phone Number">
                        <Input value={settings?.organization?.phone || '+1 (512) 880-4000'} placeholder="+1 (555) 000-0000" />
                      </FieldRow>
                      <FieldRow label="Headquarters Address">
                        <Input value={settings?.organization?.address || '1400 Congress Ave, Austin, TX 78701'} placeholder="Street, City, State ZIP" />
                      </FieldRow>
                      <FieldRow label="Website">
                        <Input value={settings?.organization?.website || 'https://www.tocta.gov'} placeholder="https://..." />
                      </FieldRow>
                    </Section>
                    <Section title="Regional Settings">
                      <FieldRow label="Timezone">
                        <Select value="America/Chicago" options={[
                          { value: 'America/Chicago', label: 'Central Time (CT)' },
                          { value: 'America/New_York', label: 'Eastern Time (ET)' },
                          { value: 'America/Denver', label: 'Mountain Time (MT)' },
                          { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                        ]} />
                      </FieldRow>
                      <FieldRow label="Fiscal Year Start">
                        <Select value="January" options={['January','April','July','October'].map(m => ({ value: m, label: m }))} />
                      </FieldRow>
                      <FieldRow label="Currency">
                        <Select value="USD" options={[
                          { value: 'USD', label: 'USD — US Dollar' },
                          { value: 'CAD', label: 'CAD — Canadian Dollar' },
                          { value: 'GBP', label: 'GBP — British Pound' },
                        ]} />
                      </FieldRow>
                    </Section>
                  </>
                )}
              </div>
            )}

            {/* Fleet Configuration */}
            {activeSection === 'fleet' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)' }}>Fleet Configuration</h2>
                  <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>Rules, thresholds, and operational parameters for fleet management.</p>
                </div>
                {card(
                  <>
                    <Section title="Service Intervals & Alerts">
                      <FieldRow label="Default Service Interval" hint="Mileage trigger for routine maintenance">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Input value="5,000" monospace />
                          <span style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>miles</span>
                        </div>
                      </FieldRow>
                      <FieldRow label="License Expiry Alert" hint="Days before expiry to send alert">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Input value="30" monospace />
                          <span style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>days</span>
                        </div>
                      </FieldRow>
                      <FieldRow label="Maintenance Due Alert" hint="Days before scheduled service to send alert">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Input value="7" monospace />
                          <span style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>days</span>
                        </div>
                      </FieldRow>
                      <FieldRow label="Max Driver Shift Hours" hint="Maximum continuous driving hours per shift">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Input value="10" monospace />
                          <span style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>hours</span>
                        </div>
                      </FieldRow>
                      <FieldRow label="Monthly Fuel Budget" hint="Alert when 80% is consumed">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>$</span>
                          <Input value="8,500" monospace />
                        </div>
                      </FieldRow>
                    </Section>
                    <Section title="Trip Operations">
                      <FieldRow label="Pre-Trip Inspection Required" hint="Drivers must complete inspection before departure">
                        <Toggle checked={true} id="pre-trip" />
                      </FieldRow>
                      <FieldRow label="Post-Trip Inspection Required" hint="Drivers must complete inspection after arrival">
                        <Toggle checked={true} id="post-trip" />
                      </FieldRow>
                      <FieldRow label="Odometer Unit">
                        <Select value="miles" options={[{ value: 'miles', label: 'Miles (mi)' }, { value: 'km', label: 'Kilometers (km)' }]} />
                      </FieldRow>
                      <FieldRow label="Speed Unit">
                        <Select value="mph" options={[{ value: 'mph', label: 'Miles per hour (mph)' }, { value: 'kmh', label: 'Kilometers per hour (km/h)' }]} />
                      </FieldRow>
                    </Section>
                  </>
                )}
              </div>
            )}

            {/* Notifications */}
            {activeSection === 'notifications' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)' }}>Notifications</h2>
                  <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>Configure how and when you receive operational alerts.</p>
                </div>
                {card(
                  <>
                    <Section title="Delivery Channels">
                      <FieldRow label="Email Alerts" hint="Send critical alerts to registered email addresses">
                        <Toggle checked={notifs.emailAlerts} onChange={v => setNotifs(p => ({ ...p, emailAlerts: v }))} id="email-alerts" />
                      </FieldRow>
                      <FieldRow label="SMS Alerts" hint="Send urgent alerts via SMS (carrier charges may apply)">
                        <Toggle checked={notifs.smsAlerts} onChange={v => setNotifs(p => ({ ...p, smsAlerts: v }))} id="sms-alerts" />
                      </FieldRow>
                      <FieldRow label="In-App Push Notifications" hint="Show alerts within the TransitOps dashboard">
                        <Toggle checked={notifs.pushNotifications} onChange={v => setNotifs(p => ({ ...p, pushNotifications: v }))} id="push-notifs" />
                      </FieldRow>
                    </Section>
                    <Section title="Alert Types">
                      {[
                        { key: 'licenseExpiryAlerts', label: 'Driver License Expiry', hint: 'Alert 30 days before license expiry' },
                        { key: 'maintenanceDueAlerts', label: 'Maintenance Due', hint: 'Alert 7 days before scheduled service' },
                        { key: 'tripDelayAlerts', label: 'Trip Delays', hint: 'Alert when a trip is >10 minutes behind schedule' },
                        { key: 'fuelBudgetAlerts', label: 'Fuel Budget Threshold', hint: 'Alert when 80% of monthly budget is consumed' },
                        { key: 'weeklyReportEmail', label: 'Weekly Summary Report', hint: 'Emailed every Monday 08:00' },
                      ].map(({ key, label, hint }) => (
                        <FieldRow key={key} label={label} hint={hint}>
                          <Toggle checked={notifs[key]} onChange={v => setNotifs(p => ({ ...p, [key]: v }))} id={key} />
                        </FieldRow>
                      ))}
                    </Section>
                    <Section title="Alert Recipients">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {settings?.notifications?.alertRecipients?.map((r, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '8px' }}>
                            <div>
                              <p style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-on-surface)' }}>{r.name}</p>
                              <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{r.email} · {r.role}</p>
                            </div>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                            </button>
                          </div>
                        ))}
                        <button style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '10px 16px', borderRadius: '8px',
                          border: '1px dashed var(--color-outline-variant)',
                          background: 'transparent', cursor: 'pointer',
                          fontSize: '14px', color: 'var(--color-primary)', fontWeight: '600',
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                          Add Recipient
                        </button>
                      </div>
                    </Section>
                  </>
                )}
              </div>
            )}

            {/* Security */}
            {activeSection === 'security' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)' }}>Security & Access</h2>
                  <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>Control access policies, authentication, and audit settings.</p>
                </div>
                {card(
                  <>
                    <Section title="Authentication">
                      <FieldRow label="Two-Factor Authentication" hint="Require 2FA for all admin logins (recommended)">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <Toggle checked={security.twoFactorAuth} onChange={v => setSecurity(p => ({ ...p, twoFactorAuth: v }))} id="2fa" />
                          {security.twoFactorAuth && (
                            <span style={{ fontSize: '12px', color: '#15803d', fontWeight: '600', backgroundColor: '#dcfce7', padding: '2px 8px', borderRadius: '9999px' }}>
                              ✓ Active
                            </span>
                          )}
                        </div>
                      </FieldRow>
                      <FieldRow label="Session Timeout" hint="Auto-logout after inactivity">
                        <Select value="60" options={[
                          { value: '15', label: '15 minutes' },
                          { value: '30', label: '30 minutes' },
                          { value: '60', label: '1 hour' },
                          { value: '240', label: '4 hours' },
                          { value: '480', label: '8 hours (shift)' },
                        ]} />
                      </FieldRow>
                      <FieldRow label="Password Expiry" hint="Force password reset after N days">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Input value="90" monospace />
                          <span style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>days</span>
                        </div>
                      </FieldRow>
                      <FieldRow label="Max Login Attempts" hint="Lock account after N failed attempts">
                        <Input value="5" monospace />
                      </FieldRow>
                    </Section>
                    <Section title="Audit & Logging">
                      <FieldRow label="Audit Log Enabled" hint="Record all user actions for compliance review">
                        <Toggle checked={security.auditLogEnabled} onChange={v => setSecurity(p => ({ ...p, auditLogEnabled: v }))} id="audit-log" />
                      </FieldRow>
                      <FieldRow label="Data Retention" hint="How long to keep audit logs">
                        <Select value="365" options={[
                          { value: '90', label: '90 days' },
                          { value: '180', label: '6 months' },
                          { value: '365', label: '1 year (recommended)' },
                          { value: '730', label: '2 years' },
                          { value: '1825', label: '5 years' },
                        ]} />
                      </FieldRow>
                    </Section>
                    <Section title="IP Whitelist">
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {['192.168.1.0/24', '10.0.0.0/8'].map((ip, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '8px' }}>
                            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface)' }}>{ip}</span>
                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>delete</span>
                            </button>
                          </div>
                        ))}
                        <button style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '10px 16px', borderRadius: '8px',
                          border: '1px dashed var(--color-outline-variant)',
                          background: 'transparent', cursor: 'pointer',
                          fontSize: '14px', color: 'var(--color-primary)', fontWeight: '600',
                        }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
                          Add IP Range
                        </button>
                      </div>
                    </Section>
                  </>
                )}
              </div>
            )}

            {/* Integrations */}
            {activeSection === 'integrations' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)' }}>Integrations</h2>
                  <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>Connect TransitOps with third-party systems.</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { key: 'gps', icon: 'gps_fixed', name: 'GPS Tracking', provider: 'Samsara Fleet Intelligence', desc: 'Real-time vehicle location, geofencing, and telematics data', lastSync: '2 min ago', connected: true },
                    { key: 'fuel', icon: 'local_gas_station', name: 'Fuel Card System', provider: 'FleetCards Pro', desc: 'Automated fuel expense logging from fleet cards', lastSync: '4 hours ago', connected: true },
                    { key: 'payroll', icon: 'account_balance', name: 'Payroll Integration', provider: 'ADP Workforce Now', desc: 'Sync driver hours and shift data for payroll processing', lastSync: 'Not connected', connected: false },
                    { key: 'reporting', icon: 'bar_chart', name: 'Advanced Reporting', provider: 'Tableau', desc: 'Enhanced analytics dashboard and custom report builder', lastSync: '1 hour ago', connected: true },
                  ].map(int => (
                    <div
                      key={int.key}
                      style={{
                        backgroundColor: 'var(--color-surface-container-lowest)',
                        border: `1px solid ${int.connected ? 'var(--color-secondary)' : 'var(--color-outline-variant)'}`,
                        borderRadius: '12px', padding: '20px',
                        display: 'flex', alignItems: 'flex-start', gap: '16px',
                        boxShadow: '0px 1px 3px rgba(0,0,0,0.04)',
                      }}
                    >
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                        backgroundColor: int.connected ? 'rgba(134,242,228,0.15)' : 'var(--color-surface-container)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '24px', color: int.connected ? 'var(--color-secondary)' : 'var(--color-outline)' }}>
                          {int.icon}
                        </span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <p style={{ fontSize: '15px', fontWeight: '600', color: 'var(--color-on-surface)' }}>{int.name}</p>
                            <p style={{ fontSize: '13px', color: 'var(--color-secondary)', fontWeight: '500' }}>{int.provider}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{
                              fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '9999px',
                              backgroundColor: int.connected ? 'rgba(134,242,228,0.2)' : 'var(--color-surface-container)',
                              color: int.connected ? 'var(--color-secondary)' : 'var(--color-outline)',
                            }}>
                              {int.connected ? '● Connected' : '○ Disconnected'}
                            </span>
                            <Toggle
                              checked={integrations[int.key]}
                              onChange={v => setIntegrations(p => ({ ...p, [int.key]: v }))}
                              id={`int-${int.key}`}
                            />
                          </div>
                        </div>
                        <p style={{ fontSize: '13px', color: 'var(--color-on-surface-variant)', marginTop: '6px' }}>{int.desc}</p>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--color-outline)' }}>
                            Last sync: <strong style={{ color: 'var(--color-on-surface-variant)' }}>{int.lastSync}</strong>
                          </span>
                          <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: 'var(--color-primary)', padding: 0 }}>
                            Configure →
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Display & Preferences */}
            {activeSection === 'display' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)' }}>Display & Preferences</h2>
                  <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>Customize how TransitOps looks and behaves for your team.</p>
                </div>
                {card(
                  <>
                    <Section title="Interface">
                      <FieldRow label="Theme" hint="Interface color scheme">
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {['light', 'dark', 'system'].map(t => (
                            <button key={t} onClick={() => setDisplay(p => ({ ...p, theme: t }))} style={{
                              padding: '8px 20px', borderRadius: '8px', cursor: 'pointer',
                              border: display.theme === t ? '2px solid var(--color-primary)' : '1px solid var(--color-outline-variant)',
                              backgroundColor: display.theme === t ? 'var(--color-primary-fixed)' : 'transparent',
                              color: display.theme === t ? 'var(--color-primary)' : 'var(--color-on-surface-variant)',
                              fontSize: '14px', fontWeight: display.theme === t ? '700' : '400',
                              textTransform: 'capitalize',
                            }}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </FieldRow>
                      <FieldRow label="Language">
                        <Select value={display.language} options={[
                          { value: 'en-US', label: 'English (US)' },
                          { value: 'en-GB', label: 'English (UK)' },
                          { value: 'es-US', label: 'Español (US)' },
                        ]} onChange={v => setDisplay(p => ({ ...p, language: v }))} />
                      </FieldRow>
                      <FieldRow label="Date Format">
                        <Select value={display.dateFormat} options={[
                          { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY (US)' },
                          { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY (EU)' },
                          { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
                        ]} onChange={v => setDisplay(p => ({ ...p, dateFormat: v }))} />
                      </FieldRow>
                      <FieldRow label="Time Format">
                        <Select value={display.timeFormat} options={[
                          { value: '12h', label: '12-hour (AM/PM)' },
                          { value: '24h', label: '24-hour' },
                        ]} onChange={v => setDisplay(p => ({ ...p, timeFormat: v }))} />
                      </FieldRow>
                    </Section>
                    <Section title="Dashboard">
                      <FieldRow label="Table Rows Per Page">
                        <Select value={display.tableRowsPerPage} options={['10','25','50','100'].map(v => ({ value: v, label: `${v} rows` }))} onChange={v => setDisplay(p => ({ ...p, tableRowsPerPage: v }))} />
                      </FieldRow>
                      <FieldRow label="Dashboard Auto-Refresh" hint="How often to refresh live data">
                        <Select value={display.dashboardRefreshSeconds} options={[
                          { value: '30', label: 'Every 30 seconds' },
                          { value: '60', label: 'Every 1 minute' },
                          { value: '300', label: 'Every 5 minutes' },
                          { value: '0', label: 'Manual only' },
                        ]} onChange={v => setDisplay(p => ({ ...p, dashboardRefreshSeconds: v }))} />
                      </FieldRow>
                    </Section>
                  </>
                )}
              </div>
            )}

            {/* Users & Roles */}
            {activeSection === 'users' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)' }}>Users & Roles</h2>
                    <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>Manage team members and their access permissions.</p>
                  </div>
                  <button style={{
                    display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
                    backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)',
                    borderRadius: '8px', border: 'none', cursor: 'pointer',
                    fontSize: '12px', fontWeight: '600',
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>person_add</span>
                    Invite User
                  </button>
                </div>
                <div style={{
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  border: '1px solid var(--color-outline-variant)',
                  borderRadius: '12px', overflow: 'hidden',
                  boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                        {['User', 'Role', 'Status', 'Last Login', 'Actions'].map((col, i) => (
                          <th key={col} style={{
                            padding: '14px 20px', fontSize: '12px', fontWeight: '600',
                            color: 'var(--color-on-surface-variant)', textTransform: 'uppercase',
                            letterSpacing: '0.05em', textAlign: i === 4 ? 'right' : 'left',
                          }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => (
                        <tr key={u.email} style={{
                          backgroundColor: i % 2 === 1 ? 'rgba(244,243,250,0.4)' : 'transparent',
                          borderTop: '1px solid rgba(197,197,211,0.3)',
                        }}>
                          <td style={{ padding: '14px 20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{
                                width: '36px', height: '36px', borderRadius: '50%',
                                backgroundColor: 'var(--color-primary-fixed)', color: 'var(--color-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '12px', fontWeight: '700', flexShrink: 0,
                              }}>
                                {u.avatar}
                              </div>
                              <div>
                                <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-on-surface)' }}>{u.name}</p>
                                <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '14px 20px', fontSize: '14px', color: 'var(--color-on-surface)' }}>{u.role}</td>
                          <td style={{ padding: '14px 20px' }}>
                            <span style={{
                              fontSize: '12px', fontWeight: '600', padding: '3px 10px', borderRadius: '9999px',
                              backgroundColor: u.status === 'Active' ? 'rgba(21,128,61,0.1)' : 'rgba(197,197,211,0.3)',
                              color: u.status === 'Active' ? '#15803d' : 'var(--color-outline)',
                            }}>
                              {u.status}
                            </span>
                          </td>
                          <td style={{ padding: '14px 20px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', color: 'var(--color-on-surface-variant)' }}>
                            {u.lastLogin}
                          </td>
                          <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)', padding: '4px' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>edit</span>
                              </button>
                              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-outline)', padding: '4px' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>more_vert</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{ marginTop: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--color-primary)', marginBottom: '12px' }}>Role Permissions</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {[
                      { role: 'Fleet Manager', permissions: ['Full access', 'Can manage users', 'Can export data', 'Settings access'], color: 'var(--color-primary)' },
                      { role: 'Operations Director', permissions: ['Full access', 'Can manage users', 'Can approve expenses', 'Read-only settings'], color: 'var(--color-secondary)' },
                      { role: 'Dispatcher', permissions: ['Trips & Drivers', 'Vehicle registry read', 'No financials', 'No settings'], color: '#b45309' },
                      { role: 'Analyst', permissions: ['Analytics read-only', 'Reports download', 'No write access', 'No settings'], color: '#15803d' },
                    ].map(r => (
                      <div key={r.role} style={{ padding: '16px', backgroundColor: 'var(--color-surface-container-lowest)', border: '1px solid var(--color-outline-variant)', borderRadius: '8px' }}>
                        <p style={{ fontSize: '14px', fontWeight: '700', color: r.color, marginBottom: '8px' }}>{r.role}</p>
                        {r.permissions.map(p => (
                          <p key={p} style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)', marginBottom: '3px' }}>
                            • {p}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Billing */}
            {activeSection === 'billing' && (
              <div>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: '600', color: 'var(--color-primary)' }}>Billing & Plan</h2>
                  <p style={{ fontSize: '14px', color: 'var(--color-on-surface-variant)', marginTop: '4px' }}>Manage your TransitOps subscription and payment details.</p>
                </div>
                {/* Current Plan */}
                <div style={{
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)',
                  borderRadius: '12px', padding: '24px', color: '#fff', marginBottom: '16px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <p style={{ fontSize: '12px', fontWeight: '600', letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.75 }}>Current Plan</p>
                      <h3 style={{ fontSize: '28px', fontWeight: '700', marginTop: '4px' }}>Enterprise</h3>
                      <p style={{ fontSize: '14px', opacity: 0.85, marginTop: '8px' }}>Up to 100 vehicles · Unlimited drivers · Priority support</p>
                    </div>
                    <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '4px 14px', borderRadius: '9999px', fontSize: '13px', fontWeight: '600' }}>
                      Active
                    </span>
                  </div>
                  <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.2)', display: 'flex', gap: '32px' }}>
                    <div>
                      <p style={{ fontSize: '12px', opacity: 0.7 }}>Monthly Cost</p>
                      <p style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace' }}>$2,400 / mo</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', opacity: 0.7 }}>Next Billing</p>
                      <p style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace' }}>Aug 1, 2025</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '12px', opacity: 0.7 }}>Vehicles</p>
                      <p style={{ fontSize: '20px', fontWeight: '700', fontFamily: 'JetBrains Mono, monospace' }}>42 / 100</p>
                    </div>
                  </div>
                </div>
                {card(
                  <Section title="Payment Method">
                    <FieldRow label="Card on File" hint="Primary payment method">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', backgroundColor: 'var(--color-surface-container-low)', borderRadius: '8px', width: 'fit-content' }}>
                        <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '20px' }}>credit_card</span>
                        <div>
                          <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-on-surface)' }}>Visa •••• •••• •••• 4892</p>
                          <p style={{ fontSize: '12px', color: 'var(--color-on-surface-variant)' }}>Expires 09/2027 · Transit Authority Card</p>
                        </div>
                        <button style={{ marginLeft: '24px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', color: 'var(--color-primary)' }}>
                          Update
                        </button>
                      </div>
                    </FieldRow>
                    <FieldRow label="Billing Email">
                      <Input value="billing@tocta.gov" type="email" />
                    </FieldRow>
                  </Section>
                )}
              </div>
            )}

            {/* Save Button */}
            {['organization','fleet','notifications','security','display'].includes(activeSection) && (
              <div style={{ marginTop: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  onClick={handleSave}
                  style={{
                    padding: '10px 28px', borderRadius: '8px',
                    backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)',
                    border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Save Changes
                </button>
                <button style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid var(--color-outline-variant)', background: 'transparent', cursor: 'pointer', fontSize: '14px', color: 'var(--color-on-surface-variant)' }}>
                  Discard
                </button>
                {saved && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#15803d', fontWeight: '600' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
                    Changes saved
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
