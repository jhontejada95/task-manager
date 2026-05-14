const PERSON_CONFIG = {
  ana: { label: 'Ana', emoji: '🌸', color: 'var(--accent-ana)' },
  jhon: { label: 'Jhon', emoji: '🐾', color: 'var(--accent-jhon)' },
}

export default function Header({ person, streaks, onChangePerson }) {
  const p = PERSON_CONFIG[person]
  const streak = streaks?.[person]
  const other = person === 'ana' ? 'jhon' : 'ana'
  const otherP = PERSON_CONFIG[other]
  const otherStreak = streaks?.[other]

  return (
    <header style={{
      padding: '16px 16px 12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button onClick={onChangePerson} style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          padding: '6px 12px', borderRadius: '40px',
          background: `${p.color}18`, border: `1px solid ${p.color}40`,
          cursor: 'pointer', transition: 'all 0.2s',
        }}>
          <span style={{ fontSize: '18px' }}>{p.emoji}</span>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: p.color, fontSize: '15px' }}>{p.label}</span>
        </button>
        {streak?.current_streak > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '20px', background: 'rgba(255,160,0,0.12)', border: '1px solid rgba(255,160,0,0.25)' }}>
            <span style={{ fontSize: '14px' }}>🔥</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--orange)' }}>{streak.current_streak}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.7 }}>
          <span style={{ fontSize: '13px', color: 'var(--muted2)' }}>{otherP.label}</span>
          <span style={{ fontSize: '15px' }}>{otherP.emoji}</span>
          {otherStreak?.current_streak > 0 && (
            <span style={{ fontSize: '12px', color: 'var(--orange)' }}>🔥{otherStreak.current_streak}</span>
          )}
        </div>
      </div>
    </header>
  )
}
