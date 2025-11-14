import React from 'react';
import styles from '../styles/table.module.css';

type Props = {
  currentPage: number;
  perPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  ariaLabel?: string;
};

export default function Pagination({ currentPage, perPage, totalItems, onPageChange, ariaLabel }: Props) {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  const goFirst = () => onPageChange(1);
  const goPrev = () => onPageChange(Math.max(1, currentPage - 1));
  const goNext = () => onPageChange(Math.min(totalPages, currentPage + 1));
  const goLast = () => onPageChange(totalPages);

  const start = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const end = Math.min(totalItems, currentPage * perPage);

  return (
    <div role="navigation" aria-label={ariaLabel || 'Pagination'} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ fontSize: 13, color: '#cbd5e1' }}>{totalItems === 0 ? 'Nenhum registro' : `Mostrando ${start}-${end} de ${totalItems}`}</div>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <button aria-label="first" onClick={goFirst} disabled={currentPage === 1} title="Primeira página" style={{ padding: '6px', borderRadius: 4, background: 'transparent', border: 'none', color: 'inherit' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M19 18L13 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M11 18L5 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button aria-label="prev" onClick={goPrev} disabled={currentPage === 1} title="Página anterior" style={{ padding: '6px', borderRadius: 4, background: 'transparent', border: 'none', color: 'inherit' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M15 18L9 12l6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className={styles.pageBadge}>
          Página {currentPage} / {totalPages}
        </div>
        <button aria-label="next" onClick={goNext} disabled={currentPage === totalPages} title="Próxima página" style={{ padding: '6px', borderRadius: 4, background: 'transparent', border: 'none', color: 'inherit' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button aria-label="last" onClick={goLast} disabled={currentPage === totalPages} title="Última página" style={{ padding: '6px', borderRadius: 4, background: 'transparent', border: 'none', color: 'inherit' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M5 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M13 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
