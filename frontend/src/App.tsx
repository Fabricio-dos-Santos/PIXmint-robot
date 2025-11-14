import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Employees from './pages/Employees';
import Sidebar from './components/Sidebar';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onNewEmployee={() => setEmployeeModalOpen(true)} />
      <main style={{
        marginLeft: sidebarCollapsed ? '60px' : '240px',
        width: '100%',
        minHeight: '100vh',
        transition: 'margin-left 0.3s ease',
      }}>
        <div style={{ padding: 20 }}>
          <Routes>
            <Route path="/" element={<div style={{ color: '#e5e7eb' }}>Welcome to PIXmint!!!</div>} />
            <Route 
              path="/employees" 
              element={
                <Employees 
                  externalModalOpen={employeeModalOpen}
                  onCloseExternalModal={() => setEmployeeModalOpen(false)}
                />
              } 
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}
