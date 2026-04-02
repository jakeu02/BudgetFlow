import { motion } from 'framer-motion';
import { HiArrowUp, HiArrowDown } from 'react-icons/hi';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { getCategoryById } from '../../utils/constants';

export default function RecentTransactions() {
  const { state, dispatch } = useBudget();
  const { transactions, currency } = state;

  const recent = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-6 dark:border-surface-800 dark:bg-surface-900"
    >
      <div className="mb-3 sm:mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-surface-900 dark:text-white">
            Recent Transactions
          </h3>
          <p className="text-xs sm:text-sm text-surface-400">Latest activity</p>
        </div>
        <button
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'transactions' })}
          className="rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50 hover:text-primary-700 dark:text-primary-400 dark:hover:bg-primary-500/10"
        >
          View all
        </button>
      </div>

      <div className="space-y-1 sm:space-y-2">
        {recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-surface-400">No transactions yet</p>
        ) : (
          recent.map((tx, i) => {
            const cat = getCategoryById(tx.category);
            const isIncome = tx.type === 'income';
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-center justify-between gap-3 rounded-xl px-2 py-2 sm:px-3 sm:py-2.5 transition-colors hover:bg-surface-50 dark:hover:bg-surface-800"
              >
                <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base sm:h-10 sm:w-10 sm:text-lg"
                    style={{ backgroundColor: `${cat.color}15` }}
                  >
                    {cat.icon}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-xs sm:text-sm font-medium text-surface-900 dark:text-white">
                      {tx.description}
                    </p>
                    <p className="text-xs text-surface-400">{formatDate(tx.date)}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {isIncome ? (
                    <HiArrowUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-success-500" />
                  ) : (
                    <HiArrowDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-danger-500" />
                  )}
                  <span
                    className={`text-xs sm:text-sm font-semibold ${
                      isIncome ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'
                    }`}
                  >
                    {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                  </span>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
}
