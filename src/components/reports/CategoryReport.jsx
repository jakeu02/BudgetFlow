import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/helpers';
import { getCategoryById } from '../../utils/constants';

export default function CategoryReport({ transactions, currency }) {
  const categoryData = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense');
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

    const groups = {};
    expenses.forEach((t) => {
      if (!groups[t.category]) {
        groups[t.category] = 0;
      }
      groups[t.category] += t.amount;
    });

    return Object.entries(groups)
      .map(([categoryId, amount]) => {
        const cat = getCategoryById(categoryId);
        return {
          id: categoryId,
          name: cat.name,
          icon: cat.icon,
          color: cat.color,
          amount,
          percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  if (categoryData.length === 0) {
    return (
      <div className="rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900">
        <h3 className="mb-4 text-base font-semibold text-surface-900 dark:text-white">
          Spending by Category
        </h3>
        <p className="text-sm text-surface-400">No expense data for this period.</p>
      </div>
    );
  }

  const maxAmount = categoryData[0]?.amount || 1;

  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900">
      <h3 className="mb-6 text-base font-semibold text-surface-900 dark:text-white">
        Spending by Category
      </h3>

      <div className="space-y-4">
        {categoryData.map((cat, index) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{cat.icon}</span>
                <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                  {cat.name}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-surface-900 dark:text-white">
                  {formatCurrency(cat.amount, currency)}
                </span>
                <span className="min-w-[3rem] text-right text-xs font-medium text-surface-400">
                  {cat.percentage.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: cat.color }}
                initial={{ width: 0 }}
                animate={{ width: `${(cat.amount / maxAmount) * 100}%` }}
                transition={{ duration: 0.6, delay: index * 0.05, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
