import { supabase } from '../lib/supabase';

export const exportData = (transactions, budgets, profile) => {
  const data = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    profile: { full_name: profile?.full_name, age: profile?.age, occupation: profile?.occupation },
    transactions,
    budgets,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `budgetflow-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importData = (file, userId) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data.transactions || !data.budgets) throw new Error('Invalid backup file');

        // Clear existing data
        await supabase.from('transactions').delete().eq('user_id', userId);
        await supabase.from('budgets').delete().eq('user_id', userId);

        // Insert imported data (strip IDs so Supabase generates new ones)
        if (data.transactions.length > 0) {
          const txs = data.transactions.map(({ id, user_id, created_at, updated_at, ...t }) => ({ ...t, user_id: userId }));
          const { error } = await supabase.from('transactions').insert(txs);
          if (error) throw error;
        }
        if (data.budgets.length > 0) {
          const budgets = data.budgets.map(({ id, user_id, created_at, updated_at, ...b }) => ({ ...b, user_id: userId }));
          const { error } = await supabase.from('budgets').insert(budgets);
          if (error) throw error;
        }
        resolve({ success: true, txCount: data.transactions.length, budgetCount: data.budgets.length });
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
