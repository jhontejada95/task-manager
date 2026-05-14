import { STATUS_CONFIG, PERSON_LABELS } from '../lib/tasks'

const STATUS_BG = {
  completed: 'rgba(107,203,119,0.12)',
  pending: 'transparent',
  cant_do: 'rgba(255,165,82,0.12)',
  delegated: 'rgba(167,139,250,0.12)',
}

export default function TaskCard({ task, completion, person, onAction, onOpenModal, style = {} }) {
  const status = completion?.status ?? 'pending'
  const cfg = STATUS_CONFIG[status]
  const isCompleted = status === 'completed'

  const handleTap = () => {
    if (status === 'pending' || !completion) {
      onAction(task, 'completed')
    } else {
      onOpenModal(task, 'detail')
    }
  }

  const assignedLabel = task.assigned_to === 'rotating'
    ? null
    : PERSON_LABELS[task.assigned_to]

  return (
    <div onClick={handleTap} style={{
      background: isCompleted ? STATUS_BG.completed : `${STATUS_BG[status]}`,
      border: `1px solid ${isCompleted ? 'rgba(107,203,119,0.25)' : 'var(--border)'}`,
      borderRadius: 'var(--r)',
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      transition: 'all 0.15s',
      animation: 'fadeUp 0.25s ease forwards',
      ...style,
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = isCompleted ? STATUS_BG.completed : 'var(--surface2)' }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = isCompleted ? 'rgba(107,203,119,0.25)' : 'var(--border)'; e.currentTarget.style.background = isCompleted ? STATUS_BG.completed : STATUS_BG[status] }}
    >
      {/* Status indicator */}
      <div style={{
        width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '14px', fontWeight: 700,
        background: isCompleted ? 'var(--green)' : 'var(--surface2)',
        border: isCompleted ? 'none' : '1.5px solid var(--border2)',
        color: isCompleted ? 'white' : cfg.color,
        transition: 'all 0.2s',
      }}>
        {cfg.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: '15px',
          fontWeight: 500,
          color: isCompleted ? 'var(--muted2)' : 'var(--text)',
          textDecoration: isCompleted ? 'line-through' : 'none',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          transition: 'all 0.2s',
        }}>
          {task.title}
        </div>
        <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
          {completion?.delegated_to && (
            <span style={{ fontSize: '11px', color: 'var(--purple)', background: 'rgba(167,139,250,0.12)', padding: '1px 6px', borderRadius: '10px' }}>
              → {PERSON_LABELS[completion.delegated_to]}
            </span>
          )}
          {completion?.notes && (
            <span style={{ fontSize: '11px', color: 'var(--muted2)', background: 'var(--surface2)', padding: '1px 6px', borderRadius: '10px' }}>
              📝 nota
            </span>
          )}
          {assignedLabel && (
            <span style={{ fontSize: '11px', color: 'var(--muted)', background: 'var(--surface2)', padding: '1px 6px', borderRadius: '10px' }}>
              {assignedLabel}
            </span>
          )}
        </div>
      </div>

      {/* Quick actions */}
      {!isCompleted && (
        <div style={{ display: 'flex', gap: '6px' }} onClick={e => e.stopPropagation()}>
          <button onClick={() => onOpenModal(task, 'cant')} style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'var(--surface2)', border: '1px solid var(--border)',
            fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
          title="No puedo"
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,165,82,0.2)'; e.currentTarget.style.borderColor = 'var(--orange)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            !
          </button>
          <button onClick={() => onOpenModal(task, 'delegate')} style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'var(--surface2)', border: '1px solid var(--border)',
            fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
          title="Delegar"
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(167,139,250,0.2)'; e.currentTarget.style.borderColor = 'var(--purple)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface2)'; e.currentTarget.style.borderColor = 'var(--border)' }}
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
