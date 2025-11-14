import React from 'react';
import styles from '../styles/table.module.css';
import { formatDateIsoToDMY } from '../lib/dateUtils';
import CopyButton from './CopyButton';
import { maskWallet } from '../lib/pixKeyUtils';

export type Employee = {
  id: string;
  name: string;
  pixKey: string;
  wallet: string;
  network?: string;
  createdAt?: string;
};

type Props = {
  items: Employee[];
  renderPixKey: (val?: string) => React.ReactNode;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  sortOrder?: 'asc' | 'desc' | null;
  onToggleSort?: () => void;
};

export default function EmployeeTable({ items, renderPixKey, onEdit, onDelete, sortOrder, onToggleSort }: Props) {
  return (
    <div style={{ overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={`${styles.cell} ${styles.nowrap}`}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <span>Name</span>
                {onToggleSort && (
                  <button
                    type="button"
                    onClick={onToggleSort}
                    style={{
                      background: sortOrder ? '#805ad5' : 'rgba(43, 108, 176, 0.05)',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px 6px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      color: sortOrder ? '#ffffff' : '#a0aec0',
                      transition: 'all 0.2s ease',
                    }}
                    title={
                      sortOrder === null ? 'Ordenar por nome (A-Z)' :
                      sortOrder === 'asc' ? 'Ordenado A-Z (clique para Z-A)' :
                      'Ordenado Z-A (clique para remover)'
                    }
                    aria-label="Ordenar por nome"
                  >
                    {sortOrder === 'asc' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {sortOrder === 'desc' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {sortOrder === null && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 15l5 5 5-5M7 9l5-5 5 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </th>
            <th className={`${styles.cell} ${styles.nowrap}`}>PixKey</th>
            <th className={`${styles.cell} ${styles.nowrap}`}>Wallet</th>
            <th className={`${styles.cell} ${styles.nowrap}`}>Network</th>
            <th className={`${styles.cell} ${styles.nowrap}`}>Created At</th>
            <th className={`${styles.cell} ${styles.nowrap}`}>More ...</th>
          </tr>
        </thead>
        <tbody>
          {items.map((e) => (
            <tr key={e.id}>
              <td className={`${styles.cell} ${styles.nowrap}`}>{e.name}</td>
              <td className={`${styles.cell} ${styles.nowrap}`}>{renderPixKey(e.pixKey)}</td>
              <td className={`${styles.cell} ${styles.nowrap}`}>
                <div style={{ display: 'flex', alignItems: 'center' }} title={e.wallet}>
                  <CopyButton text={e.wallet} />
                  <span style={{ marginLeft: 6, maxWidth: 300, display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{maskWallet(e.wallet)}</span>
                </div>
              </td>
              <td className={`${styles.cell} ${styles.nowrap}`}>{e.network}</td>
              <td className={`${styles.cell} ${styles.nowrap}`}>{formatDateIsoToDMY(e.createdAt)}</td>
              <td className={`${styles.cell} ${styles.nowrap}`}>
                <button
                  type="button"
                  onClick={() => onEdit && onEdit(e.id)}
                  title={`Editar ${e.name || e.id}`}
                  className={styles.iconButton}
                  aria-label={`Editar ${e.name || e.id}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M3 21v-3.6l11.06-11.06 3.6 3.6L6.6 21H3z" fill="currentColor" />
                    <path d="M20.7 7.04a1 1 0 000-1.41l-2.34-2.34a1 1 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => onDelete && onDelete(e.id)}
                  title={`Excluir ${e.name || e.id}`}
                  className={styles.iconButton}
                  aria-label={`Excluir ${e.name || e.id}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                    <path d="M3 6h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M10 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
