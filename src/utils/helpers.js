export function isOverdue(deadline, status) {
  if (status === 'Completed') return false
  if (!deadline) return false
  return new Date(deadline) < new Date()
}

export function isDueSoon(deadline, status, daysThreshold = 3) {
  if (status === 'Completed') return false
  if (!deadline) return false
  const now = new Date()
  const due = new Date(deadline)
  const diffMs = due - now
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays >= 0 && diffDays <= daysThreshold
}

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function getDaysUntil(dateStr) {
  if (!dateStr) return null
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const due = new Date(dateStr)
  due.setHours(0, 0, 0, 0)
  return Math.round((due - now) / (1000 * 60 * 60 * 24))
}

export function priorityOrder(priority) {
  const map = { High: 0, Medium: 1, Low: 2 }
  return map[priority] ?? 3
}

// Build chart data: tasks completed per day (last 7 days)
export function buildCompletionChartData(tasks) {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    d.setHours(0, 0, 0, 0)
    days.push(d)
  }

  return days.map(day => {
    const label = day.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
    const count = tasks.filter(t => {
      if (!t.completedAt) return false
      const completed = new Date(t.completedAt)
      completed.setHours(0, 0, 0, 0)
      return completed.getTime() === day.getTime()
    }).length
    return { date: label, Completed: count }
  })
}

// Build status distribution chart data
export function buildStatusChartData(tasks) {
  const pending = tasks.filter(t => t.status === 'Pending').length
  const completed = tasks.filter(t => t.status === 'Completed').length
  return [
    { name: 'Pending', value: pending },
    { name: 'Completed', value: completed },
  ]
}
