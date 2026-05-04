import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { isOverdue, isDueSoon, formatDate } from '../utils/helpers'
import StatusChart from '../components/StatusChart'

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  )
}

export default function Dashboard() {
  const { tasks } = useApp()

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'Completed').length
    const pending = tasks.filter(t => t.status === 'Pending').length
    const overdue = tasks.filter(t => isOverdue(t.deadline, t.status))
    const needAttention = tasks.filter(t =>
      t.status === 'Pending' &&
      t.priority === 'High' &&
      isDueSoon(t.deadline, t.status, 3)
    )
    return { total, completed, pending, overdue, needAttention }
  }, [tasks])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Overview of your study progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Tasks" value={stats.total} color="text-gray-800 dark:text-gray-100" />
        <StatCard label="Completed" value={stats.completed} color="text-green-600 dark:text-green-400" />
        <StatCard label="Pending" value={stats.pending} color="text-yellow-600 dark:text-yellow-400" />
      </div>

      {/* Charts */}
      <StatusChart />

      {/* Overdue */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-red-600 dark:text-red-400">
            Overdue Tasks ({stats.overdue.length})
          </h2>
          <Link to="/tasks" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View all</Link>
        </div>
        {stats.overdue.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No overdue tasks.</p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {stats.overdue.slice(0, 5).map(task => (
              <li key={task.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{task.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{task.subjectName} — due {formatDate(task.deadline)}</p>
                </div>
                <span className="text-xs bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400 px-2 py-0.5 rounded">
                  Overdue
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Needs Attention */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-orange-600 dark:text-orange-400">
            Needs Attention — High Priority, Due Soon ({stats.needAttention.length})
          </h2>
        </div>
        {stats.needAttention.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-8">No urgent tasks at the moment.</p>
        ) : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {stats.needAttention.slice(0, 5).map(task => (
              <li key={task.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{task.title}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{task.subjectName} — due {formatDate(task.deadline)}</p>
                </div>
                <span className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400 px-2 py-0.5 rounded">
                  High
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
