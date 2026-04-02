import { useState } from 'react';
import Modal from '../common/Modal';
import { useBudget } from '../../context/BudgetContext';
import { CATEGORIES } from '../../utils/constants';

const FREQUENCY_OPTIONS = [
  { id: 'once', label: 'Once' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly' },
];

export default function AddReminder({ isOpen, onClose }) {
  const { dispatch } = useBudget();
  const [form, setForm] = useState({
    name: '',
    amount: '',
    due_date: '',
    frequency: 'monthly',
    category: '',
    notify_before_days: '3',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.amount || !form.due_date) return;

    dispatch({
      type: 'ADD_REMINDER',
      payload: {
        name: form.name,
        amount: parseFloat(form.amount),
        due_date: form.due_date,
        frequency: form.frequency,
        category: form.category || null,
        notify_before_days: parseInt(form.notify_before_days) || 3,
        is_paid: false,
      },
    });

    setForm({
      name: '',
      amount: '',
      due_date: '',
      frequency: 'monthly',
      category: '',
      notify_before_days: '3',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Bill Reminder">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Bill Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
            Bill Name
          </label>
          <input
            type="text"
            placeholder="e.g., Electric Bill"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
            required
          />
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

        {/* Due Date */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
            Due Date
          </label>
          <input
            type="date"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
            className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
            required
          />
        </div>

        {/* Frequency */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
            Frequency
          </label>
          <div className="grid grid-cols-4 gap-2">
            {FREQUENCY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setForm({ ...form, frequency: opt.id })}
                className={`rounded-xl border-2 px-3 py-2.5 text-xs sm:text-sm font-semibold transition-all
                  ${form.frequency === opt.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                    : 'border-surface-200 text-surface-600 hover:border-surface-300 dark:border-surface-600 dark:text-surface-400'
                  }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category (optional) */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
            Category <span className="text-surface-400">(optional)</span>
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
          >
            <option value="">None</option>
            {CATEGORIES.expense.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Notify Before Days */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
            Notify Before (days)
          </label>
          <input
            type="number"
            min="0"
            max="30"
            value={form.notify_before_days}
            onChange={(e) => setForm({ ...form, notify_before_days: e.target.value })}
            className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-all hover:shadow-xl"
        >
          Create Reminder
        </button>
      </form>
    </Modal>
  );
}
