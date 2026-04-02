import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO, format } from 'date-fns';
import { formatCurrency } from '../../utils/helpers';

export default function TrendReport({ transactions, currency }) {
  const monthlyData = useMemo(() => {
    const now = new Date();
    const months = [];

    for (let i = 5; i >= 0; i--) {
      const date = subMonths(now, i);
      const start = startOfMonth(date);
      const end = endOfMonth(date);
      const label = format(date, 'MMM');
      const fullLabel = format(date, 'MMM yyyy');

      const monthTx = transactions.filter((t) => {
        const tDate = parseISO(t.date);
        return isWithinInterval(tDate, { start, end });
      });

      const income = monthTx
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const expenses = monthTx
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      months.push({ label, fullLabel, income, expenses });
    }

    return months;
  }, [transactions]);

  const maxValue = useMemo(() => {
    let max = 0;
    monthlyData.forEach((m) => {
      if (m.income > max) max = m.income;
      if (m.expenses > max) max = m.expenses;
    });
    return max || 1;
  }, [monthlyData]);

  const hasData = monthlyData.some((m) => m.income > 0 || m.expenses > 0);

  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-base font-semibold text-surface-900 dark:text-white">
          Monthly Trend
        </h3>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-surface-500 dark:text-surface-400">Income</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-xs text-surface-500 dark:text-surface-400">Expenses</span>
          </div>
        </div>
      </div>

      {!hasData ? (
        <p className="text-sm text-surface-400">No transaction data available.</p>
      ) : (
        <div className="flex items-end gap-3 sm:gap-4">
          {monthlyData.map((month, index) => (
            <div key={month.fullLabel} className="flex flex-1 flex-col items-center gap-2">
              {/* Bars */}
              <div className="flex w-full items-end justify-center gap-1" style={{ height: 140 }}>
                {/* Income bar */}
                <motion.div
                  className="flex-1 max-w-5 rounded-t-md bg-emerald-500"
                  initial={{ height: 0 }}
                  animate={{ height: `${(month.income / maxValue) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  title={`Income: ${formatCurrency(month.income, currency)}`}
                  style={{ minHeight: month.income > 0 ? 4 : 0 }}
                />
                {/* Expense bar */}
                <motion.div
                  className="flex-1 max-w-5 rounded-t-md bg-red-500"
                  initial={{ height: 0 }}
                  animate={{ height: `${(month.expenses / maxValue) * 100}%` }}
                  transition={{ duration: 0.5, delay: index * 0.08 + 0.1 }}
                  title={`Expenses: ${formatCurrency(month.expenses, currency)}`}
                  style={{ minHeight: month.expenses > 0 ? 4 : 0 }}
                />
              </div>

              {/* Label */}
              <span className="text-xs font-medium text-surface-500 dark:text-surface-400">
                {month.label}
              </span>

              {/* Totals */}
              <div className="text-center">
                <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(month.income, currency)}
                </p>
                <p className="text-[10px] font-medium text-red-500 dark:text-red-400">
                  {formatCurrency(month.expenses, currency)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
