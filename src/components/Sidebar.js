'use client';

import { useState } from 'react';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', href: '/' },
  { label: 'Vehicle Registry', icon: 'directions_bus', href: '/vehicles' },
  { label: 'Driver Management', icon: 'person_pin_circle', href: '/drivers' },
  { label: 'Trip Management', icon: 'route', href: '/trips' },
  { label: 'Maintenance', icon: 'build', href: '/maintenance' },
  { label: 'Fuel & Expenses', icon: 'payments', href: '/fuel' },
  { label: 'Analytics', icon: 'analytics', href: '/analytics' },
];

const bottomItems = [
  { label: 'Settings', icon: 'settings', href: '/settings' },
  { label: 'Support', icon: 'help_center', href: '/support' },
];

export default function Sidebar({ activePath }) {
  return (
    <aside className="fixed left-0 top-0 h-full w-60 flex flex-col py-4 z-50"
      style={{
        backgroundColor: 'var(--color-background)',
        borderRight: '1px solid var(--color-outline-variant)',
      }}
    >
      {/* Logo */}
      <div className="px-6 mb-8">
        <h1 style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '24px',
          fontWeight: '700',
          lineHeight: '32px',
          color: 'var(--color-primary)',
        }}>
          TransitOps
        </h1>
        <p style={{
          fontSize: '12px',
          color: 'var(--color-on-surface-variant)',
          opacity: 0.7,
          fontWeight: '600',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>
          Fleet Management
        </p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 space-y-1 px-3 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = activePath === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 transition-colors duration-200"
              style={{
                color: isActive ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)',
                fontWeight: isActive ? '700' : '400',
                borderLeft: isActive ? '4px solid var(--color-secondary)' : '4px solid transparent',
                backgroundColor: isActive ? 'rgba(134, 242, 228, 0.1)' : 'transparent',
                borderRadius: isActive ? '0 4px 4px 0' : '4px',
                fontSize: '14px',
                lineHeight: '20px',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--color-secondary)';
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-container-high)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--color-on-surface-variant)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '20px',
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Bottom Items */}
      <div className="px-3 pt-4 mt-auto space-y-1"
        style={{ borderTop: '1px solid rgba(197, 197, 211, 0.3)' }}
      >
        {bottomItems.map((item) => {
          const isActive = activePath === item.href;
          return (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 transition-colors duration-200"
              style={{
                color: isActive ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)',
                fontWeight: isActive ? '700' : '400',
                borderLeft: isActive ? '4px solid var(--color-secondary)' : '4px solid transparent',
                backgroundColor: isActive ? 'rgba(134, 242, 228, 0.1)' : 'transparent',
                borderRadius: isActive ? '0 4px 4px 0' : '4px',
                fontSize: '14px',
                lineHeight: '20px',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--color-secondary)';
                  e.currentTarget.style.backgroundColor = 'var(--color-surface-container-high)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = 'var(--color-on-surface-variant)';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '20px',
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </div>
    </aside>
  );
}
