import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineTrash, HiOutlineCheck } from 'react-icons/hi';
import { formatCurrency, formatDate, getDaysUntilDue } from '../../utils/helpers';
import { getCategoryById } from '../../utils/constants';

const FREQUENCY_LABELS = {
  once: 'One-time',
  weekly: 'Weekly',
  monthly: 'Monthly',
  yearly: 'Yearly',
};

export default function ReminderCard({ reminder, currency, onDelete, onMarkPaid }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const daysUntil = getDaysUntilDue(reminder.due_date);
  const category = reminder.category ? getCategoryById(reminder.category) : null;

  // Status determination
  let statusColor, statusBg, statusText, statusDarkBg;
  if (reminder.is_paid) {
    statusColor = 'text-surface-400';
    statusBg = 'bg-surface-100';
    statusDarkBg = 'dark:bg-surface-800';
    statusText = 'Paid';
  } else if (daysUntil < 0) {
    statusColor = 'text-danger-600 dark:text-danger-400';
    statusBg = 'bg-danger-50';
    statusDarkBg = 'dark:bg-danger-500/10';
    statusText = `${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? 's' : ''} overdue`;
  } else if (daysUntil <= 3) {
    statusColor = 'text-warning-500';
    statusBg = 'bg-warning-50';
    statusDarkBg = 'dark:bg-warning-500/10';
    statusText = daysUntil === 0 ? 'Due today' : `${daysUntil} day${daysUntil !== 1 ? 's' : ''} left`;
  } else {
    statusColor = 'text-success-600 dark:text-success-400';
    statusBg = 'bg-success-50';
    statusDarkBg = 'dark:bg-success-500/10';
    statusText = `${daysUntil} days left`;
  }

  const handleDelete = () => {
    if (showConfirm) {
      onDelete(reminder.id);
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
      className={`group rounded-2xl border border-surface-200 bg-white p-4 sm:p-5 transition-shadow hover:shadow-lg dark:border-surface-800 dark:bg-surface-900 ${
        reminder.is_paid ? 'opacity-60' : ''
      }`}
    >
      {/* Header */}
      <div className="mb-3 sm:mb-4 flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-2xl sm:h-12 sm:w-12 dark:bg-primary-500/10">
            {category ? category.icon : '\uD83D\uDD14'}
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-surface-900 dark:text-white">
              {reminder.name}
            </h4>
            <p className="text-xs text-surface-400">{formatDate(reminder.due_date)}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {/* Frequency badge */}
          <span className="rounded-lg bg-primary-50 px-2 py-0.5 text-xs font-bold text-primary-600 dark:bg-primary-500/10 dark:text-primary-400">
            {FREQUENCY_LABELS[reminder.frequency] || reminder.frequency}
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

      {/* Amount */}
      <div className="mb-2.5 sm:mb-3 flex items-end justify-between">
        <span className="text-base sm:text-lg font-bold text-surface-900 dark:text-white">
          {formatCurrency(reminder.amount, currency)}
        </span>
        {category && (
          <span className="text-xs text-surface-400">{category.name}</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold ${statusBg} ${statusColor} ${statusDarkBg}`}>
          {statusText}
        </span>
        <div className="flex items-center gap-1.5">
          {!reminder.is_paid && (
            <button
              onClick={() => onMarkPaid(reminder.id)}
              className="flex items-center gap-1 rounded-lg bg-success-50 px-2.5 py-1.5 text-xs font-semibold text-success-600 transition-colors hover:bg-success-100 dark:bg-success-500/10 dark:text-success-400 dark:hover:bg-success-500/20"
            >
              <HiOutlineCheck className="h-3.5 w-3.5" />
              Mark Paid
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
