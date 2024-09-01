import React from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SideBar } from './Components/SideBar'
import Landing from './Components/Landing'
import { DarkModeProvider } from './Context/DarkModeContext'

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <div className="flex flex-col md:flex-row h-screen overflow-hidden">
          <SideBar />
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Landing />} />
            </Routes>
          </div>
        </div>
      </Router>
    </DarkModeProvider>
  );
}

export default App
