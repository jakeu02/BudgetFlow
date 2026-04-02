import { useState } from 'react';
import { useBudget } from '../../context/BudgetContext';
import { ACCOUNT_TYPES } from '../../utils/constants';
import Modal from '../common/Modal';

const COLOR_OPTIONS = [
  '#22c55e', '#3b82f6', '#ef4444', '#f59e0b',
  '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1',
];

export default function AddAccount({ isOpen, onClose }) {
  const { dispatch } = useBudget();
  const [form, setForm] = useState({
    name: '',
    type: 'bank',
    balance: '',
    color: '#3b82f6',
    icon: '🏦',
  });

  const handleTypeSelect = (typeId) => {
    const accountType = ACCOUNT_TYPES.find((t) => t.id === typeId);
    setForm({
      ...form,
      type: typeId,
      icon: accountType?.icon || form.icon,
      color: accountType?.color || form.color,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.type) return;

    dispatch({
      type: 'ADD_ACCOUNT',
      payload: {
        name: form.name,
        type: form.type,
        balance: parseFloat(form.balance) || 0,
        color: form.color,
        icon: form.icon,
      },
    });

    setForm({ name: '', type: 'bank', balance: '', color: '#3b82f6', icon: '🏦' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Account">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Account Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
            Account Name
          </label>
          <input
            type="text"
            placeholder="e.g., Main Checking"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
            required
          />
        </div>

        {/* Account Type */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
            Account Type
          </label>
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5 sm:gap-2">
            {ACCOUNT_TYPES.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => handleTypeSelect(type.id)}
                className={`flex flex-col items-center gap-0.5 rounded-xl border-2 p-2 sm:gap-1 sm:p-3 text-xs font-medium transition-all
                  ${form.type === type.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                    : 'border-surface-200 text-surface-600 hover:border-surface-300 hover:bg-surface-50 dark:border-surface-600 dark:text-surface-400 dark:hover:border-surface-500 dark:hover:bg-surface-700'
                  }`}
              >
                <span className="text-lg sm:text-xl">{type.icon}</span>
                <span className="w-full truncate text-center text-[10px] sm:text-xs">{type.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Initial Balance */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
            Initial Balance
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-surface-400">
              $
            </span>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              value={form.balance}
              onChange={(e) => setForm({ ...form, balance: e.target.value })}
              className="w-full rounded-xl border border-surface-200 bg-white py-3 pl-10 pr-4 text-lg font-semibold text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
            />
          </div>
        </div>

        {/* Color Picker */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
            Color
          </label>
          <div className="flex flex-wrap gap-2">
            {COLOR_OPTIONS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setForm({ ...form, color })}
                className={`h-8 w-8 rounded-full border-2 transition-all sm:h-9 sm:w-9 ${
                  form.color === color
                    ? 'border-surface-900 scale-110 dark:border-white'
                    : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-all hover:shadow-xl hover:shadow-primary-500/40"
        >
          Create Account
        </button>
      </form>
    </Modal>
  );
}
