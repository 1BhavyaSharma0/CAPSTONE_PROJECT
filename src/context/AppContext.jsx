import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AppContext = createContext()

const DEFAULT_SUBJECTS = [
  { id: '1', name: 'Mathematics', color: '#3b82f6' },
  { id: '2', name: 'Physics', color: '#10b981' },
  { id: '3', name: 'Chemistry', color: '#f59e0b' },
  { id: '4', name: 'English', color: '#8b5cf6' },
]

function loadFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Failed to save to localStorage', e)
  }
}

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState(() => loadFromStorage('ssp_tasks', []))
  const [subjects, setSubjects] = useState(() => loadFromStorage('ssp_subjects', DEFAULT_SUBJECTS))
  const [isLoggedIn, setIsLoggedIn] = useState(() => loadFromStorage('ssp_loggedIn', false))

  useEffect(() => { saveToStorage('ssp_tasks', tasks) }, [tasks])
  useEffect(() => { saveToStorage('ssp_subjects', subjects) }, [subjects])
  useEffect(() => { saveToStorage('ssp_loggedIn', isLoggedIn) }, [isLoggedIn])

  // ---------- Task CRUD ----------
  const addTask = useCallback((task) => {
    const newTask = {
      ...task,
      id: Date.now().toString(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
    }
    setTasks(prev => [newTask, ...prev])
  }, [])

  const updateTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const toggleTaskStatus = useCallback((id) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed', completedAt: t.status === 'Pending' ? new Date().toISOString() : null }
          : t
      )
    )
  }, [])

  // ---------- Subject CRUD ----------
  const addSubject = useCallback((subject) => {
    const newSubject = { ...subject, id: Date.now().toString() }
    setSubjects(prev => [...prev, newSubject])
  }, [])

  const updateSubject = useCallback((id, updates) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s))
  }, [])

  const deleteSubject = useCallback((id) => {
    // Remove subject and untag tasks with that subject
    setSubjects(prev => prev.filter(s => s.id !== id))
    setTasks(prev => prev.map(t => t.subjectId === id ? { ...t, subjectId: '', subjectName: 'Unassigned' } : t))
  }, [])

  // ---------- Auth ----------
  const login = useCallback((username, password) => {
    if (username.trim() && password.trim()) {
      setIsLoggedIn(true)
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setIsLoggedIn(false)
  }, [])

  return (
    <AppContext.Provider value={{
      tasks,
      subjects,
      isLoggedIn,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      addSubject,
      updateSubject,
      deleteSubject,
      login,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
