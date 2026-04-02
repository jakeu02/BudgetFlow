import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineExclamation, HiOutlineShare } from 'react-icons/hi';
import { useBudget } from '../../context/BudgetContext';
import { CATEGORIES, getCategoryById } from '../../utils/constants';
import { getMonthTransactions, formatCurrency } from '../../utils/helpers';
import Modal from '../common/Modal';
import ShareBudgetModal from './ShareBudgetModal';

function BudgetCard({ budget, spent, currency, onDelete, onShare }) {
  const cat = getCategoryById(budget.category);
  const percent = budget.limit > 0 ? Math.min((spent / budget.limit) * 100, 100) : 0;
  const remaining = budget.limit - spent;
  const isOver = spent > budget.limit;
  const isNear = percent >= 80 && !isOver;

  let barColor = 'bg-primary-500';
  if (isOver) barColor = 'bg-danger-500';
  else if (isNear) barColor = 'bg-warning-500';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group rounded-2xl border border-surface-200 bg-white p-4 sm:p-5 transition-shadow hover:shadow-lg dark:border-surface-800 dark:bg-surface-900"
    >
      <div className="mb-3 sm:mb-4 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-lg sm:h-11 sm:w-11 sm:text-xl"
            style={{ backgroundColor: `${cat.color}15` }}
          >
            {cat.icon}
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-surface-900 dark:text-white">{cat.name}</h4>
            <p className="text-xs text-surface-400">Monthly limit</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {isOver && (
            <span className="hidden items-center gap-1 rounded-lg bg-danger-50 px-1.5 py-0.5 text-xs font-medium text-danger-600 sm:flex dark:bg-danger-500/10 dark:text-danger-400">
              <HiOutlineExclamation className="h-3.5 w-3.5" />
              Over
            </span>
          )}
          <button
            onClick={() => onShare(budget.id)}
            className="rounded-lg p-1.5 text-surface-300 opacity-100 sm:opacity-0 transition-all hover:bg-primary-50 hover:text-primary-500 sm:group-hover:opacity-100 dark:text-surface-600 dark:hover:bg-primary-500/10"
            title="Share budget"
          >
            <HiOutlineShare className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(budget.id)}
            className="rounded-lg p-1.5 text-surface-300 opacity-100 sm:opacity-0 transition-all hover:bg-danger-50 hover:text-danger-500 sm:group-hover:opacity-100 dark:text-surface-600 dark:hover:bg-danger-500/10"
          >
            <HiOutlineTrash className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-2.5 sm:mb-3">
        <div className="mb-1.5 flex items-end justify-between">
          <span className="text-base sm:text-lg font-bold text-surface-900 dark:text-white">
            {formatCurrency(spent, currency)}
          </span>
          <span className="text-xs sm:text-sm text-surface-400">
            of {formatCurrency(budget.limit, currency)}
          </span>
        </div>
        <div className="h-2 sm:h-2.5 overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full rounded-full ${barColor}`}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className={`font-medium ${isOver ? 'text-danger-500' : 'text-surface-400'}`}>
          {isOver
            ? `${formatCurrency(Math.abs(remaining), currency)} over`
            : `${formatCurrency(remaining, currency)} left`}
        </span>
        <span className="font-semibold text-surface-500">{percent.toFixed(0)}%</span>
      </div>
    </motion.div>
  );
}

export default function BudgetManager() {
  const { state, dispatch } = useBudget();
  const { transactions, budgets, currency } = state;
  const [isOpen, setIsOpen] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: '', limit: '' });
  const [shareBudgetId, setShareBudgetId] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const monthTx = getMonthTransactions(transactions);
  const expenses = monthTx.filter((t) => t.type === 'expense');

  const spentByCategory = useMemo(() => {
    const map = {};
    expenses.forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return map;
  }, [expenses]);

  const existingCategories = budgets.map((b) => b.category);
  const availableCategories = CATEGORIES.expense.filter(
    (c) => !existingCategories.includes(c.id)
  );

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + (spentByCategory[b.category] || 0), 0);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newBudget.category || !newBudget.limit) return;
    dispatch({
      type: 'ADD_BUDGET',
      payload: { category: newBudget.category, limit: parseFloat(newBudget.limit), period: 'monthly' },
    });
    setNewBudget({ category: '', limit: '' });
    setIsOpen(false);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-white">Budget Goals</h2>
          <p className="text-xs sm:text-sm text-surface-400">Track spending against your limits</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(true)}
          disabled={availableCategories.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-shadow hover:shadow-xl hover:shadow-primary-500/40 disabled:opacity-50 sm:w-auto sm:px-5"
        >
          <HiOutlinePlus className="h-4 w-4" />
          Add Budget
        </motion.button>
      </div>

      {/* Overview */}
      <div className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-6 dark:border-surface-800 dark:bg-surface-900">
        <div className="mb-3 sm:mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs sm:text-sm text-surface-400">Total Monthly Budget</p>
            <p className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">
              {formatCurrency(totalSpent, currency)}{' '}
              <span className="text-sm sm:text-base font-normal text-surface-400">
                / {formatCurrency(totalBudget, currency)}
              </span>
            </p>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-surface-500">
            {totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(0) : 0}% used
          </span>
        </div>
        <div className="h-2.5 sm:h-3 overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              totalSpent > totalBudget ? 'bg-danger-500' : 'bg-gradient-to-r from-primary-500 to-primary-600'
            }`}
          />
        </div>
      </div>

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-surface-200 py-12 sm:py-16 text-center dark:border-surface-700">
          <p className="text-3xl sm:text-4xl">📊</p>
          <p className="mt-3 text-sm font-medium text-surface-500">No budgets set</p>
          <p className="text-xs text-surface-400">Create your first budget to start tracking</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                spent={spentByCategory[budget.category] || 0}
                currency={currency}
                onDelete={(id) => dispatch({ type: 'DELETE_BUDGET', payload: id })}
                onShare={(id) => { setShareBudgetId(id); setShareModalOpen(true); }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Budget Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="New Budget Goal">
        <form onSubmit={handleAdd} className="space-y-4 sm:space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
              Category
            </label>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {availableCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setNewBudget({ ...newBudget, category: cat.id })}
                  className={`flex flex-col items-center gap-0.5 rounded-xl border-2 p-2 sm:gap-1 sm:p-3 text-xs font-medium transition-all
                    ${newBudget.category === cat.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                      : 'border-surface-200 text-surface-600 hover:border-surface-300 dark:border-surface-600 dark:text-surface-400'
                    }`}
                >
                  <span className="text-lg sm:text-xl">{cat.icon}</span>
                  <span className="w-full truncate text-center text-[10px] sm:text-xs">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
              Monthly Limit
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-surface-400">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={newBudget.limit}
                onChange={(e) => setNewBudget({ ...newBudget, limit: e.target.value })}
                className="w-full rounded-xl border border-surface-200 bg-white py-3 pl-10 pr-4 text-lg font-semibold text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-all hover:shadow-xl"
          >
            Create Budget Goal
          </button>
        </form>
      </Modal>

      {/* Share Budget Modal */}
      <ShareBudgetModal
        isOpen={shareModalOpen}
        onClose={() => { setShareModalOpen(false); setShareBudgetId(null); }}
        budgetId={shareBudgetId}
      />
    </div>
  );
}
