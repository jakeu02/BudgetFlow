import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiOutlinePlus } from 'react-icons/hi';
import { useBudget } from '../../context/BudgetContext';
import { CATEGORIES } from '../../utils/constants';
import Modal from '../common/Modal';
import TagInput from '../common/TagInput';

export default function AddTransaction() {
  const { state, dispatch } = useBudget();
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState('expense');
  const [form, setForm] = useState({
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    account_id: '',
  });

  // Compute popular tags from all transactions for autocomplete suggestions
  const popularTags = useMemo(() => {
    const tagCounts = {};
    state.transactions.forEach((tx) => {
      (tx.tags || []).forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    return Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);
  }, [state.transactions]);

  const categories = CATEGORIES[type];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.category || !form.amount || !form.description) return;

    dispatch({
      type: 'ADD_TRANSACTION',
      payload: {
        type,
        category: form.category,
        amount: parseFloat(form.amount),
        description: form.description,
        date: form.date,
        tags: form.tags,
        ...(form.account_id ? { account_id: form.account_id } : {}),
      },
    });

    setForm({ category: '', amount: '', description: '', date: new Date().toISOString().split('T')[0], tags: [], account_id: '' });
    setIsOpen(false);
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-shadow hover:shadow-xl hover:shadow-primary-500/40 sm:w-auto sm:px-5"
      >
        <HiOutlinePlus className="h-4 w-4" />
        Add Transaction
      </motion.button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="New Transaction">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {/* Type Toggle */}
          <div className="flex rounded-xl bg-surface-100 p-1 dark:bg-surface-700">
            {['expense', 'income'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setType(t);
                  setForm((f) => ({ ...f, category: '' }));
                }}
                className={`flex-1 rounded-lg py-2.5 text-sm font-semibold capitalize transition-all
                  ${type === t
                    ? t === 'expense'
                      ? 'bg-danger-500 text-white shadow-md'
                      : 'bg-success-500 text-white shadow-md'
                    : 'text-surface-500 hover:text-surface-700 dark:text-surface-400'
                  }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Amount */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
              Amount
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
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full rounded-xl border border-surface-200 bg-white py-3 pl-10 pr-4 text-lg font-semibold text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
              Description
            </label>
            <input
              type="text"
              placeholder="What was this for?"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
              Tags
            </label>
            <TagInput
              tags={form.tags}
              onChange={(tags) => setForm({ ...form, tags })}
              suggestions={popularTags}
              placeholder="Add tags..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
              Category
            </label>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 sm:gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat.id })}
                  className={`flex flex-col items-center gap-0.5 rounded-xl border-2 p-2 sm:gap-1 sm:p-3 text-xs font-medium transition-all
                    ${form.category === cat.id
                      ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                      : 'border-surface-200 text-surface-600 hover:border-surface-300 hover:bg-surface-50 dark:border-surface-600 dark:text-surface-400 dark:hover:border-surface-500 dark:hover:bg-surface-700'
                    }`}
                >
                  <span className="text-lg sm:text-xl">{cat.icon}</span>
                  <span className="w-full truncate text-center text-[10px] sm:text-xs">{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Account (optional) */}
          {state.accounts.length > 0 && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                Account (optional)
              </label>
              <select
                value={form.account_id}
                onChange={(e) => setForm({ ...form, account_id: e.target.value })}
                className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
              >
                <option value="">No account</option>
                {state.accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.icon} {acc.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
              Date
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full rounded-xl py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl
              ${type === 'expense'
                ? 'bg-gradient-to-r from-danger-500 to-danger-600 shadow-danger-500/30 hover:shadow-danger-500/40'
                : 'bg-gradient-to-r from-success-500 to-success-600 shadow-success-500/30 hover:shadow-success-500/40'
              }`}
          >
            Add {type === 'expense' ? 'Expense' : 'Income'}
          </button>
        </form>
      </Modal>
    </>
  );
}
