import React, { useState } from 'react'
import { useApp } from '../context/AppContext'

const emptyForm = { name: '', color: '#3b82f6' }

export default function SubjectManager() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useApp()
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Subject name cannot be empty.')
      return
    }
    const isDuplicate = subjects.some(
      s => s.name.toLowerCase() === form.name.trim().toLowerCase() && s.id !== editingId
    )
    if (isDuplicate) {
      setError('A subject with this name already exists.')
      return
    }

    if (editingId) {
      updateSubject(editingId, { name: form.name.trim(), color: form.color })
      setEditingId(null)
    } else {
      addSubject({ name: form.name.trim(), color: form.color })
    }
    setForm(emptyForm)
    setError('')
  }

  function startEdit(subject) {
    setEditingId(subject.id)
    setForm({ name: subject.name, color: subject.color })
    setError('')
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
  }

  const inputClass = "px-3 py-2 border rounded text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500"

  return (
    <div className="space-y-6">
      {/* Add / Edit Form */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100 mb-4">
          {editingId ? 'Edit Subject' : 'Add New Subject'}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Subject Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={`${inputClass} w-full`}
              placeholder="e.g. Biology"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                name="color"
                value={form.color}
                onChange={handleChange}
                className="w-10 h-10 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">{form.color}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded font-medium"
            >
              {editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>

      {/* Subject List */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            All Subjects ({subjects.length})
          </h2>
        </div>

        {subjects.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-10">No subjects added yet.</p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {subjects.map(subject => (
              <li key={subject.id} className="flex items-center justify-between px-5 py-3">
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: subject.color }}
                  />
                  <span className="text-sm text-gray-800 dark:text-gray-200">{subject.name}</span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(subject)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete subject "${subject.name}"? Tasks using this subject will be unassigned.`)) {
                        deleteSubject(subject.id)
                      }
                    }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
