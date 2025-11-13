import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Employees from './pages/Employees';

export default function App() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 20 }}>
      <header>
        <h1>PIXmint</h1>
        <nav>
          <Link to="/">Home</Link> | <Link to="/employees">Employees</Link>
        </nav>
      </header>
      <main style={{ marginTop: 20 }}>
        <Routes>
          <Route path="/" element={<div>Welcome to PIXmint!!!</div>} />
          <Route path="/employees" element={<Employees />} />
        </Routes>
      </main>
    </div>
  );
}
