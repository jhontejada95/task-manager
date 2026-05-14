import { useState } from 'react'
import TaskCard from './TaskCard'
import { FREQUENCY_LABELS } from '../lib/tasks'

export default function AllTasksView({ allGroups, completions, person, getCompletionForTask, onAction, onOpenModal, loading }) {
  const [expanded, setExpanded] = useState(() => {
    const obj = {}
    allGroups.forEach(g => { obj[g.freq] = true })
    return obj
  })

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 0', color: 'var(--muted2)' }}>
      Cargando...
    </div>
  )

  return (
    <div style={{ paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 700 }}>Todas las tareas</h1>
      {allGroups.map(({ freq, tasks }) => (
        <div key={freq}>
          <button onClick={() => setExpanded(e => ({ ...e, [freq]: !e[freq] }))} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            width: '100%', padding: '8px 0', cursor: 'pointer',
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '13px', fontWeight: 600, color: 'var(--muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {FREQUENCY_LABELS[freq]}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--muted)', background: 'var(--surface2)', padding: '2px 8px', borderRadius: '10px' }}>{tasks.length}</span>
              <span style={{ color: 'var(--muted)', fontSize: '16px', transform: expanded[freq] ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s', display: 'inline-block' }}>▾</span>
            </div>
          </button>
          {expanded[freq] && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tasks.map((task, i) => (
                <TaskCard key={task.id} task={task} completion={getCompletionForTask(task.id)} person={person} onAction={onAction} onOpenModal={onOpenModal} style={{ animationDelay: `${i * 20}ms`, opacity: 0 }} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
