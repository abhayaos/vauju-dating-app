import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Support from './pages/Support'
import HelpResources from './pages/HelpResources'
import ResourceDetail from './pages/ResourceDetail'
import PageNotFound from './pages/PageNotFound'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/support" element={<Support />} />
        <Route path="/help-resources" element={<HelpResources />} />
        <Route path="/help-resources/:categoryId/:resourceId" element={<ResourceDetail />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  )
}

export default App