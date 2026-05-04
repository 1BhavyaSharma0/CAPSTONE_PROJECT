import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

const PRIORITIES = ['Low', 'Medium', 'High']

const emptyForm = {
  title: '',
  subjectId: '',
  subjectName: '',
  deadline: '',
  priority: 'Medium',
  notes: '',
}

export default function TaskForm({ existingTask, onClose }) {
  const { subjects, addTask, updateTask } = useApp()
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (existingTask) {
      setForm({
        title: existingTask.title || '',
        subjectId: existingTask.subjectId || '',
        subjectName: existingTask.subjectName || '',
        deadline: existingTask.deadline || '',
        priority: existingTask.priority || 'Medium',
        notes: existingTask.notes || '',
      })
    }
  }, [existingTask])

  function validate() {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title is required.'
    if (!form.subjectId) errs.subjectId = 'Please select a subject.'
    if (!form.deadline) errs.deadline = 'Deadline is required.'
    return errs
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))

    // Auto-fill subjectName when subjectId changes
    if (name === 'subjectId') {
      const found = subjects.find(s => s.id === value)
      setForm(prev => ({ ...prev, subjectId: value, subjectName: found ? found.name : '' }))
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    if (existingTask) {
      updateTask(existingTask.id, { ...form })
    } else {
      addTask({ ...form })
    }
    onClose()
  }

  const inputClass = "w-full px-3 py-2 border rounded text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
  const errorClass = "text-red-500 text-xs mt-1"

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800 dark:text-gray-100">
            {existingTask ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className={inputClass}
              placeholder="e.g. Complete Chapter 5 exercises"
            />
            {errors.title && <p className={errorClass}>{errors.title}</p>}
          </div>

          <div>
            <label className={labelClass}>Subject *</label>
            <select
              name="subjectId"
              value={form.subjectId}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">-- Select Subject --</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            {errors.subjectId && <p className={errorClass}>{errors.subjectId}</p>}
          </div>

          <div>
            <label className={labelClass}>Deadline *</label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              className={inputClass}
            />
            {errors.deadline && <p className={errorClass}>{errors.deadline}</p>}
          </div>

          <div>
            <label className={labelClass}>Priority</label>
            <select name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label className={labelClass}>Notes (optional)</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className={inputClass}
              placeholder="Any extra details..."
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium"
            >
              {existingTask ? 'Save Changes' : 'Add Task'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-2 rounded text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
