import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineTrash, HiOutlinePlus, HiOutlineMinus } from 'react-icons/hi';
import { formatCurrency } from '../../utils/helpers';

export default function GoalCard({ goal, currency, onDelete, onAddFunds }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const percent = goal.target_amount > 0
    ? Math.min((goal.current_amount / goal.target_amount) * 100, 100)
    : 0;

  const remaining = goal.target_amount - goal.current_amount;
  const isComplete = goal.current_amount >= goal.target_amount;

  // Deadline countdown
  let deadlineText = 'No deadline';
  if (goal.deadline) {
    const now = new Date();
    const deadline = new Date(goal.deadline);
    const diffMs = deadline - now;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 0) {
      deadlineText = `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      deadlineText = 'Due today';
    } else if (diffDays === 1) {
      deadlineText = '1 day left';
    } else {
      deadlineText = `${diffDays} days left`;
    }
  }

  const handleDelete = () => {
    if (showConfirm) {
      onDelete(goal.id);
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group rounded-2xl border border-surface-200 bg-white p-4 sm:p-5 transition-shadow hover:shadow-lg dark:border-surface-800 dark:bg-surface-900"
    >
      {/* Header */}
      <div className="mb-3 sm:mb-4 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl sm:h-12 sm:w-12"
            style={{ backgroundColor: `${goal.color}15` }}
          >
            {goal.icon}
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-surface-900 dark:text-white">{goal.name}</h4>
            <p className="text-xs text-surface-400">{deadlineText}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span
            className="rounded-lg px-2 py-0.5 text-xs font-bold"
            style={{
              backgroundColor: `${goal.color}15`,
              color: goal.color,
            }}
          >
            {percent.toFixed(0)}%
          </span>
          <button
            onClick={handleDelete}
            className={`rounded-lg p-1.5 transition-all ${
              showConfirm
                ? 'bg-danger-50 text-danger-500 dark:bg-danger-500/10'
                : 'text-surface-300 opacity-100 sm:opacity-0 hover:bg-danger-50 hover:text-danger-500 sm:group-hover:opacity-100 dark:text-surface-600 dark:hover:bg-danger-500/10'
            }`}
          >
            <HiOutlineTrash className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-2.5 sm:mb-3">
        <div className="mb-1.5 flex items-end justify-between">
          <span className="text-base sm:text-lg font-bold text-surface-900 dark:text-white">
            {formatCurrency(goal.current_amount, currency)}
          </span>
          <span className="text-xs sm:text-sm text-surface-400">
            of {formatCurrency(goal.target_amount, currency)}
          </span>
        </div>
        <div className="h-2 sm:h-2.5 overflow-hidden rounded-full bg-surface-100 dark:bg-surface-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ backgroundColor: goal.color }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${isComplete ? 'text-success-500' : 'text-surface-400'}`}>
          {isComplete
            ? 'Goal reached!'
            : `${formatCurrency(remaining, currency)} to go`}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onAddFunds(goal, 'add')}
            className="flex items-center gap-1 rounded-lg bg-primary-50 px-2.5 py-1.5 text-xs font-semibold text-primary-600 transition-colors hover:bg-primary-100 dark:bg-primary-500/10 dark:text-primary-400 dark:hover:bg-primary-500/20"
          >
            <HiOutlinePlus className="h-3.5 w-3.5" />
            Add
          </button>
          <button
            onClick={() => onAddFunds(goal, 'withdraw')}
            className="flex items-center gap-1 rounded-lg bg-surface-50 px-2.5 py-1.5 text-xs font-semibold text-surface-500 transition-colors hover:bg-surface-100 dark:bg-surface-800 dark:text-surface-400 dark:hover:bg-surface-700"
          >
            <HiOutlineMinus className="h-3.5 w-3.5" />
            Withdraw
          </button>
        </div>
      </div>
    </motion.div>
  );
}
