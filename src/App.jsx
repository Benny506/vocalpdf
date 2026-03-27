import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/landing/LandingPage'
import ReaderDashboard from './components/reader/ReaderDashboard'
import AlertContainer from './components/common/AlertContainer'
import AppLoader from './components/common/AppLoader'

function App() {
  return (
    <Router>
      {/* Global UI Components */}
      <AlertContainer />
      <AppLoader />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/reader" element={<ReaderDashboard />} />
      </Routes>
    </Router>
  )
}


export default App
