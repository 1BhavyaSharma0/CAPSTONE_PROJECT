import React, { useState, useMemo, useCallback } from 'react'
import { useApp } from '../context/AppContext'
import { useDebounce } from '../hooks/useDebounce'
import { isOverdue, priorityOrder } from '../utils/helpers'
import TaskList from '../components/TaskList'
import TaskForm from '../components/TaskForm'

const STATUSES = ['All', 'Pending', 'Completed']
const PRIORITIES = ['All', 'High', 'Medium', 'Low']

export default function Tasks() {
  const { tasks, subjects } = useApp()

  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [searchInput, setSearchInput] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [filterSubject, setFilterSubject] = useState('All')
  const [sortBy, setSortBy] = useState('deadline')

  const debouncedSearch = useDebounce(searchInput, 300)

  const filteredTasks = useMemo(() => {
    let result = [...tasks]

    // Search
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.subjectName || '').toLowerCase().includes(q)
      )
    }

    // Status filter
    if (filterStatus !== 'All') {
      result = result.filter(t => t.status === filterStatus)
    }

    // Priority filter
    if (filterPriority !== 'All') {
      result = result.filter(t => t.priority === filterPriority)
    }

    // Subject filter
    if (filterSubject !== 'All') {
      result = result.filter(t => t.subjectId === filterSubject)
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'deadline') {
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline) - new Date(b.deadline)
      }
      if (sortBy === 'priority') {
        return priorityOrder(a.priority) - priorityOrder(b.priority)
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title)
      }
      return 0
    })

    return result
  }, [tasks, debouncedSearch, filterStatus, filterPriority, filterSubject, sortBy])

  const handleEdit = useCallback((task) => {
    setEditingTask(task)
    setShowForm(true)
  }, [])

  const handleCloseForm = useCallback(() => {
    setShowForm(false)
    setEditingTask(null)
  }, [])

  const selectClass = "px-2 py-1.5 border rounded text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Tasks</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {filteredTasks.length} of {tasks.length} tasks shown
          </p>
        </div>
        <button
          onClick={() => { setEditingTask(null); setShowForm(true) }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded font-medium"
        >
          + Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm space-y-3">
        {/* Search */}
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          placeholder="Search by title or subject..."
          className="w-full px-3 py-2 border rounded text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />

        {/* Filter Row */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-gray-500 dark:text-gray-400">Status:</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={selectClass}>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-xs text-gray-500 dark:text-gray-400">Priority:</label>
            <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)} className={selectClass}>
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-xs text-gray-500 dark:text-gray-400">Subject:</label>
            <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)} className={selectClass}>
              <option value="All">All</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1.5 ml-auto">
            <label className="text-xs text-gray-500 dark:text-gray-400">Sort by:</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={selectClass}>
              <option value="deadline">Deadline</option>
              <option value="priority">Priority</option>
              <option value="title">Title</option>
            </select>
          </div>

          {(filterStatus !== 'All' || filterPriority !== 'All' || filterSubject !== 'All' || searchInput) && (
            <button
              onClick={() => {
                setFilterStatus('All')
                setFilterPriority('All')
                setFilterSubject('All')
                setSearchInput('')
              }}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      <TaskList tasks={filteredTasks} onEdit={handleEdit} />

      {/* Modal */}
      {showForm && (
        <TaskForm existingTask={editingTask} onClose={handleCloseForm} />
      )}
    </div>
  )
}
