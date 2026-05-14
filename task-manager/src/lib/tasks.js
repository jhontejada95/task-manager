import { format, isToday, differenceInDays, startOfDay, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export const FREQUENCY_LABELS = {
  daily: 'Diaria',
  every_other_day: 'Día de por medio',
  weekly: 'Semanal',
  biweekly: 'Cada 15 días',
  monthly: 'Mensual',
  bimonthly: 'Cada 2 meses',
}

export const PERSON_LABELS = {
  ana: 'Ana',
  jhon: 'Jhon',
  both: 'Ambos',
  rotating: 'Rotando',
}

export const STATUS_CONFIG = {
  completed: { label: 'Completada', color: 'var(--green)', icon: '✓' },
  pending: { label: 'Pendiente', color: 'var(--muted)', icon: '○' },
  cant_do: { label: 'No puedo', color: 'var(--orange)', icon: '!' },
  delegated: { label: 'Delegada', color: 'var(--purple)', icon: '→' },
}

export function todayStr() {
  return format(new Date(), 'yyyy-MM-dd')
}

export function isTaskDueToday(task, referenceDate = new Date()) {
  const freq = task.frequency
  if (freq === 'daily') return true

  const created = task.created_at ? new Date(task.created_at) : new Date()
  const daysSinceCreation = differenceInDays(startOfDay(referenceDate), startOfDay(created))

  if (freq === 'every_other_day') return daysSinceCreation % 2 === 0
  if (freq === 'weekly') return referenceDate.getDay() === 1 // lunes
  if (freq === 'biweekly') {
    const weekOfYear = Math.floor(daysSinceCreation / 7)
    return referenceDate.getDay() === 1 && weekOfYear % 2 === 0
  }
  if (freq === 'monthly') return referenceDate.getDate() === 1
  if (freq === 'bimonthly') return referenceDate.getDate() === 1 && referenceDate.getMonth() % 2 === 0

  return false
}

export function formatDateLabel(dateStr) {
  const date = parseISO(dateStr)
  if (isToday(date)) return 'Hoy'
  return format(date, "d 'de' MMMM", { locale: es })
}

export function getTasksDueToday(tasks) {
  return tasks.filter(t => t.is_active && isTaskDueToday(t))
}

export function groupByFrequency(tasks) {
  const groups = {}
  for (const task of tasks) {
    const freq = task.frequency
    if (!groups[freq]) groups[freq] = []
    groups[freq].push(task)
  }
  const order = ['daily', 'every_other_day', 'weekly', 'biweekly', 'monthly', 'bimonthly']
  return order.filter(f => groups[f]).map(f => ({ freq: f, tasks: groups[f] }))
}
