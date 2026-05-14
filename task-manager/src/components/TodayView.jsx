import TaskCard from './TaskCard'

export default function TodayView({ todayTasks, completions, person, getCompletionForTask, onAction, onOpenModal, loading }) {
  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0', color: 'var(--muted2)' }}>
      Cargando...
    </div>
  )

  const pending = todayTasks.filter(t => {
    const c = getCompletionForTask(t.id)
    return !c || c.status === 'pending'
  })
  const done = todayTasks.filter(t => {
    const c = getCompletionForTask(t.id)
    return c && c.status !== 'pending'
  })

  const pct = todayTasks.length > 0 ? Math.round((done.length / todayTasks.length) * 100) : 0

  return (
    <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', alignItems: 'baseline' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700 }}>Tareas de hoy</span>
          <span style={{ color: 'var(--muted2)', fontSize: '13px' }}>{done.length}/{todayTasks.length}</span>
        </div>
        <div style={{ height: '6px', background: 'var(--surface2)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: pct === 100 ? 'var(--green)' : 'linear-gradient(90deg, var(--accent-jhon), var(--accent-ana))',
            borderRadius: '3px',
            transition: 'width 0.4s ease',
          }} />
        </div>
        {pct === 100 && (
          <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '22px' }}>
            🎉 <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px', color: 'var(--green)' }}>¡Todo listo por hoy!</span>
          </div>
        )}
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
            Pendientes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pending.map((task, i) => (
              <TaskCard key={task.id} task={task} completion={getCompletionForTask(task.id)} person={person} onAction={onAction} onOpenModal={onOpenModal} style={{ animationDelay: `${i * 30}ms`, opacity: 0 }} />
            ))}
          </div>
        </div>
      )}

      {/* Done */}
      {done.length > 0 && (
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '10px' }}>
            Completadas
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {done.map((task, i) => (
              <TaskCard key={task.id} task={task} completion={getCompletionForTask(task.id)} person={person} onAction={onAction} onOpenModal={onOpenModal} style={{ animationDelay: `${i * 30}ms`, opacity: 0 }} />
            ))}
          </div>
        </div>
      )}

      {todayTasks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted2)' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🌙</div>
          <div>No hay tareas para hoy</div>
        </div>
      )}
    </div>
  )
}
