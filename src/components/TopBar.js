'use client';

export default function TopBar({ title, subtitle }) {
  return (
    <header
      className="sticky top-0 z-40 flex justify-between items-center h-16 px-6"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-outline-variant)',
        boxShadow: '0px 1px 3px rgba(0,0,0,0.05)',
      }}
    >
      <div className="flex items-center gap-4 flex-1">
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
            className="w-full pl-10 pr-4 py-2 transition-all outline-none"
            style={{
              backgroundColor: 'var(--color-surface-container-low)',
              border: 'none',
              borderRadius: '24px',
              fontSize: '14px',
              color: 'var(--color-on-surface)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 35, 111, 0.2)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Action Button */}
        <button
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
        </button>

        {/* Icon Buttons */}
        <div className="flex items-center gap-2" style={{ color: 'var(--color-on-surface-variant)' }}>
          <button
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
          <button
            className="p-2 transition-all"
            style={{ borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-container-low)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span className="material-symbols-outlined" style={{ color: 'var(--color-on-surface-variant)' }}>
              help
            </span>
          </button>
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
