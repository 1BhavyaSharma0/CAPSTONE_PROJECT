import React from 'react'
import { useApp } from '../context/AppContext'
import { formatDate, isOverdue, getDaysUntil } from '../utils/helpers'

const PRIORITY_STYLES = {
  High: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  Medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
  Low: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
}

export default function TaskCard({ task, onEdit }) {
  const { deleteTask, toggleTaskStatus } = useApp()
  const overdue = isOverdue(task.deadline, task.status)
  const daysUntil = getDaysUntil(task.deadline)
  const completed = task.status === 'Completed'

  function deadlineLabel() {
    if (completed) return `Completed — Due was ${formatDate(task.deadline)}`
    if (overdue) return `Overdue — was due ${formatDate(task.deadline)}`
    if (daysUntil === 0) return 'Due today'
    if (daysUntil === 1) return 'Due tomorrow'
    if (daysUntil !== null && daysUntil > 0) return `Due in ${daysUntil} days — ${formatDate(task.deadline)}`
    return formatDate(task.deadline)
  }

  return (
    <div className={`bg-white dark:bg-gray-800 border rounded-lg p-4 shadow-sm ${
      completed
        ? 'border-gray-200 dark:border-gray-700 opacity-70'
        : overdue
          ? 'border-red-300 dark:border-red-700'
          : 'border-gray-200 dark:border-gray-700'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <input
            type="checkbox"
            checked={completed}
            onChange={() => toggleTaskStatus(task.id)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-blue-600 cursor-pointer flex-shrink-0"
          />
          <div className="min-w-0">
            <p className={`text-sm font-medium leading-snug ${completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
              {task.title}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{task.subjectName || 'Unassigned'}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded font-medium flex-shrink-0 ${PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Low}`}>
          {task.priority}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className={`text-xs ${overdue && !completed ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
            {deadlineLabel()}
          </p>
          {task.notes && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate max-w-xs">{task.notes}</p>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`text-xs px-2 py-0.5 rounded ${
            completed
              ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {task.status}
          </span>
          <button
            onClick={() => onEdit(task)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-1"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (window.confirm('Delete this task?')) deleteTask(task.id)
            }}
            className="text-xs text-red-500 hover:underline px-1"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
