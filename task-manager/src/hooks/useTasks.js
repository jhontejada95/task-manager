import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { today } from '../lib/utils'

export function useTasks() {
  const [tasks, setTasks] = useState([])
  const [logs, setLogs] = useState([])
  const [streaks, setStreaks] = useState({ ana: { current_streak: 0, best_streak: 0 }, jhon: { current_streak: 0, best_streak: 0 } })
  const [loading, setLoading] = useState(true)

  const fetchAll = useCallback(async () => {
    const since = new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const [{ data: t }, { data: l }, { data: s }] = await Promise.all([
      supabase.from('tasks').select('*').eq('is_active', true).order('created_at'),
      supabase.from('task_completions').select('*').gte('due_date', since),
      supabase.from('streaks').select('*')
    ])
    if (t) setTasks(t)
    if (l) setLogs(l)
    if (s) {
      const base = { ana: { current_streak: 0, best_streak: 0 }, jhon: { current_streak: 0, best_streak: 0 } }
      s.forEach(row => { if (base[row.person]) base[row.person] = row })
      setStreaks(base)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchAll()
    const ch = supabase.channel('rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_completions' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'streaks' }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, fetchAll)
      .subscribe()
    return () => supabase.removeChannel(ch)
  }, [fetchAll])

  const getTodayLog = useCallback((taskId) =>
    logs.find(l => l.task_id === taskId && l.due_date === today())
  , [logs])

  const upsertLog = useCallback(async (taskId, status, person, note = null) => {
    const existing = getTodayLog(taskId)
    const payload = {
      task_id: taskId,
      due_date: today(),
      status,
      completed_by: status === 'completed' ? person : null,
      delegated_to: status === 'delegated' ? (person === 'ana' ? 'jhon' : 'ana') : null,
      notes: note,
      completed_at: status === 'completed' ? new Date().toISOString() : null
    }
    if (existing) {
      await supabase.from('task_completions').update(payload).eq('id', existing.id)
    } else {
      await supabase.from('task_completions').insert(payload)
    }
    if (status === 'completed') await updateStreak(person)
    fetchAll()
  }, [getTodayLog, fetchAll])

  const updateStreak = async (person) => {
    const todayStr = today()
    const { data: existing } = await supabase.from('streaks').select('*').eq('person', person).maybeSingle()
    if (!existing) {
      await supabase.from('streaks').insert({ person, current_streak: 1, best_streak: 1, last_active_date: todayStr })
      return
    }
    if (existing.last_active_date === todayStr) return
    const diff = Math.floor((new Date(todayStr) - new Date(existing.last_active_date)) / 86400000)
    const newCurrent = diff === 1 ? existing.current_streak + 1 : 1
    const newBest = Math.max(existing.best_streak, newCurrent)
    await supabase.from('streaks').update({ current_streak: newCurrent, best_streak: newBest, last_active_date: todayStr }).eq('person', person)
  }

  const assignTask = useCallback(async (taskId, person) => {
    await supabase.from('tasks').update({ assigned_to: person }).eq('id', taskId)
    fetchAll()
  }, [fetchAll])

  const updateTaskNote = useCallback(async (taskId, note) => {
    await supabase.from('tasks').update({ notes: note }).eq('id', taskId)
    fetchAll()
  }, [fetchAll])

  return { tasks, logs, streaks, loading, getTodayLog, upsertLog, assignTask, updateTaskNote }
}
