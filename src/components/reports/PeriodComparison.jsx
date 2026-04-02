import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiArrowUp, HiArrowDown, HiMinus } from 'react-icons/hi';
import { formatCurrency } from '../../utils/helpers';
import { getCategoryById } from '../../utils/constants';

export default function PeriodComparison({ currentTransactions, previousTransactions, currency, periodLabel }) {
  const comparison = useMemo(() => {
    // Calculate totals for current period
    const currentIncome = currentTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const currentExpenses = currentTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate totals for previous period
    const previousIncome = previousTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const previousExpenses = previousTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Calculate percentage changes
    const incomeChange = previousIncome > 0
      ? ((currentIncome - previousIncome) / previousIncome) * 100
      : currentIncome > 0 ? 100 : 0;
    const expenseChange = previousExpenses > 0
      ? ((currentExpenses - previousExpenses) / previousExpenses) * 100
      : currentExpenses > 0 ? 100 : 0;

    // Find top growing and shrinking categories (expenses only)
    const currentCats = {};
    const previousCats = {};

    currentTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        currentCats[t.category] = (currentCats[t.category] || 0) + t.amount;
      });

    previousTransactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        previousCats[t.category] = (previousCats[t.category] || 0) + t.amount;
      });

    const allCatIds = new Set([...Object.keys(currentCats), ...Object.keys(previousCats)]);
    let topGrowing = null;
    let topShrinking = null;
    let maxGrowth = -Infinity;
    let maxShrink = Infinity;

    allCatIds.forEach((catId) => {
      const curr = currentCats[catId] || 0;
      const prev = previousCats[catId] || 0;
      const diff = curr - prev;

      if (diff > maxGrowth) {
        maxGrowth = diff;
        topGrowing = {
          ...getCategoryById(catId),
          currentAmount: curr,
          previousAmount: prev,
          diff,
          changePercent: prev > 0 ? ((diff / prev) * 100).toFixed(1) : curr > 0 ? '100.0' : '0.0',
        };
      }
      if (diff < maxShrink) {
        maxShrink = diff;
        topShrinking = {
          ...getCategoryById(catId),
          currentAmount: curr,
          previousAmount: prev,
          diff,
          changePercent: prev > 0 ? ((diff / prev) * 100).toFixed(1) : '0.0',
        };
      }
    });

    return {
      currentIncome,
      currentExpenses,
      previousIncome,
      previousExpenses,
      incomeChange,
      expenseChange,
      topGrowing: maxGrowth > 0 ? topGrowing : null,
      topShrinking: maxShrink < 0 ? topShrinking : null,
    };
  }, [currentTransactions, previousTransactions]);

  const ChangeIndicator = ({ value, isExpense = false }) => {
    if (Math.abs(value) < 0.1) {
      return (
        <span className="inline-flex items-center gap-1 text-sm font-medium text-surface-400">
          <HiMinus className="h-3.5 w-3.5" />
          No change
        </span>
      );
    }
    // For expenses: increase = red (bad), decrease = green (good)
    // For income: increase = green (good), decrease = red (bad)
    const isPositive = isExpense ? value < 0 : value > 0;
    return (
      <span className={`inline-flex items-center gap-1 text-sm font-semibold ${
        isPositive
          ? 'text-emerald-600 dark:text-emerald-400'
          : 'text-red-600 dark:text-red-400'
      }`}>
        {value > 0 ? (
          <HiArrowUp className="h-3.5 w-3.5" />
        ) : (
          <HiArrowDown className="h-3.5 w-3.5" />
        )}
        {Math.abs(value).toFixed(1)}%
      </span>
    );
  };

  const hasData = comparison.currentIncome > 0 || comparison.currentExpenses > 0 ||
                  comparison.previousIncome > 0 || comparison.previousExpenses > 0;

  return (
    <div className="rounded-2xl border border-surface-200 bg-white p-6 dark:border-surface-800 dark:bg-surface-900">
      <h3 className="mb-6 text-base font-semibold text-surface-900 dark:text-white">
        Period Comparison
      </h3>

      {!hasData ? (
        <p className="text-sm text-surface-400">Not enough data to compare periods.</p>
      ) : (
        <div className="space-y-5">
          {/* Income comparison */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between rounded-xl bg-surface-50 px-4 py-3.5 dark:bg-surface-800"
          >
            <div>
              <p className="text-xs font-medium text-surface-400">Income</p>
              <p className="text-sm font-semibold text-surface-900 dark:text-white">
                {formatCurrency(comparison.currentIncome, currency)}
              </p>
              <p className="text-xs text-surface-400">
                vs {formatCurrency(comparison.previousIncome, currency)}
              </p>
            </div>
            <ChangeIndicator value={comparison.incomeChange} />
          </motion.div>

          {/* Expense comparison */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between rounded-xl bg-surface-50 px-4 py-3.5 dark:bg-surface-800"
          >
            <div>
              <p className="text-xs font-medium text-surface-400">Expenses</p>
              <p className="text-sm font-semibold text-surface-900 dark:text-white">
                {formatCurrency(comparison.currentExpenses, currency)}
              </p>
              <p className="text-xs text-surface-400">
                vs {formatCurrency(comparison.previousExpenses, currency)}
              </p>
            </div>
            <ChangeIndicator value={comparison.expenseChange} isExpense />
          </motion.div>

          {/* Top Growing Category */}
          {comparison.topGrowing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center justify-between rounded-xl border border-red-100 bg-red-50/50 px-4 py-3.5 dark:border-red-500/10 dark:bg-red-500/5"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{comparison.topGrowing.icon}</span>
                <div>
                  <p className="text-xs font-medium text-surface-400">Top Growing Expense</p>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">
                    {comparison.topGrowing.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                  +{formatCurrency(comparison.topGrowing.diff, currency)}
                </span>
                <p className="text-xs text-surface-400">
                  +{comparison.topGrowing.changePercent}%
                </p>
              </div>
            </motion.div>
          )}

          {/* Top Shrinking Category */}
          {comparison.topShrinking && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-3.5 dark:border-emerald-500/10 dark:bg-emerald-500/5"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{comparison.topShrinking.icon}</span>
                <div>
                  <p className="text-xs font-medium text-surface-400">Top Shrinking Expense</p>
                  <p className="text-sm font-semibold text-surface-900 dark:text-white">
                    {comparison.topShrinking.name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(comparison.topShrinking.diff, currency)}
                </span>
                <p className="text-xs text-surface-400">
                  {comparison.topShrinking.changePercent}%
                </p>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
