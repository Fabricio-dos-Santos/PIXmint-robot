import React from 'react';
import useEmployees from '../hooks/useEmployees';
import styles from '../styles/table.module.css';
import EmployeeTable from '../components/EmployeeTable';
import PixKey from '../components/PixKey';
import { isWallet } from '../lib/pixKeyUtils';
import '../styles/theme.css';

type Employee = {
  id: string;
  name: string;
  pixKey: string;
  wallet: string;
  network?: string;
  createdAt?: string;
};

// PixKey rendering is handled by `components/PixKey.tsx` (imported above)

export default function Employees() {
  const { data, error, isLoading, removeEmployee } = useEmployees();

  // simple client-side pagination (presentation-only)
  const [page, setPage] = React.useState(1);
  const [filterName, setFilterName] = React.useState('');
  const perPage = 8;
  const list = data || [];
  const total = list.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const pageItems = list.slice(start, end);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading employees</div>;

  return (
    <div className="app-dark" style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 1100 }}>
        <h2>Employees</h2>
        <div style={{ marginBottom: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => { }}
            style={{
              background: '#2f855a',
              color: 'white',
              border: 'none',
              padding: '8px 12px',
              borderRadius: 4,
              cursor: 'pointer'
            }}
          >
            Novo
          </button>
        </div>

        {/* Table container with filter inside */}
        <div style={{ 
          borderRadius: 8,
          overflow: 'hidden'
        }}>
          {/* Filter input and search button */}
          <div style={{ 
            padding: '12px',
            background: 'rgba(43, 108, 176, 0.05)',
            display: 'flex', 
            gap: 8, 
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <input
              type="text"
              placeholder="Digite para filtrar"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 4,
                border: '1px solid #2b6cb0',
                background: 'transparent',
                color: 'inherit',
                fontSize: '14px',
                width: '200px'
              }}
            />
            <button
              type="button"
              onClick={() => { }}
              style={{
                background: '#2b6cb0',
                color: 'white',
                border: 'none',
                padding: '8px',
                borderRadius: 4,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              title="Pesquisar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* replaced by EmployeeTable component */}
          <EmployeeTable
            items={pageItems}
            renderPixKey={(val: string | undefined) => <PixKey value={val} showLabel={!isWallet(val)} />}
            onEdit={(id: string) => { /* TODO: edit handler */ }}
            onDelete={(id: string) => { removeEmployee(id).catch(() => { }); }}
          />
        </div>

        {/* pagination controls centered under the table */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ fontSize: 13, color: '#444' }}>{total === 0 ? 'Nenhum registro' : `Mostrando ${start + 1}-${Math.min(end, total)} de ${total}`}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button type="button" onClick={() => setPage(1)} disabled={currentPage === 1} title="Primeira página" style={{ padding: '6px 8px', borderRadius: 4, border: 'none', background: 'transparent', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: 'inherit', opacity: currentPage === 1 ? 0.4 : 1 }} aria-label="Primeira página">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M19 18L13 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M11 18L5 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} title="Página anterior" style={{ padding: '6px 8px', borderRadius: 4, border: 'none', background: 'transparent', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', color: 'inherit', opacity: currentPage === 1 ? 0.4 : 1 }} aria-label="Página anterior">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M15 18L9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <div className={styles.pageBadge}>Página {currentPage} / {totalPages}</div>

              <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} title="Próxima página" style={{ padding: '6px 8px', borderRadius: 4, border: 'none', background: 'transparent', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: 'inherit', opacity: currentPage === totalPages ? 0.4 : 1 }} aria-label="Próxima página">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button type="button" onClick={() => setPage(totalPages)} disabled={currentPage === totalPages} title="Última página" style={{ padding: '6px 8px', borderRadius: 4, border: 'none', background: 'transparent', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', color: 'inherit', opacity: currentPage === totalPages ? 0.4 : 1 }} aria-label="Última página">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M5 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
