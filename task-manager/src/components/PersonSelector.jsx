export default function PersonSelector({ onSelect }) {
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 24px',
      background: 'var(--bg)',
      gap: '40px',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏠</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800, color: 'var(--text)', marginBottom: '8px' }}>
          HomeTasks
        </h1>
        <p style={{ color: 'var(--muted2)', fontSize: '15px' }}>¿Quién eres hoy?</p>
      </div>

      <div style={{ display: 'flex', gap: '16px', width: '100%', maxWidth: '340px' }}>
        {[
          { id: 'ana', label: 'Ana', emoji: '🌸', color: 'var(--accent-ana)' },
          { id: 'jhon', label: 'Jhon', emoji: '🐾', color: 'var(--accent-jhon)' },
        ].map(p => (
          <button key={p.id} onClick={() => onSelect(p.id)} style={{
            flex: 1,
            padding: '32px 16px',
            background: 'var(--surface)',
            border: `2px solid ${p.color}22`,
            borderRadius: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            transition: 'all 0.2s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = p.color; e.currentTarget.style.background = `${p.color}15` }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = `${p.color}22`; e.currentTarget.style.background = 'var(--surface)' }}
          >
            <span style={{ fontSize: '40px' }}>{p.emoji}</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700, color: p.color }}>
              {p.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
