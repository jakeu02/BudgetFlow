import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiArrowUp, HiArrowDown, HiOutlineTrash, HiOutlineRefresh } from 'react-icons/hi';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { getCategoryById } from '../../utils/constants';
import Modal from '../common/Modal';

const frequencyLabels = {
  daily: 'Daily',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

const frequencyColors = {
  daily: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  weekly: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  monthly: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
  yearly: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

export default function RecurringTransactions() {
  const { state, dispatch } = useBudget();
  const { recurringTransactions, currency } = state;
  const [deleteId, setDeleteId] = useState(null);

  const handleToggle = (id) => {
    dispatch({ type: 'TOGGLE_RECURRING', payload: id });
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_RECURRING', payload: id });
    setDeleteId(null);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-surface-200 bg-white dark:border-surface-800 dark:bg-surface-900">
        <AnimatePresence mode="popLayout">
          {recurringTransactions.length === 0 ? (
            <div className="py-12 sm:py-16 text-center">
              <p className="text-3xl sm:text-4xl">
                <HiOutlineRefresh className="mx-auto h-10 w-10 text-surface-300" />
              </p>
              <p className="mt-2 text-sm font-medium text-surface-500">No recurring transactions</p>
              <p className="text-xs text-surface-400">Add one to automate your regular transactions</p>
            </div>
          ) : (
            recurringTransactions.map((item, i) => {
              const cat = getCategoryById(item.category);
              const isIncome = item.type === 'income';
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: Math.min(i * 0.02, 0.3) }}
                  className={`group flex items-center justify-between gap-3 border-b border-surface-100 px-3 py-3 transition-colors last:border-0 hover:bg-surface-50 sm:px-5 sm:py-4 dark:border-surface-800 dark:hover:bg-surface-800/50 ${
                    !item.active ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2.5 sm:gap-4">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base sm:h-11 sm:w-11 sm:text-xl"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      {cat.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs sm:text-sm font-semibold text-surface-900 dark:text-white">
                        {item.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <span
                          className="inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium"
                          style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                        >
                          {cat.name}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                            frequencyColors[item.frequency] || frequencyColors.monthly
                          }`}
                        >
                          {frequencyLabels[item.frequency] || 'Monthly'}
                        </span>
                        <span className="hidden text-xs text-surface-400 sm:inline">
                          Next: {formatDate(item.next_date)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <div className="flex items-center gap-1">
                      {isIncome ? (
                        <HiArrowUp className="h-3.5 w-3.5 text-success-500" />
                      ) : (
                        <HiArrowDown className="h-3.5 w-3.5 text-danger-500" />
                      )}
                      <span
                        className={`text-xs sm:text-sm font-bold ${
                          isIncome
                            ? 'text-success-600 dark:text-success-400'
                            : 'text-danger-600 dark:text-danger-400'
                        }`}
                      >
                        {isIncome ? '+' : '-'}{formatCurrency(item.amount, currency)}
                      </span>
                    </div>

                    {/* Toggle switch */}
                    <button
                      onClick={() => handleToggle(item.id)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                        item.active
                          ? 'bg-primary-500'
                          : 'bg-surface-300 dark:bg-surface-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                          item.active ? 'translate-x-[18px]' : 'translate-x-[3px]'
                        }`}
                      />
                    </button>

                    <button
                      onClick={() => setDeleteId(item.id)}
                      className="rounded-lg p-2 text-surface-300 opacity-100 sm:opacity-0 transition-all hover:bg-danger-50 hover:text-danger-500 sm:group-hover:opacity-100 dark:text-surface-600 dark:hover:bg-danger-500/10"
                    >
                      <HiOutlineTrash className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Recurring Transaction">
        <div className="space-y-4">
          <p className="text-sm text-surface-600 dark:text-surface-400">
            Are you sure you want to delete this recurring transaction? This will not remove any transactions already created by it.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 rounded-xl border border-surface-200 py-2.5 text-sm font-semibold text-surface-700 transition-all hover:bg-surface-50 dark:border-surface-600 dark:text-surface-300 dark:hover:bg-surface-700"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteId)}
              className="flex-1 rounded-xl bg-gradient-to-r from-danger-500 to-danger-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-danger-500/30 transition-all hover:shadow-xl hover:shadow-danger-500/40"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
