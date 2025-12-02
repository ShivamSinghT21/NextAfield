import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Admin from './pages/Admin.jsx'
import Quiz from './pages/Quiz.jsx'

const App = () => {
  return (
    <>
    <Routes>
        <Route path="/" element={<Quiz />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  )
}

export default App
