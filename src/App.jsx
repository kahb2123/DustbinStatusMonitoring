import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import BinStatus from './components/BinStatus/BinStatus';
import CollectionRoute from './components/CollectionRoute/CollectionRoute';
import Reports from './components/Reports/Reports';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/binstatus" element={<BinStatus />} />
            <Route path="/collection-route" element={<CollectionRoute />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;