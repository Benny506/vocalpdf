import React from 'react'
import { BrowserRouter as Router, Routes, Route, HashRouter } from 'react-router-dom'
import LandingPage from './components/landing/LandingPage'
import ReaderDashboard from './components/reader/ReaderDashboard'
import AlertContainer from './components/common/AlertContainer'
import AppLoader from './components/common/AppLoader'

function App() {
  return (
    <HashRouter>
      {/* Global UI Components */}
      <AlertContainer />
      <AppLoader />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/reader" element={<ReaderDashboard />} />
      </Routes>
    </HashRouter>
  )
}


export default App
