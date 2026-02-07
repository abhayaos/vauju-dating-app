import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import PageNotFound from './pages/PageNotFound'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Download from './pages/Download'
import About from './pages/About'
import Safety from './pages/Safety'
import Features from './pages/Features'

function App() {
  return (
    <Router>
      <Navbar />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/download" element={<Download />} />
        <Route path="/about" element={<About />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/features" element={<Features />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App