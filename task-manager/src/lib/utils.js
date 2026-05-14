import { differenceInDays, format } from 'date-fns'

export const FREQUENCY_LABELS = {
  daily: 'Diaria',
  every_other_day: 'Día por medio',
  weekly: 'Semanal',
  biweekly: 'Cada 15 días',
  monthly: 'Mensual',
  bimonthly: 'Cada 2 meses'
}

export const FREQUENCY_ORDER = ['daily', 'every_other_day', 'weekly', 'biweekly', 'monthly', 'bimonthly']

export const STATUS_CONFIG = {
  pending:   { label: 'Pendiente',  icon: '⏳', color: '#f59e0b' },
  completed: { label: 'Hecho',      icon: '✅', color: '#10b981' },
  delegated: { label: 'Delegada',   icon: '🔄', color: '#818cf8' },
  cant_do:   { label: 'No puedo',   icon: '🚫', color: '#f87171' }
}

export const PERSON_CONFIG = {
  ana:      { label: 'Ana',     color: '#f472b6' },
  jhon:     { label: 'Jhon',    color: '#60a5fa' },
  both:     { label: 'Ambos',   color: '#a78bfa' },
  rotating: { label: 'Rotando', color: '#34d399' }
}

export function today() {
  return format(new Date(), 'yyyy-MM-dd')
}

export function isTaskDueToday(task, logs) {
  const freq = task.frequency
  if (freq === 'daily') return true
  const taskLogs = logs.filter(l => l.task_id === task.id && l.status === 'completed')
  if (!taskLogs.length) return true
  const last = taskLogs.sort((a, b) => new Date(b.due_date) - new Date(a.due_date))[0]
  const days = differenceInDays(new Date(), new Date(last.due_date))
  const thresholds = { every_other_day: 2, weekly: 7, biweekly: 14, monthly: 30, bimonthly: 60 }
  return days >= (thresholds[freq] || 1)
}
