'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function TopBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ vehicles: [], drivers: [], trips: [] });
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const [showQuickAction, setShowQuickAction] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const quickActionRef = useRef(null);
  const notificationsRef = useRef(null);
  const helpRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (quickActionRef.current && !quickActionRef.current.contains(event.target)) {
        setShowQuickAction(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (helpRef.current && !helpRef.current.contains(event.target)) {
        setShowHelp(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search results when query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ vehicles: [], drivers: [], trips: [] });
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const [vRes, dRes, tRes] = await Promise.all([
          fetch('/api/vehicles?limit=50'),
          fetch('/api/drivers?limit=50'),
          fetch('/api/trips?limit=50'),
        ]);
        const vData = await vRes.json();
        const dData = await dRes.json();
        const tData = await tRes.json();

        const query = searchQuery.toLowerCase();

        const filteredVehicles = (vData.data || []).filter(
          v => v.id.toLowerCase().includes(query) || v.type.toLowerCase().includes(query) || v.make.toLowerCase().includes(query)
        );

        const filteredDrivers = (dData.data || []).filter(
          d => d.name.toLowerCase().includes(query) || d.id.toLowerCase().includes(query) || d.license.toLowerCase().includes(query)
        );

        const filteredTrips = (tData.data || []).filter(
          t => t.id.toLowerCase().includes(query) || t.vehicle.toLowerCase().includes(query) || t.driver.toLowerCase().includes(query)
        );

        setSearchResults({
          vehicles: filteredVehicles.slice(0, 3),
          drivers: filteredDrivers.slice(0, 3),
          trips: filteredTrips.slice(0, 3),
        });
        setShowSearchDropdown(true);
      } catch (err) {
        console.error('Search failed', err);
      }
    }, 150);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const quickActions = [
    { label: 'Add Vehicle', icon: 'directions_bus', href: '/vehicles?modal=add-vehicle' },
    { label: 'Add Driver', icon: 'person_add', href: '/drivers?modal=add-driver' },
    { label: 'Create Trip', icon: 'route', href: '/trips?modal=create-trip' },
    { label: 'Log Service', icon: 'build', href: '/maintenance?modal=log-service' },
    { label: 'Log Expense', icon: 'payments', href: '/fuel?modal=log-expense' },
  ];

  const staticAlerts = [
    { text: 'Johnathan Smith — CDL Class B expires in 3 days', type: 'error', href: '/drivers?modal=license-smith' },
    { text: 'Maria Garcia — Hazmat Endorsement expires in 12 days', type: 'warning', href: '/drivers?modal=license-garcia' },
    { text: 'Bus #4022 — Brake System Overhaul required', type: 'error', href: '/maintenance?modal=brake-4022' },
    { text: 'Van #108 — Routine Oil Change is 450 miles overdue', type: 'warning', href: '/maintenance?modal=oil-108' },
  ];

  const helpLinks = [
    { label: 'Help Center / FAQs', icon: 'help', href: '/support?section=faq' },
    { label: 'Documentation Guides', icon: 'menu_book', href: '/support?section=docs' },
    { label: 'Submit Support Ticket', icon: 'confirmation_number', href: '/support?section=new-ticket' },
    { label: 'Contact Helpdesk', icon: 'contact_support', href: '/support?section=contact' },
    { label: 'System Service Status', icon: 'monitor_heart', href: '/support?section=status' },
  ];

  const navigateTo = (href) => {
    setShowQuickAction(false);
    setShowNotifications(false);
    setShowHelp(false);
    setShowSearchDropdown(false);
    router.push(href);
  };

  return (
    <header
      className="sticky top-0 z-40 flex justify-between items-center h-16 px-6"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-outline-variant)',
        boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      {/* Search Bar */}
      <div className="flex items-center gap-4 flex-1 relative" ref={searchRef}>
        <div className="relative w-full max-w-md">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--color-outline)', fontSize: '20px' }}
          >
            search
          </span>
          <input
            type="text"
            placeholder="Search fleet, drivers, or trips..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="w-full pl-10 pr-4 py-2 transition-all outline-none"
            style={{
              backgroundColor: 'var(--color-surface-container-low)',
              border: 'none',
              borderRadius: '24px',
              fontSize: '14px',
              color: 'var(--color-on-surface)',
            }}
            onFocusCapture={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 35, 111, 0.2)';
            }}
            onBlurCapture={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults({ vehicles: [], drivers: [], trips: [] });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer"
              style={{ color: 'var(--color-outline)' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
            </button>
          )}
        </div>

        {/* Live Search Dropdown */}
        {showSearchDropdown && searchQuery && (
          <div
            className="absolute top-12 left-0 w-full max-w-md rounded-xl p-3 shadow-lg z-50"
            style={{
              backgroundColor: 'var(--color-surface-container-lowest)',
              border: '1px solid var(--color-outline-variant)',
            }}
          >
            {searchResults.vehicles.length === 0 &&
            searchResults.drivers.length === 0 &&
            searchResults.trips.length === 0 ? (
              <p className="text-center p-3 text-sm" style={{ color: 'var(--color-outline)' }}>
                No matches found for "{searchQuery}"
              </p>
            ) : (
              <div className="space-y-3">
                {searchResults.vehicles.length > 0 && (
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-outline)', letterSpacing: '0.08em', paddingLeft: '8px', marginBottom: '4px' }}>
                      Vehicles
                    </p>
                    {searchResults.vehicles.map(v => (
                      <button
                        key={v.id}
                        onClick={() => navigateTo(`/vehicles?search=${v.id}`)}
                        className="w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm" style={{ color: 'var(--color-primary)' }}>directions_bus</span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface)' }}>{v.id}</span>
                        <span style={{ fontSize: '12px', color: 'var(--color-outline)' }}>{v.type} ({v.make})</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.drivers.length > 0 && (
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-outline)', letterSpacing: '0.08em', paddingLeft: '8px', marginBottom: '4px' }}>
                      Drivers
                    </p>
                    {searchResults.drivers.map(d => (
                      <button
                        key={d.id}
                        onClick={() => navigateTo(`/drivers?search=${d.name}`)}
                        className="w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm" style={{ color: 'var(--color-secondary)' }}>badge</span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface)' }}>{d.name}</span>
                        <span style={{ fontSize: '12px', color: 'var(--color-outline)' }}>{d.id} · {d.license}</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.trips.length > 0 && (
                  <div>
                    <p style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--color-outline)', letterSpacing: '0.08em', paddingLeft: '8px', marginBottom: '4px' }}>
                      Trips
                    </p>
                    {searchResults.trips.map(t => (
                      <button
                        key={t.id}
                        onClick={() => navigateTo(`/trips?search=${t.id}`)}
                        className="w-full text-left px-2 py-1.5 rounded-lg flex items-center gap-2 hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm" style={{ color: '#b45309' }}>route</span>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-on-surface)' }}>{t.id}</span>
                        <span style={{ fontSize: '12px', color: 'var(--color-outline)' }}>{t.from} → {t.to}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Nav Actions */}
      <div className="flex items-center gap-4">
        {/* Quick Action Button */}
        <div className="relative" ref={quickActionRef}>
          <button
            onClick={() => setShowQuickAction(!showQuickAction)}
            className="flex items-center gap-2 px-4 py-2 transition-all"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: '600',
              letterSpacing: '0.05em',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            Quick Action
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_drop_down</span>
          </button>

          {showQuickAction && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-xl py-1 shadow-lg z-50"
              style={{
                backgroundColor: 'var(--color-surface-container-lowest)',
                border: '1px solid var(--color-outline-variant)',
              }}
            >
              {quickActions.map(action => (
                <button
                  key={action.label}
                  onClick={() => navigateTo(action.href)}
                  className="w-full text-left px-4 py-2 flex items-center gap-3 text-sm hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'var(--color-outline)' }}>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Icon Buttons */}
        <div className="flex items-center gap-2" style={{ color: 'var(--color-on-surface-variant)' }}>
          {/* Notifications */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 transition-all relative"
              style={{ borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-container-low)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span className="material-symbols-outlined" style={{ color: 'var(--color-on-surface-variant)' }}>
                notifications
              </span>
              <span
                className="absolute top-2 right-2 w-2 h-2 rounded-full border-2"
                style={{
                  backgroundColor: 'var(--color-error)',
                  borderColor: 'var(--color-surface)',
                }}
              />
            </button>

            {showNotifications && (
              <div
                className="absolute right-0 mt-2 w-80 rounded-xl p-3 shadow-lg z-50"
                style={{
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  border: '1px solid var(--color-outline-variant)',
                }}
              >
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-100">
                  <p style={{ fontSize: '13px', fontWeight: '700', color: 'var(--color-primary)' }}>System Alerts</p>
                  <span style={{ fontSize: '10px', color: 'var(--color-error)', fontWeight: '700', backgroundColor: 'rgba(186,26,26,0.1)', padding: '2px 8px', borderRadius: '12px' }}>
                    {staticAlerts.length} Alerts
                  </span>
                </div>
                <div className="space-y-2">
                  {staticAlerts.map((alert, i) => (
                    <button
                      key={i}
                      onClick={() => navigateTo(alert.href)}
                      className="w-full text-left p-2 rounded-lg text-xs hover:bg-slate-50 border-none bg-transparent cursor-pointer flex gap-2 items-start"
                      style={{ color: 'var(--color-on-surface)' }}
                    >
                      <span className="material-symbols-outlined text-sm" style={{ color: alert.type === 'error' ? 'var(--color-error)' : '#b45309', marginTop: '1px' }}>
                        {alert.type === 'error' ? 'error' : 'warning'}
                      </span>
                      <span>{alert.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Help & Support */}
          <div className="relative" ref={helpRef}>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 transition-all"
              style={{ borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-container-low)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span className="material-symbols-outlined" style={{ color: 'var(--color-on-surface-variant)' }}>
                help
              </span>
            </button>

            {showHelp && (
              <div
                className="absolute right-0 mt-2 w-60 rounded-xl p-2 shadow-lg z-50"
                style={{
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  border: '1px solid var(--color-outline-variant)',
                }}
              >
                <div className="p-2 border-b border-gray-100">
                  <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-outline)' }}>Quick Help & Center</p>
                </div>
                <div className="py-1">
                  {helpLinks.map(link => (
                    <button
                      key={link.label}
                      onClick={() => navigateTo(link.href)}
                      className="w-full text-left px-3 py-2 flex items-center gap-3 text-xs hover:bg-slate-100 border-none bg-transparent cursor-pointer"
                      style={{ color: 'var(--color-on-surface)' }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-outline)' }}>{link.icon}</span>
                      {link.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Profile */}
        <div
          className="flex items-center gap-3 pl-4"
          style={{ borderLeft: '1px solid var(--color-outline-variant)' }}
        >
          <div className="text-right">
            <p style={{ fontSize: '12px', fontWeight: '600', color: 'var(--color-on-surface)' }}>
              Alex Rivera
            </p>
            <p style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-outline)',
            }}>
              Fleet Manager
            </p>
          </div>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{
              backgroundColor: 'var(--color-primary-container)',
              border: '2px solid var(--color-primary-container)',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-container) 100%)',
            }}
          >
            AR
          </div>
        </div>
      </div>
    </header>
  );
}
