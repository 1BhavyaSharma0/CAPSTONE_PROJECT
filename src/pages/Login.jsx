import React, { useState } from 'react'
import { useApp } from '../context/AppContext'

export default function Login() {
  const { login } = useApp()
  const [form, setForm] = useState({ username: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loginError, setLoginError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
    if (loginError) setLoginError('')
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = {}
    if (!form.username.trim()) errs.username = 'Username is required.'
    if (!form.password.trim()) errs.password = 'Password is required.'
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const success = login(form.username, form.password)
    if (!success) {
      setLoginError('Invalid credentials. Please try again.')
    }
  }

  const inputClass = "w-full px-3 py-2 border rounded text-sm border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-900"
  const errorClass = "text-red-500 text-xs mt-1"

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-full max-w-sm p-8">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-gray-800">Study Planner</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter any username"
              autoComplete="username"
            />
            {errors.username && <p className={errorClass}>{errors.username}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter any password"
              autoComplete="current-password"
            />
            {errors.password && <p className={errorClass}>{errors.password}</p>}
          </div>

          {loginError && (
            <p className="text-red-500 text-sm text-center">{loginError}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium"
          >
            Sign In
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-5">
          No real authentication — enter any username and password.
        </p>
      </div>
    </div>
  )
}
