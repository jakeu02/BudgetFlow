import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useBudget } from '../../context/BudgetContext';
import { formatCurrency } from '../../utils/helpers';

export default function AddFundsModal({ isOpen, onClose, goal, initialMode = 'add' }) {
  const { state, dispatch } = useBudget();
  const { currency } = state;
  const [mode, setMode] = useState(initialMode);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setAmount('');
  }, [initialMode, isOpen]);

  if (!goal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (!value || value <= 0) return;

    dispatch({
      type: 'UPDATE_GOAL_AMOUNT',
      payload: {
        id: goal.id,
        amount: mode === 'add' ? value : -value,
      },
    });

    setAmount('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${mode === 'add' ? 'Add Funds to' : 'Withdraw from'} Goal`}>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Goal Info */}
        <div className="flex items-center gap-3 rounded-xl bg-surface-50 p-3 dark:bg-surface-700/50">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
            style={{ backgroundColor: `${goal.color}15` }}
          >
            {goal.icon}
          </div>
          <div>
            <p className="text-sm font-semibold text-surface-900 dark:text-white">{goal.name}</p>
            <p className="text-xs text-surface-400">
              Current: {formatCurrency(goal.current_amount, currency)} / {formatCurrency(goal.target_amount, currency)}
            </p>
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex rounded-xl bg-surface-100 p-1 dark:bg-surface-700">
          <button
            type="button"
            onClick={() => setMode('add')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              mode === 'add'
                ? 'bg-white text-primary-600 shadow-sm dark:bg-surface-600 dark:text-primary-400'
                : 'text-surface-500 dark:text-surface-400'
            }`}
          >
            Add Funds
          </button>
          <button
            type="button"
            onClick={() => setMode('withdraw')}
            className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all ${
              mode === 'withdraw'
                ? 'bg-white text-danger-600 shadow-sm dark:bg-surface-600 dark:text-danger-400'
                : 'text-surface-500 dark:text-surface-400'
            }`}
          >
            Withdraw
          </button>
        </div>

        {/* Amount Input */}
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-surface-200 bg-white py-3 pl-10 pr-4 text-lg font-semibold text-surface-900 outline-none transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-surface-600 dark:bg-surface-700 dark:text-white"
              required
              autoFocus
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`w-full rounded-xl py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl ${
            mode === 'add'
              ? 'bg-gradient-to-r from-primary-500 to-primary-700 shadow-primary-500/30'
              : 'bg-gradient-to-r from-danger-500 to-danger-600 shadow-danger-500/30'
          }`}
        >
          {mode === 'add' ? 'Add Funds' : 'Withdraw Funds'}
        </button>
      </form>
    </Modal>
  );
}
