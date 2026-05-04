import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'
import { buildCompletionChartData, buildStatusChartData } from '../utils/helpers'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'

const PIE_COLORS = ['#f59e0b', '#10b981']

export default function StatusChart() {
  const { tasks } = useApp()
  const { darkMode } = useTheme()

  const barData = buildCompletionChartData(tasks)
  const pieData = buildStatusChartData(tasks)

  const axisColor = darkMode ? '#9ca3af' : '#6b7280'
  const gridColor = darkMode ? '#374151' : '#e5e7eb'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Bar Chart */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Tasks Completed (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: axisColor }} />
            <YAxis tick={{ fontSize: 11, fill: axisColor }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: darkMode ? '#1f2937' : '#fff',
                border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                borderRadius: '6px',
                fontSize: '12px',
                color: darkMode ? '#f3f4f6' : '#111827',
              }}
            />
            <Bar dataKey="Completed" fill="#3b82f6" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Status Distribution</h3>
        {tasks.length === 0 ? (
          <div className="flex items-center justify-center h-[180px] text-gray-400 dark:text-gray-500 text-sm">
            No tasks yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="value"
                paddingAngle={3}
              >
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: darkMode ? '#1f2937' : '#fff',
                  border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: darkMode ? '#f3f4f6' : '#111827',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', color: axisColor }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
