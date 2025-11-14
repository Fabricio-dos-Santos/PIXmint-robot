import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Employees from './pages/Employees';
import Sidebar from './components/Sidebar';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [importViewOpen, setImportViewOpen] = useState(false);
  const location = useLocation();
  
  // Reset import view and modal when navigating away from employees
  React.useEffect(() => {
    if (location.pathname !== '/employees') {
      setImportViewOpen(false);
      setEmployeeModalOpen(false);
    }
  }, [location.pathname]);
  
  const showContainers = location.pathname === '/employees' && !importViewOpen;
  const showImportView = location.pathname === '/employees' && importViewOpen;
  
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar 
        onNewEmployee={() => {
          setImportViewOpen(false);
          setEmployeeModalOpen(true);
        }}
        onImport={() => setImportViewOpen(true)}
        onColaboradores={() => setImportViewOpen(false)}
      />
      <main style={{
        marginLeft: sidebarCollapsed ? '60px' : '240px',
        width: '100%',
        height: '100vh',
        transition: 'margin-left 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* CONTAINER: Colaboradores - Import View - Importação de colaboradores em massa */}
        {showImportView && (
          <div 
            data-container="colaboradores-import-view"
            style={{
              flex: 1,
              padding: '20px',
              overflow: 'hidden',
            }}>
            <div style={{
              background: '#0b1220',
              borderRadius: '8px',
              padding: '20px',
              border: '1px solid #1a2332',
              color: '#e5e7eb',
              height: '100%',
            }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Importar Colaboradores</h3>
                <p style={{ margin: 0, color: '#a0aec0', fontSize: '14px' }}>
                  Faça o download do template, preencha com os dados dos colaboradores e importe o arquivo.
                </p>
              </div>
              
              <button
                onClick={() => {
                  // Aqui será implementado o download do template
                  alert('Download do template será implementado');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#2b6cb0',
                  color: 'white',
                  border: 'none',
                  padding: '10px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'background 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#3182ce';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#2b6cb0';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Download Template</span>
              </button>
            </div>
          </div>
        )}
        
        {/* CONTAINER: Main Content - Rotas Home e Colaboradores */}
        {!showImportView && (
          <div 
            data-container={location.pathname === '/' ? 'home-main-content' : 'colaboradores-main-content'}
            style={{ 
              flex: 1,
              padding: '20px',
              borderBottom: showContainers ? '1px solid #1a2332' : 'none',
              overflow: 'hidden',
            }}>
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
        )}
        
        {showContainers && (
          <>
            {/* SEPARATOR: Colaboradores - Divisor horizontal */}
            <div 
              data-separator="colaboradores-horizontal"
              style={{
                height: '1px',
                background: '#1a2332',
                margin: '0',
              }} 
            />
            
            {/* CONTAINER: Colaboradores - Bottom Panel - Container inferior */}
            <div 
              data-container="colaboradores-bottom-panel"
              style={{
                flex: 1,
                padding: '20px',
                overflow: 'hidden',
              }}>
              <div style={{
                background: '#0b1220',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #1a2332',
                color: '#e5e7eb',
                height: '100%',
              }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>Container Inferior</h3>
                <p style={{ margin: 0, color: '#a0aec0' }}>Este é um container de exemplo na parte inferior da aplicação.</p>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
