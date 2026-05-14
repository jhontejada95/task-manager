const PERSON_CONFIG = {
  ana: { label: 'Ana', emoji: '🌸', color: 'var(--accent-ana)' },
  jhon: { label: 'Jhon', emoji: '🐾', color: 'var(--accent-jhon)' },
}

function StreakCard({ personId, streak }) {
  const p = PERSON_CONFIG[personId]
  const current = streak?.current_streak ?? 0
  const best = streak?.best_streak ?? 0

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${p.color}30`,
      borderRadius: 'var(--r)',
      padding: '20px',
      flex: 1,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '22px' }}>{p.emoji}</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: p.color, fontSize: '17px' }}>{p.label}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Racha actual</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 800, color: current > 0 ? 'var(--orange)' : 'var(--muted)' }}>{current}</span>
            <span style={{ fontSize: '14px', color: 'var(--muted2)' }}>días {current > 0 ? '🔥' : ''}</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Mejor racha</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700, color: 'var(--muted2)' }}>
            {best} {best > 0 ? '⭐' : ''}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StatsView({ streaks, completions, tasks, person }) {
  const todayCompleted = completions.filter(c => c.status === 'completed')
  const todayCant = completions.filter(c => c.status === 'cant_do')
  const todayDelegated = completions.filter(c => c.status === 'delegated')

  return (
    <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700 }}>Estadísticas</h1>

      {/* Streaks */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
          🔥 Rachas
        </h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <StreakCard personId="ana" streak={streaks?.ana} />
          <StreakCard personId="jhon" streak={streaks?.jhon} />
        </div>
      </div>

      {/* Today summary */}
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px' }}>
          Resumen de hoy
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {[
            { label: 'Completadas', count: todayCompleted.length, color: 'var(--green)', emoji: '✅' },
            { label: 'No pude', count: todayCant.length, color: 'var(--orange)', emoji: '⚠️' },
            { label: 'Delegadas', count: todayDelegated.length, color: 'var(--purple)', emoji: '📤' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r)',
              padding: '14px 10px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '22px', marginBottom: '6px' }}>{stat.emoji}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 800, color: stat.color }}>{stat.count}</div>
              <div style={{ fontSize: '11px', color: 'var(--muted2)', marginTop: '2px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Total tasks */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--r)', padding: '16px' }}>
        <div style={{ fontSize: '13px', color: 'var(--muted2)', marginBottom: '6px' }}>Total de tareas registradas</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 800 }}>{tasks.length}</div>
        <div style={{ fontSize: '13px', color: 'var(--muted2)', marginTop: '4px' }}>tareas en el hogar</div>
      </div>
    </div>
  )
}
