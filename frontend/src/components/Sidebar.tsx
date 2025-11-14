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
      background: '#0b1220',
      borderRight: '1px solid #1a2332',
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
        borderBottom: '1px solid #1a2332',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {!collapsed && <h2 style={{ margin: 0, fontSize: '20px', color: '#fff' }}>PIXmint</h2>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#a0aec0',
            cursor: 'pointer',
            padding: '4px',
            fontSize: '18px',
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
                color: location.pathname === item.path ? '#fff' : '#a0aec0',
                background: location.pathname === item.path ? '#15466f' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                borderLeft: location.pathname === item.path ? '3px solid #805ad5' : '3px solid transparent',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.background = 'rgba(21, 70, 111, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.background = 'transparent';
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
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 20px 8px 52px',
                    background: 'transparent',
                    border: 'none',
                    color: '#a0aec0',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(21, 70, 111, 0.2)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#a0aec0';
                  }}
                >
                  <span style={{ fontSize: '16px' }}>+</span>
                  <span>New</span>
                </button>
                
                <button
                  onClick={() => {
                    if (onImport) onImport();
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 20px 8px 52px',
                    background: 'transparent',
                    border: 'none',
                    color: '#a0aec0',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(21, 70, 111, 0.2)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#a0aec0';
                  }}
                >
                  <span style={{ fontSize: '16px' }}>📥</span>
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
          borderTop: '1px solid #1a2332',
          fontSize: '12px',
          color: '#718096',
        }}>
          v1.0.0
        </div>
      )}
    </aside>
  );
}

