import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Dashboard from './pages/Dashboard';
import TwitterCallback from './pages/TwitterCallback';
import Navbar from './components/navbar/Navbar';
import { Web3Provider } from './contexts/Web3Context';


function App() {
  return (
    <Web3Provider>
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/twitter/callback" element={<TwitterCallback />} />
          </Routes>
        </main>
      </div>
    </Router>
    </Web3Provider>
  );
}

export default App;