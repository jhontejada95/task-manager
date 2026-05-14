export default function TabBar({ tab, onChange, todayCount }) {
  const tabs = [
    { id: 'today', icon: '☀️', label: 'Hoy', badge: todayCount },
    { id: 'all', icon: '📋', label: 'Todas', badge: 0 },
    { id: 'stats', icon: '📊', label: 'Stats', badge: 0 },
  ]

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '480px',
      height: 'var(--tab-h)',
      background: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      padding: '0 8px',
      paddingBottom: 'env(safe-area-inset-bottom)',
      zIndex: 100,
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          padding: '8px',
          position: 'relative',
          transition: 'all 0.15s',
          opacity: tab === t.id ? 1 : 0.45,
        }}>
          <span style={{ fontSize: '22px', lineHeight: 1 }}>{t.icon}</span>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-display)', fontWeight: 600, letterSpacing: '0.5px', color: tab === t.id ? 'var(--text)' : 'var(--muted2)' }}>
            {t.label}
          </span>
          {t.badge > 0 && (
            <span style={{
              position: 'absolute', top: '6px', right: 'calc(50% - 18px)',
              background: 'var(--accent-ana)', color: 'white',
              borderRadius: '10px', minWidth: '18px', height: '18px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', fontWeight: 700, padding: '0 4px',
            }}>
              {t.badge}
            </span>
          )}
        </button>
      ))}
    </nav>
  )
}
