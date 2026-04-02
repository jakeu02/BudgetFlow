import { useState } from 'react';
import Modal from '../common/Modal';
import { useBudget } from '../../context/BudgetContext';

const EMOJI_OPTIONS = [
  { emoji: '\uD83C\uDFAF', label: 'Target' },
  { emoji: '\uD83C\uDFE0', label: 'House' },
  { emoji: '\u2708\uFE0F', label: 'Travel' },
  { emoji: '\uD83C\uDF93', label: 'Education' },
  { emoji: '\uD83D\uDCB0', label: 'Money' },
  { emoji: '\uD83D\uDE97', label: 'Car' },
  { emoji: '\uD83D\uDC8D', label: 'Ring' },
  { emoji: '\uD83C\uDF81', label: 'Gift' },
  { emoji: '\uD83C\uDFCB\uFE0F', label: 'Fitness' },
  { emoji: '\uD83D\uDCF1', label: 'Phone' },
];

const COLOR_OPTIONS = [
  '#6366f1', // indigo
  '#22c55e', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#3b82f6', // blue
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#14b8a6', // teal
];

export default function AddGoal({ isOpen, onClose }) {
  const { dispatch } = useBudget();
  const [form, setForm] = useState({
    name: '',
    target_amount: '',
    deadline: '',
    icon: '\uD83C\uDFAF',
    color: '#6366f1',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.target_amount) return;

    dispatch({
      type: 'ADD_GOAL',
      payload: {
        name: form.name,
        target_amount: parseFloat(form.target_amount),
        current_amount: 0,
        deadline: form.deadline || null,
        icon: form.icon,
        color: form.color,
      },
    });

    setForm({ name: '', target_amount: '', deadline: '', icon: '\uD83C\uDFAF', color: '#6366f1' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Financial Goal">
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Goal Name */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
            Goal Name
          </label>
          <input
            type="text"
            placeholder="e.g., Emergency Fund"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
            required
          />
        </div>

        {/* Target Amount */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
            Target Amount
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
              value={form.target_amount}
              onChange={(e) => setForm({ ...form, target_amount: e.target.value })}
              className="w-full rounded-xl border border-surface-200 bg-white py-3 pl-10 pr-4 text-lg font-semibold text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
              required
            />
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
            Deadline <span className="text-surface-400">(optional)</span>
          </label>
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="w-full rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
          />
        </div>

        {/* Icon Picker */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
            Icon
          </label>
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {EMOJI_OPTIONS.map((opt) => (
              <button
                key={opt.emoji}
                type="button"
                onClick={() => setForm({ ...form, icon: opt.emoji })}
                className={`flex flex-col items-center gap-0.5 rounded-xl border-2 p-2 sm:gap-1 sm:p-3 text-xs font-medium transition-all
                  ${form.icon === opt.emoji
                    ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-400'
                    : 'border-surface-200 text-surface-600 hover:border-surface-300 dark:border-surface-600 dark:text-surface-400'
                  }`}
              >
                <span className="text-lg sm:text-xl">{opt.emoji}</span>
                <span className="w-full truncate text-center text-[10px] sm:text-xs">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
            Color
          </label>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {COLOR_OPTIONS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setForm({ ...form, color })}
                className={`h-8 w-8 rounded-full border-2 transition-all sm:h-9 sm:w-9 ${
                  form.color === color
                    ? 'border-surface-900 scale-110 dark:border-white'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full rounded-xl bg-gradient-to-r from-primary-500 to-primary-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-500/30 transition-all hover:shadow-xl"
        >
          Create Goal
        </button>
      </form>
    </Modal>
  );
}
