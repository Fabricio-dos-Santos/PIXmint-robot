import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Employees from './pages/Employees';
import Sidebar from './components/Sidebar';

export default function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [employeeModalOpen, setEmployeeModalOpen] = useState(false);
  const [importViewOpen, setImportViewOpen] = useState(false);
  const [csvCopied, setCsvCopied] = useState(false);
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
  
  const handleCopyCSV = async () => {
    const csvText = `name,pixKey,wallet,network
Ana Silva,ana.silva@pix.com,0x1a2b3c4d5e6f7890abcdef1234567890abcdef12,sepolia
Carla Mendes,(11) 98765-4321,0x34567890abcdef1234567890abcdef12345678901,polygon
Eva Pereira,123.456.789-01,0x567890abcdef1234567890abcdef1234567890123,bnb
Gabriela Almeida,12.345.678/0001-90,0x7890abcdef1234567890abcdef123456789012345,ethereum
Inês Lima,a1b2c3d4e5f67890123456789abcdef0,0x90abcdef1234567890abcdef12345678901234567,arbitrum`;
    
    try {
      await navigator.clipboard.writeText(csvText);
      setCsvCopied(true);
      setTimeout(() => setCsvCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const handleDownloadTemplate = () => {
    const csvContent = `name,pixKey,wallet,network
Ana Silva,ana.silva@pix.com,0x1a2b3c4d5e6f7890abcdef1234567890abcdef12,sepolia
Carla Mendes,(11) 98765-4321,0x34567890abcdef1234567890abcdef12345678901,polygon
Eva Pereira,123.456.789-01,0x567890abcdef1234567890abcdef1234567890123,bnb
Gabriela Almeida,12.345.678/0001-90,0x7890abcdef1234567890abcdef123456789012345,ethereum
Inês Lima,a1b2c3d4e5f67890123456789abcdef0,0x90abcdef1234567890abcdef12345678901234567,arbitrum`;
    
    // Create blob with BOM for proper UTF-8 encoding
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'pixmint-template.txt');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };
  
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
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}>
            
            {/* PASSO 1: Download do Template */}
            <div style={{
              flex: '0 0 auto',
              background: '#0b1220',
              borderRadius: '8px',
              padding: '24px',
              border: '1px solid #1a2332',
              color: '#e5e7eb',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2b6cb0 0%, #3182ce 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(43, 108, 176, 0.4)',
                }}>1</div>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: '600' }}>Download do Template</h3>
                  <p style={{ margin: 0, color: '#a0aec0', fontSize: '13px' }}>
                    Baixe o arquivo modelo e preencha com os dados dos colaboradores
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                {/* Download e Instruções */}
                <div style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <button
                    onClick={handleDownloadTemplate}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: '#2b6cb0',
                      color: 'white',
                      border: 'none',
                      padding: '14px 20px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '15px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 2px 8px rgba(43, 108, 176, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#3182ce';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(43, 108, 176, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#2b6cb0';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(43, 108, 176, 0.3)';
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>Baixar Template CSV</span>
                  </button>

                  <div style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '6px',
                    padding: '12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 16v-4m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#3B82F6' }}>Formato do Arquivo</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: '#a0aec0', lineHeight: '1.5' }}>
                      Formato CSV (valores separados por vírgula) com codificação UTF-8.
                    </p>
                  </div>

                  <div style={{
                    background: 'rgba(168, 85, 247, 0.1)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '6px',
                    padding: '12px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: '#a855f7' }}>Como Abrir</span>
                    </div>
                    <ul style={{ margin: '4px 0 0 0', paddingLeft: '18px', fontSize: '11px', color: '#a0aec0', lineHeight: '1.5' }}>
                      <li><strong>Notepad:</strong> Botão direito → Abrir com</li>
                      <li><strong>Excel:</strong> Dados → De Texto/CSV</li>
                      <li><strong>Sheets:</strong> Arquivo → Importar</li>
                      <li><strong>VS Code:</strong> Arraste o arquivo</li>
                    </ul>
                  </div>
                </div>

                {/* Regras de Preenchimento */}
                <div style={{ 
                  flex: 1, 
                  background: 'rgba(255, 255, 255, 0.03)',
                  borderRadius: '8px',
                  padding: '20px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '15px', color: '#fff', fontWeight: '600' }}>📋 Regras de Preenchimento</h4>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '16px',
                  marginBottom: '16px',
                }}>
                  {/* Campo: name */}
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginBottom: '6px',
                    }}>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        color: '#60a5fa',
                        fontFamily: 'monospace',
                      }}>name</span>
                      <span style={{ 
                        fontSize: '11px', 
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontWeight: '500',
                      }}>obrigatório</span>
                    </div>
                    <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '13px', color: '#a0aec0', lineHeight: '1.6' }}>
                      <li>Nome completo do colaborador</li>
                      <li>Mínimo de <strong>nome + sobrenome</strong></li>
                      <li>Cada palavra deve ter pelo menos 3 letras</li>
                      <li>Não pode terminar com preposições: "dos", "das", "de", "da", "do", "e"</li>
                      <li><strong>Exemplo:</strong> "João Silva", "Maria Santos"</li>
                    </ul>
                  </div>

                  {/* Campo: pixKey */}
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginBottom: '6px',
                    }}>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        color: '#60a5fa',
                        fontFamily: 'monospace',
                      }}>pixKey</span>
                      <span style={{ 
                        fontSize: '11px', 
                        background: 'rgba(34, 197, 94, 0.2)',
                        color: '#22c55e',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontWeight: '500',
                      }}>opcional</span>
                    </div>
                    <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '13px', color: '#a0aec0', lineHeight: '1.6' }}>
                      <li>Chave PIX nos formatos aceitos:</li>
                      <li style={{ paddingLeft: '12px' }}>📧 <strong>Email:</strong> usuario@dominio.com</li>
                      <li style={{ paddingLeft: '12px' }}>📱 <strong>Telefone:</strong> (11) 98765-4321 ou 11987654321</li>
                      <li style={{ paddingLeft: '12px' }}>🆔 <strong>CPF:</strong> 123.456.789-00 ou 12345678900</li>
                      <li style={{ paddingLeft: '12px' }}>💼 <strong>CNPJ:</strong> 12.345.678/0001-00</li>
                      <li style={{ paddingLeft: '12px' }}>🔑 <strong>Chave Aleatória:</strong> 32 caracteres alfanuméricos</li>
                      <li>Deixe vazio se não tiver PIX</li>
                    </ul>
                  </div>

                  {/* Campo: wallet */}
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginBottom: '6px',
                    }}>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        color: '#60a5fa',
                        fontFamily: 'monospace',
                      }}>wallet</span>
                      <span style={{ 
                        fontSize: '11px', 
                        background: 'rgba(34, 197, 94, 0.2)',
                        color: '#22c55e',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontWeight: '500',
                      }}>opcional</span>
                    </div>
                    <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '13px', color: '#a0aec0', lineHeight: '1.6' }}>
                      <li>Endereço EVM (Ethereum Virtual Machine)</li>
                      <li>Deve começar com <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 4px', borderRadius: '3px' }}>0x</code></li>
                      <li>Total de 42 caracteres (incluindo 0x)</li>
                      <li>Apenas caracteres hexadecimais (0-9, a-f)</li>
                      <li><strong>Exemplo:</strong> 0x1234567890abcdef1234567890abcdef12345678</li>
                    </ul>
                  </div>

                  {/* Campo: network */}
                  <div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginBottom: '6px',
                    }}>
                      <span style={{ 
                        fontSize: '13px', 
                        fontWeight: '600', 
                        color: '#60a5fa',
                        fontFamily: 'monospace',
                      }}>network</span>
                      <span style={{ 
                        fontSize: '11px', 
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#ef4444',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontWeight: '500',
                      }}>obrigatório</span>
                    </div>
                    <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '13px', color: '#a0aec0', lineHeight: '1.6' }}>
                      <li>Rede blockchain onde a wallet está</li>
                      <li>Valores aceitos (exatamente como mostrado):</li>
                      <li style={{ paddingLeft: '12px' }}>
                        <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '3px', marginRight: '8px' }}>sepolia</code>
                        <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '3px', marginRight: '8px' }}>ethereum</code>
                        <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '3px', marginRight: '8px' }}>polygon</code>
                      </li>
                      <li style={{ paddingLeft: '12px' }}>
                        <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '3px', marginRight: '8px' }}>arbitrum</code>
                        <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '3px', marginRight: '8px' }}>bnb</code>
                        <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '3px' }}>base</code>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Exemplo de CSV */}
                <div style={{ 
                  marginTop: '16px',
                  padding: '14px',
                  background: 'rgba(0, 0, 0, 0.3)',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 215, 0, 0.3)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '500', color: '#FFD700' }}>✨ Exemplo</span>
                    <button
                      onClick={handleCopyCSV}
                      style={{
                        background: csvCopied ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 215, 0, 0.2)',
                        border: `1px solid ${csvCopied ? 'rgba(34, 197, 94, 0.5)' : 'rgba(255, 215, 0, 0.5)'}`,
                        borderRadius: '4px',
                        padding: '6px',
                        color: csvCopied ? '#22c55e' : '#FFD700',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        minWidth: '28px',
                        minHeight: '28px',
                      }}
                    >
                      {csvCopied ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  <pre style={{ 
                    margin: 0, 
                    fontSize: '11px', 
                    color: '#e5e7eb',
                    fontFamily: 'monospace',
                    lineHeight: '1.5',
                    overflow: 'auto',
                  }}>
{`name,pixKey,wallet,network
Ana Silva,ana.silva@pix.com,0x1a2b3c4d5e6f7890abcdef1234567890abcdef12,sepolia
Carla Mendes,(11) 98765-4321,0x34567890abcdef1234567890abcdef12345678901,polygon
Eva Pereira,123.456.789-01,0x567890abcdef1234567890abcdef1234567890123,bnb
Gabriela Almeida,12.345.678/0001-90,0x7890abcdef1234567890abcdef123456789012345,ethereum
Inês Lima,a1b2c3d4e5f67890123456789abcdef0,0x90abcdef1234567890abcdef12345678901234567,arbitrum`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
          </div>
        )}
        
        {/* CONTAINER: Main Content - Rotas Home e Colaboradores */}
        {!showImportView && (
          <div 
            data-container={location.pathname === '/' ? 'home-main-content' : 'colaboradores-main-content'}
            style={{ 
              flex: 1,
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
          </div>
        )}
        
        {showContainers && (
          <>
            {/* SEPARATOR: Colaboradores - Divisor horizontal */}
            <div 
              data-separator="colaboradores-horizontal"
              style={{
                height: '3px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.6) 50%, transparent 100%)',
                boxShadow: '0 1px 8px rgba(255, 215, 0, 0.4)',
                margin: '0',
              }} 
            />
            
            {/* CONTAINER: Colaboradores - Bottom Panel - Container inferior */}
            <div 
              data-container="colaboradores-bottom-panel"
              style={{
                flex: 1,
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
