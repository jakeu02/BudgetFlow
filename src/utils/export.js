export function exportToCSV(transactions, currency) {
  const headers = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Tags'];
  const rows = transactions.map(t => [
    t.date,
    t.type,
    t.category,
    `"${t.description}"`,
    t.type === 'expense' ? -t.amount : t.amount,
    (t.tags || []).join('; ')
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `budgetflow-transactions-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
