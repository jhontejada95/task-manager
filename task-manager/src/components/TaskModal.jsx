import { useState } from 'react'

const PERSON_CONFIG = {
  ana: { label: 'Ana', emoji: '🌸' },
  jhon: { label: 'Jhon', emoji: '🐾' },
}

export default function TaskModal({ task, mode, person, existing, onAction, onClose }) {
  const [notes, setNotes] = useState(existing?.notes ?? '')
  const [delegateTo, setDelegateTo] = useState('')
  const other = person === 'ana' ? 'jhon' : 'ana'

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div onClick={handleOverlayClick} style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.65)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      backdropFilter: 'blur(4px)',
    }}>
      <div style={{
        background: 'var(--surface)',
        borderRadius: '20px 20px 0 0',
        width: '100%',
        maxWidth: '480px',
        padding: '24px 20px 36px',
        animation: 'slideIn 0.25s ease forwards',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        {/* Handle */}
        <div style={{ width: '40px', height: '4px', background: 'var(--border2)', borderRadius: '2px', alignSelf: 'center' }} />

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 700, lineHeight: 1.3 }}>
          {task.title}
        </h3>

        {/* Notes field - always visible */}
        <div>
          <label style={{ fontSize: '13px', color: 'var(--muted2)', display: 'block', marginBottom: '6px' }}>
            📝 Nota (opcional)
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Agrega un comentario..."
            rows={3}
            style={{
              width: '100%', padding: '10px 12px',
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 'var(--r-sm)', color: 'var(--text)',
              fontFamily: 'var(--font-body)', fontSize: '14px',
              resize: 'none', outline: 'none',
            }}
          />
        </div>

        {/* Mode-specific content */}
        {mode === 'delegate' && (
          <div>
            <label style={{ fontSize: '13px', color: 'var(--muted2)', display: 'block', marginBottom: '8px' }}>
              Delegar a:
            </label>
            <button onClick={() => setDelegateTo(delegateTo === other ? '' : other)} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px', borderRadius: 'var(--r)',
              background: delegateTo === other ? 'rgba(167,139,250,0.2)' : 'var(--surface2)',
              border: `1px solid ${delegateTo === other ? 'var(--purple)' : 'var(--border)'}`,
              transition: 'all 0.15s', width: '100%',
            }}>
              <span style={{ fontSize: '20px' }}>{PERSON_CONFIG[other].emoji}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{PERSON_CONFIG[other].label}</span>
              {delegateTo === other && <span style={{ marginLeft: 'auto', color: 'var(--purple)' }}>✓</span>}
            </button>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {mode === 'cant' && (
            <ActionBtn
              label="⚠️ Marcar como 'No puedo'"
              color="var(--orange)"
              bg="rgba(255,165,82,0.15)"
              border="rgba(255,165,82,0.35)"
              onClick={() => onAction(task, 'cant_do', { notes })}
            />
          )}

          {mode === 'delegate' && (
            <ActionBtn
              label={`📤 Delegar a ${delegateTo ? PERSON_CONFIG[delegateTo].label : '...'}`}
              color="var(--purple)"
              bg="rgba(167,139,250,0.15)"
              border="rgba(167,139,250,0.35)"
              disabled={!delegateTo}
              onClick={() => onAction(task, 'delegated', { notes, delegated_to: delegateTo })}
            />
          )}

          {mode === 'detail' && (
            <>
              <ActionBtn
                label="✓ Marcar como completada"
                color="var(--green)"
                bg="rgba(107,203,119,0.15)"
                border="rgba(107,203,119,0.35)"
                onClick={() => onAction(task, 'completed', { notes })}
              />
              <ActionBtn
                label="○ Volver a pendiente"
                color="var(--muted2)"
                bg="var(--surface2)"
                border="var(--border)"
                onClick={() => onAction(task, 'pending', { notes })}
              />
            </>
          )}

          {/* Save notes only */}
          {(mode === 'cant' || mode === 'delegate' || mode === 'detail') && notes !== (existing?.notes ?? '') && (
            <ActionBtn
              label="💾 Guardar nota"
              color="var(--accent-jhon)"
              bg="rgba(78,205,196,0.12)"
              border="rgba(78,205,196,0.3)"
              onClick={() => onAction(task, existing?.status ?? 'pending', { notes })}
            />
          )}

          <button onClick={onClose} style={{
            padding: '12px', borderRadius: 'var(--r)',
            background: 'transparent', border: '1px solid var(--border)',
            color: 'var(--muted2)', fontSize: '15px', transition: 'all 0.15s',
          }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

function ActionBtn({ label, color, bg, border, onClick, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      padding: '14px', borderRadius: 'var(--r)',
      background: bg, border: `1px solid ${border}`,
      color: color, fontSize: '15px', fontWeight: 600,
      fontFamily: 'var(--font-body)', transition: 'all 0.15s',
      opacity: disabled ? 0.4 : 1, cursor: disabled ? 'not-allowed' : 'pointer',
    }}>
      {label}
    </button>
  )
}
