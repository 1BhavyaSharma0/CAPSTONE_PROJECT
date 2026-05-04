import React from 'react'
import SubjectManager from '../components/SubjectManager'

export default function Subjects() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Subjects</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          Manage the subjects you want to study
        </p>
      </div>
      <SubjectManager />
    </div>
  )
}
