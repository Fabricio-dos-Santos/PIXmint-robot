export function formatDateIsoToDMY(iso?: string): string {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return '';
    // Ensure dd/mm/yyyy
    return d.toLocaleDateString('pt-BR');
  } catch (e) {
    return '';
  }
}

export default { formatDateIsoToDMY };
