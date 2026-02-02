'use client'

import { useState } from 'react'
import { 
  Search, 
  Plus, 
  Filter,
  ClipboardList,
  Edit3,
  Trash2,
  X,
  Save,
  CheckCircle2,
  Circle,
  AlertTriangle,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  RotateCcw,
  Zap,
  Target,
  Clock
} from 'lucide-react'
import AdminNav from '@/components/admin/AdminNav'
import type { AdminUser } from '@/lib/admin'
import { useAdminLocale } from '@/lib/adminLocale'

interface WIPTask {
  id: number
  title: string
  next_step: string | null
  priority: 'critical' | 'high' | 'medium' | 'low'
  assigned_to: string | null
  status: string
  is_complete: boolean
  completed_at: string | null
  category: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

interface Stats {
  activeCount: number
  completedCount: number
  highPriorityCount: number
  criticalCount: number
}

interface WIPClientProps {
  user: AdminUser
  initialActiveTasks: WIPTask[]
  initialCompletedTasks: WIPTask[]
  stats: Stats
}

const priorityStyles = {
  critical: { 
    color: 'bg-red-100 text-red-700 border-red-200',
    dot: 'bg-red-500',
    icon: Zap
  },
  high: { 
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    dot: 'bg-orange-500',
    icon: ArrowUp
  },
  medium: { 
    color: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
    icon: Target
  },
  low: { 
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500',
    icon: Clock
  }
}

const teamMembers = ['Ben', 'Gundula', 'Andrea']

export default function WIPClient({ 
  user, 
  initialActiveTasks, 
  initialCompletedTasks,
  stats: initialStats 
}: WIPClientProps) {
  const { locale, t } = useAdminLocale()
  
  // Localized priority labels
  const priorityLabels = {
    critical: t('priorityCritical'),
    high: t('priorityHigh'),
    medium: t('priorityMedium'),
    low: t('priorityLow')
  }
  const [activeTasks, setActiveTasks] = useState<WIPTask[]>(initialActiveTasks)
  const [completedTasks, setCompletedTasks] = useState<WIPTask[]>(initialCompletedTasks)
  const [stats, setStats] = useState(initialStats)
  const [searchQuery, setSearchQuery] = useState('')
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTask, setEditingTask] = useState<WIPTask | null>(null)
  const [saving, setSaving] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    next_step: '',
    priority: 'medium' as 'critical' | 'high' | 'medium' | 'low',
    assigned_to: '',
    notes: ''
  })

  // Get unique assignees from tasks
  const uniqueAssignees = Array.from(new Set([
    ...teamMembers,
    ...activeTasks.map(t => t.assigned_to).filter(Boolean) as string[]
  ]))

  const filteredTasks = activeTasks.filter(t => {
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.next_step?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assigned_to?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter
    const matchesAssignee = assigneeFilter === 'all' || 
      (t.assigned_to && t.assigned_to.toLowerCase().includes(assigneeFilter.toLowerCase()))
    return matchesSearch && matchesPriority && matchesAssignee
  })

  const resetForm = () => {
    setFormData({ 
      title: '', 
      next_step: '', 
      priority: 'medium', 
      assigned_to: '', 
      notes: '' 
    })
  }

  const openAddModal = () => {
    resetForm()
    setEditingTask(null)
    setShowAddModal(true)
  }

  const openEditModal = (task: WIPTask) => {
    setFormData({
      title: task.title,
      next_step: task.next_step || '',
      priority: task.priority,
      assigned_to: task.assigned_to || '',
      notes: task.notes || ''
    })
    setEditingTask(task)
    setShowAddModal(true)
  }

  const closeModal = () => {
    setShowAddModal(false)
    setEditingTask(null)
    resetForm()
  }

  const handleSave = async () => {
    if (!formData.title.trim()) return
    setSaving(true)

    try {
      const endpoint = editingTask 
        ? `/api/admin/wip/${editingTask.id}`
        : '/api/admin/wip'
      
      const res = await fetch(endpoint, {
        method: editingTask ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      
      if (data.success) {
        if (editingTask) {
          setActiveTasks(prev => prev.map(t => t.id === editingTask.id ? data.task : t))
        } else {
          setActiveTasks(prev => [data.task, ...prev])
          setStats(prev => ({ ...prev, activeCount: prev.activeCount + 1 }))
        }
        closeModal()
      }
    } catch (error) {
      console.error('Error saving task:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleComplete = async (task: WIPTask) => {
    try {
      const res = await fetch(`/api/admin/wip/${task.id}/complete`, { method: 'POST' })
      const data = await res.json()
      
      if (data.success) {
        setActiveTasks(prev => prev.filter(t => t.id !== task.id))
        setCompletedTasks(prev => [data.task, ...prev])
        setStats(prev => ({
          ...prev,
          activeCount: prev.activeCount - 1,
          completedCount: prev.completedCount + 1,
          highPriorityCount: task.priority === 'high' ? prev.highPriorityCount - 1 : prev.highPriorityCount,
          criticalCount: task.priority === 'critical' ? prev.criticalCount - 1 : prev.criticalCount
        }))
      }
    } catch (error) {
      console.error('Error completing task:', error)
    }
  }

  const handleReopen = async (task: WIPTask) => {
    try {
      const res = await fetch(`/api/admin/wip/${task.id}/reopen`, { method: 'POST' })
      const data = await res.json()
      
      if (data.success) {
        setCompletedTasks(prev => prev.filter(t => t.id !== task.id))
        setActiveTasks(prev => [data.task, ...prev])
        setStats(prev => ({
          ...prev,
          activeCount: prev.activeCount + 1,
          completedCount: prev.completedCount - 1
        }))
      }
    } catch (error) {
      console.error('Error reopening task:', error)
    }
  }

  const handleDelete = async (id: number) => {
    const confirmMsg = locale === 'de' 
      ? 'Sind Sie sicher, dass Sie diese Aufgabe löschen möchten?' 
      : 'Are you sure you want to delete this task?'
    if (!confirm(confirmMsg)) return

    try {
      const res = await fetch(`/api/admin/wip/${id}`, { method: 'DELETE' })
      const data = await res.json()
      
      if (data.success) {
        const wasActive = activeTasks.find(t => t.id === id)
        if (wasActive) {
          setActiveTasks(prev => prev.filter(t => t.id !== id))
          setStats(prev => ({ ...prev, activeCount: prev.activeCount - 1 }))
        } else {
          setCompletedTasks(prev => prev.filter(t => t.id !== id))
          setStats(prev => ({ ...prev, completedCount: prev.completedCount - 1 }))
        }
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <AdminNav userName={user.name} userEmail={user.email} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-charcoal-900 to-charcoal-700 flex items-center justify-center shadow-sm">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-charcoal-900">{stats.activeCount}</p>
                <p className="text-charcoal-500 text-sm">{t('activeTasks')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center">
                <Zap className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-charcoal-900">{stats.criticalCount}</p>
                <p className="text-charcoal-500 text-sm">{t('critical')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-charcoal-900">{stats.highPriorityCount}</p>
                <p className="text-charcoal-500 text-sm">{t('highPriority')}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-cream-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-400 flex items-center justify-center shadow-gold">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-3xl font-semibold text-charcoal-900">{stats.completedCount}</p>
                <p className="text-charcoal-500 text-sm">{t('completed')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* WIP Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-cream-200 overflow-hidden">
          {/* Toolbar */}
          <div className="p-6 border-b border-cream-200 bg-cream-50/60">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-merriweather text-2xl text-charcoal-900">{t('wipTitle')}</h2>
                <p className="text-sm text-charcoal-500 mt-1">
                  {t('wipSubtitle')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-400" />
                  <input
                    type="text"
                    placeholder={t('searchTasks')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-cream-200 rounded-xl w-full sm:w-64 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none bg-white"
                  />
                </div>

                {/* Priority Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-charcoal-400" />
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as any)}
                    className="border border-cream-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none bg-white"
                  >
                    <option value="all">{t('allPriorities')}</option>
                    <option value="critical">{t('priorityCritical')}</option>
                    <option value="high">{t('priorityHigh')}</option>
                    <option value="medium">{t('priorityMedium')}</option>
                    <option value="low">{t('priorityLow')}</option>
                  </select>
                </div>

                {/* Assignee Filter */}
                <select
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                  className="border border-cream-200 rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none bg-white"
                >
                  <option value="all">{t('allAssignees')}</option>
                  {uniqueAssignees.map(assignee => (
                    <option key={assignee} value={assignee}>{assignee}</option>
                  ))}
                </select>

                {/* Add New */}
                <button
                  onClick={openAddModal}
                  className="bg-gradient-to-r from-gold-500 to-gold-400 text-white px-4 py-2.5 rounded-xl font-semibold hover:from-gold-400 hover:to-gold-300 transition-all flex items-center justify-center gap-2 shadow-gold"
                >
                  <Plus className="w-5 h-5" />
                  {t('addTask')}
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-50 border-b border-cream-200">
                <tr>
                  <th className="w-12 px-4 py-4"></th>
                  <th className="text-left px-4 py-4 text-sm font-semibold text-charcoal-700">{t('task')}</th>
                  <th className="text-left px-4 py-4 text-sm font-semibold text-charcoal-700">{t('nextStep')}</th>
                  <th className="text-left px-4 py-4 text-sm font-semibold text-charcoal-700">{t('priority')}</th>
                  <th className="text-left px-4 py-4 text-sm font-semibold text-charcoal-700">{t('assignedTo')}</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-charcoal-700">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <ClipboardList className="w-12 h-12 text-charcoal-300 mx-auto mb-4" />
                      <p className="text-charcoal-500">{t('noTasksFound')}</p>
                      <button 
                        onClick={openAddModal}
                        className="mt-4 text-gold-600 hover:text-gold-700 font-medium"
                      >
                        {t('addFirstTask')}
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => {
                    const PriorityIcon = priorityStyles[task.priority].icon
                    return (
                      <tr key={task.id} className="hover:bg-cream-50/50 transition-colors group">
                        <td className="px-4 py-4">
                          <button
                            onClick={() => handleComplete(task)}
                            className="p-1 rounded-full hover:bg-gold-100 transition-colors"
                            title={t('markComplete')}
                          >
                            <Circle className="w-5 h-5 text-charcoal-300 hover:text-gold-500" />
                          </button>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium text-charcoal-900">{task.title}</div>
                          {task.notes && (
                            <div className="text-xs text-charcoal-500 mt-1 truncate max-w-xs">{task.notes}</div>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          {task.next_step ? (
                            <span className="text-charcoal-600 text-sm">{task.next_step}</span>
                          ) : (
                            <span className="text-charcoal-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${priorityStyles[task.priority].color}`}>
                            <PriorityIcon className="w-3 h-3" />
                            {priorityLabels[task.priority]}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          {task.assigned_to ? (
                            <span className="inline-flex items-center gap-2 text-charcoal-700">
                              <span className="w-7 h-7 rounded-full bg-gradient-to-br from-gold-400 to-gold-500 flex items-center justify-center text-white text-xs font-semibold">
                                {task.assigned_to.split(',')[0].trim().charAt(0).toUpperCase()}
                              </span>
                              <span className="text-sm">{task.assigned_to}</span>
                            </span>
                          ) : (
                            <span className="text-charcoal-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEditModal(task)}
                              className="p-2 text-charcoal-500 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              className="p-2 text-charcoal-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination info */}
          <div className="p-4 border-t border-cream-200 bg-cream-50/40 text-sm text-charcoal-500">
            {t('showingOf')} {filteredTasks.length} {t('ofActive')} {activeTasks.length} {t('activeTasksLabel')}
          </div>
        </div>

        {/* Completed Tasks Section */}
        {completedTasks.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-cream-200 overflow-hidden">
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="w-full p-4 flex items-center justify-between bg-cream-50/60 hover:bg-cream-100/60 transition-colors"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="font-medium text-charcoal-700">{t('completedTasks')} ({completedTasks.length})</span>
              </div>
              {showCompleted ? (
                <ChevronDown className="w-5 h-5 text-charcoal-500" />
              ) : (
                <ChevronRight className="w-5 h-5 text-charcoal-500" />
              )}
            </button>
            
            {showCompleted && (
              <div className="divide-y divide-cream-100">
                {completedTasks.map((task) => (
                  <div key={task.id} className="p-4 flex items-center justify-between hover:bg-cream-50/50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-charcoal-500 line-through">{task.title}</p>
                        {task.completed_at && (
                          <p className="text-xs text-charcoal-400 mt-0.5">
                            {locale === 'de' ? 'Erledigt am' : 'Completed'} {new Date(task.completed_at).toLocaleDateString(locale === 'de' ? 'de-DE' : 'en-US')}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleReopen(task)}
                        className="p-2 text-charcoal-500 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors flex items-center gap-1"
                        title={t('reopen')}
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span className="text-sm">{t('reopen')}</span>
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-2 text-charcoal-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-cream-200">
              <h2 className="font-merriweather text-xl text-charcoal-900">
                {editingTask ? t('editTask') : t('addTask')}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-cream-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-charcoal-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-2">{t('taskTitle')} *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  placeholder={t('whatNeedsToBeDone')}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-2">{t('nextStep')}</label>
                <input
                  type="text"
                  value={formData.next_step}
                  onChange={(e) => setFormData(prev => ({ ...prev, next_step: e.target.value }))}
                  className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  placeholder={t('immediateNextAction')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">{t('priority')}</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  >
                    <option value="critical">🔴 {t('priorityCritical')}</option>
                    <option value="high">🟠 {t('priorityHigh')}</option>
                    <option value="medium">🟡 {t('priorityMedium')}</option>
                    <option value="low">🟢 {t('priorityLow')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-charcoal-700 mb-2">{t('assignedTo')}</label>
                  <select
                    value={formData.assigned_to}
                    onChange={(e) => setFormData(prev => ({ ...prev, assigned_to: e.target.value }))}
                    className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none"
                  >
                    <option value="">{t('unassigned')}</option>
                    {teamMembers.map(member => (
                      <option key={member} value={member}>{member}</option>
                    ))}
                    <option value="Ben, Gundula">Ben, Gundula</option>
                    <option value="Gundula, Andrea">Gundula, Andrea</option>
                    <option value="Andrea, Ben">Andrea, Ben</option>
                    <option value="Ben, Gundula, Andrea">{t('everyone')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-charcoal-700 mb-2">{t('notes')}</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-cream-200 rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 outline-none resize-none"
                  placeholder={t('anyAdditionalContext')}
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-cream-200 bg-cream-50 flex items-center justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2.5 border border-cream-200 rounded-xl font-semibold text-charcoal-700 hover:bg-cream-100 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.title.trim()}
                className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2.5 rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? (locale === 'de' ? 'Speichern...' : 'Saving...') : editingTask ? t('updateTask') : t('addTask')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
