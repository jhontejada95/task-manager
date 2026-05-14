import { useState, useEffect, useCallback } from 'react'
import { supabase } from './lib/supabase'
import { todayStr, getTasksDueToday, groupByFrequency } from './lib/tasks'
import Header from './components/Header'
import TabBar from './components/TabBar'
import TodayView from './components/TodayView'
import AllTasksView from './components/AllTasksView'
import StatsView from './components/StatsView'
import PersonSelector from './components/PersonSelector'
import TaskModal from './components/TaskModal'
import './app.css'

export default function App() {
  const [person, setPerson] = useState(() => localStorage.getItem('hometasks_person') || null)
  const [tab, setTab] = useState('today')
  const [tasks, setTasks] = useState([])
  const [completions, setCompletions] = useState([])
  const [streaks, setStreaks] = useState({ ana: { current_streak: 0, best_streak: 0 }, jhon: { current_streak: 0, best_streak: 0 } })
  const [loading, setLoading] = useState(true)
  const [selectedTask, setSelectedTask] = useState(null)
  const [modalMode, setModalMode] = useState(null)

  const today = todayStr()

  const loadData = useCallback(async () => {
    const [{ data: tasksData }, { data: completionsData }, { data: streaksData }] = await Promise.all([
      supabase.from('tasks').select('*').eq('is_active', true).order('frequency'),
      supabase.from('task_completions').select('*').eq('due_date', today),
      supabase.from('streaks').select('*'),
    ])
    if (tasksData) setTasks(tasksData)
    if (completionsData) setCompletions(completionsData)
    if (streaksData) {
      const map = {}
      streaksData.forEach(s => { map[s.person] = s })
      setStreaks(map)
    }
    setLoading(false)
  }, [today])

  useEffect(() => { loadData() }, [loadData])

  // Realtime subscription
  useEffect(() => {
    const channel = supabase.channel('task-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'task_completions' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'streaks' }, () => loadData())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [loadData])

  const handleSelectPerson = (p) => {
    localStorage.setItem('hometasks_person', p)
    setPerson(p)
  }

  const getCompletionForTask = (taskId) =>
    completions.find(c => c.task_id === taskId && c.completed_by === person)

  const handleTaskAction = async (task, status, extra = {}) => {
    if (!person) return
    const existing = getCompletionForTask(task.id)

    if (existing) {
      await supabase.from('task_completions').update({
        status,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
        notes: extra.notes ?? existing.notes,
        delegated_to: extra.delegated_to ?? null,
      }).eq('id', existing.id)
    } else {
      await supabase.from('task_completions').insert({
        task_id: task.id,
        completed_by: person,
        status,
        due_date: today,
        completed_at: status === 'completed' ? new Date().toISOString() : null,
        notes: extra.notes ?? null,
        delegated_to: extra.delegated_to ?? null,
      })
    }

    // Update streak if completed
    if (status === 'completed') {
      await updateStreak(person)
    }

    setSelectedTask(null)
    setModalMode(null)
    loadData()
  }

  const updateStreak = async (p) => {
    const current = streaks[p]
    if (!current) return
    const lastDate = current.last_active_date
    const todayDate = new Date(today)
    const lastActive = lastDate ? new Date(lastDate) : null
    const diff = lastActive ? Math.floor((todayDate - lastActive) / 86400000) : null

    let newStreak = current.current_streak
    if (diff === null || diff > 1) newStreak = 1
    else if (diff === 1) newStreak = current.current_streak + 1
    // diff === 0 = same day, no change

    const newBest = Math.max(current.best_streak || 0, newStreak)
    await supabase.from('streaks').update({
      current_streak: newStreak,
      best_streak: newBest,
      last_active_date: today,
      updated_at: new Date().toISOString(),
    }).eq('person', p)
  }

  const openModal = (task, mode) => {
    setSelectedTask(task)
    setModalMode(mode)
  }

  if (!person) return <PersonSelector onSelect={handleSelectPerson} />

  const todayTasks = getTasksDueToday(tasks)
  const allGroups = groupByFrequency(tasks)

  const viewProps = { tasks, todayTasks, allGroups, completions, person, today, getCompletionForTask, onAction: handleTaskAction, onOpenModal: openModal, loading }

  return (
    <div className="app">
      <Header person={person} streaks={streaks} onChangePerson={() => { localStorage.removeItem('hometasks_person'); setPerson(null) }} />
      <main className="main">
        {tab === 'today' && <TodayView {...viewProps} />}
        {tab === 'all' && <AllTasksView {...viewProps} />}
        {tab === 'stats' && <StatsView streaks={streaks} completions={completions} tasks={tasks} person={person} />}
      </main>
      <TabBar tab={tab} onChange={setTab} todayCount={todayTasks.filter(t => !getCompletionForTask(t.id) || getCompletionForTask(t.id)?.status === 'pending').length} />
      {selectedTask && (
        <TaskModal task={selectedTask} mode={modalMode} person={person} existing={getCompletionForTask(selectedTask.id)} onAction={handleTaskAction} onClose={() => { setSelectedTask(null); setModalMode(null) }} />
      )}
    </div>
  )
}
