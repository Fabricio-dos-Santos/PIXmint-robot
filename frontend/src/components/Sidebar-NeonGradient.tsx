import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

type SidebarProps = {
  onNewEmployee?: () => void;
  onImport?: () => void;
  onColaboradores?: () => void;
};

export default function Sidebar({ onNewEmployee, onImport, onColaboradores }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  // Reset submenu state when clicking on main menu item
  useEffect(() => {
    // This will trigger re-render when location changes
  }, [location.pathname]);
  
  const menuItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/employees', label: 'Colaboradores', icon: '👥', hasAction: true },
  ];
  
  return (
    <aside style={{
      width: collapsed ? '60px' : '240px',
      height: '100vh',
      background: 'linear-gradient(180deg, #6B46C1 0%, #3B82F6 100%)',
      borderRight: '2px solid rgba(139, 92, 246, 0.5)',
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
      position: 'fixed',
      left: 0,
      top: 0,
      transition: 'width 0.3s ease',
      zIndex: 100,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '2px solid rgba(255, 255, 255, 0.2)',
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {!collapsed && <h2 style={{ margin: 0, fontSize: '20px', color: '#fff' }}>PIXmint</h2>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#fff',
            cursor: 'pointer',
            padding: '6px 10px',
            fontSize: '18px',
            borderRadius: '6px',
            transition: 'all 0.3s ease',
            boxShadow: '0 0 10px rgba(139, 92, 246, 0.3)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.boxShadow = '0 0 10px rgba(139, 92, 246, 0.3)';
          }}
          title={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>
      
      {/* Menu Items */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {menuItems.map(item => (
          <div key={item.path}>
            <Link
              to={item.path}
              onClick={() => {
                if (item.path === '/employees' && onColaboradores) {
                  onColaboradores();
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 20px',
                margin: '4px 8px',
                color: '#fff',
                background: location.pathname === item.path 
                  ? 'rgba(255, 255, 255, 0.2)' 
                  : 'rgba(255, 255, 255, 0.05)',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                borderRadius: '8px',
                border: location.pathname === item.path 
                  ? '2px solid rgba(139, 92, 246, 0.8)' 
                  : '2px solid transparent',
                boxShadow: location.pathname === item.path 
                  ? '0 0 20px rgba(139, 92, 246, 0.6), inset 0 0 20px rgba(139, 92, 246, 0.2)' 
                  : 'none',
                fontWeight: location.pathname === item.path ? '600' : '400',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.4)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
            
            {/* Submenu for Employees */}
            {item.hasAction && location.pathname === item.path && !collapsed && (
              <>
                <button
                  onClick={onNewEmployee}
                  style={{
                    width: 'calc(100% - 16px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px 10px 48px',
                    margin: '4px 8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                    backdropFilter: 'blur(5px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(139, 92, 246, 0.5)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={{ fontSize: '16px', filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.8))' }}>+</span>
                  <span>New</span>
                </button>
                
                <button
                  onClick={() => {
                    if (onImport) onImport();
                  }}
                  style={{
                    width: 'calc(100% - 16px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px 10px 48px',
                    margin: '4px 8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.3s ease',
                    textAlign: 'left',
                    backdropFilter: 'blur(5px)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.boxShadow = '0 0 12px rgba(139, 92, 246, 0.5)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span style={{ fontSize: '16px', filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.8))' }}>📥</span>
                  <span>Import</span>
                </button>
              </>
            )}
          </div>
        ))}
      </nav>
      
      {/* Footer */}
      {!collapsed && (
        <div style={{
          padding: '16px 20px',
          borderTop: '2px solid rgba(255, 255, 255, 0.2)',
          background: 'rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center',
          fontWeight: '500',
        }}>
          v1.0.0
        </div>
      )}
    </aside>
  );
}

